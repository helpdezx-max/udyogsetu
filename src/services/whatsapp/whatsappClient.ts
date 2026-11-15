import { WhatsAppSendParams, WhatsAppSendResult } from './types';
import { renderTemplate } from './templates';
import { consentManager } from './consentManager';
import { getAdminSupabaseClient } from '../../lib/supabase/server';

export class WhatsAppClient {
  private processedKeys = new Set<string>();

  public async sendTemplateMessage(params: WhatsAppSendParams): Promise<WhatsAppSendResult> {
    const { recipientPhone, templateName, lang, parameters, idempotencyKey, userId } = params;

    // 1. Idempotency Check (Prevent duplicate dispatches)
    if (this.processedKeys.has(idempotencyKey)) {
      return {
        success: true,
        isDuplicate: true,
        status: 'delivered',
        messageId: `idemp-${idempotencyKey}`
      };
    }

    // 2. Consent Check (Respect user opt-outs and privacy)
    if (!consentManager.hasConsent(recipientPhone)) {
      return {
        success: false,
        isDuplicate: false,
        status: 'failed',
        error: 'RECIPIENT_OPTED_OUT'
      };
    }

    // 3. Render Message Text
    const renderedText = renderTemplate(templateName, lang, parameters);

    // 4. Check for Live Meta Cloud API Credentials
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const isLiveMetaApi = Boolean(phoneNumberId && accessToken && !accessToken.includes('placeholder'));

    let messageId = `wamid-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    let status: 'queued' | 'sent' | 'delivered' | 'failed' = 'sent';

    if (isLiveMetaApi) {
      try {
        const response = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: recipientPhone.replace('+', ''),
            type: 'text',
            text: { preview_url: true, body: renderedText }
          })
        });

        const data = await response.json();
        if (response.ok && data.messages?.[0]?.id) {
          messageId = data.messages[0].id;
          status = 'delivered';
        } else {
          status = 'failed';
          throw new Error(data.error?.message || 'Meta API error');
        }
      } catch (err: any) {
        console.warn('Meta WhatsApp API dispatch failed, recorded in outbox log:', err.message);
        status = 'failed';
      }
    } else {
      // Offline / Simulation Outbox Mode
      status = 'sent';
    }

    this.processedKeys.add(idempotencyKey);

    // 5. Audit Logging to Supabase
    const supabase = getAdminSupabaseClient();
    if (supabase) {
      supabase.from('whatsapp_message_logs').insert({
        recipient_phone: recipientPhone,
        template_name: templateName,
        language_code: lang,
        idempotency_key: idempotencyKey,
        message_payload: { parameters, renderedText },
        status: status,
        whatsapp_message_id: messageId,
        error_message: status === 'failed' ? 'Meta API delivery failed' : null
      }).then(() => {});
    }

    return {
      success: status !== 'failed',
      messageId,
      isDuplicate: false,
      status,
      renderedText
    };
  }
}

export const whatsappClient = new WhatsAppClient();
