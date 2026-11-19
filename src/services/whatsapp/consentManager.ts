import { getAdminSupabaseClient } from '../../lib/supabase/server';
import { WhatsAppConsentStatus } from './types';

class ConsentManager {
  private localConsentMap = new Map<string, { status: WhatsAppConsentStatus; userId?: string; updatedAt: string }>();

  public hasConsent(phoneNumber: string): boolean {
    const cleanPhone = phoneNumber.replace(/\s+/g, '');
    const entry = this.localConsentMap.get(cleanPhone);
    if (!entry) return true; // Default consent granted upon candidate registration unless opted out
    return entry.status === 'opted_in';
  }

  public recordOptIn(phoneNumber: string, userId?: string): void {
    const cleanPhone = phoneNumber.replace(/\s+/g, '');
    this.localConsentMap.set(cleanPhone, {
      status: 'opted_in',
      userId,
      updatedAt: new Date().toISOString()
    });

    const supabase = getAdminSupabaseClient();
    if (supabase) {
      supabase.from('whatsapp_consent_records').insert({
        phone_number: cleanPhone,
        user_id: userId || null,
        consent_status: 'opted_in',
        consent_source: 'candidate_opt_in'
      }).then(() => {});
    }
  }

  public processInboundMessage(phoneNumber: string, messageText: string): { actionTaken: 'opted_out' | 'opted_in' | 'none'; replyText?: string } {
    const cleanPhone = phoneNumber.replace(/\s+/g, '');
    const cleanText = messageText.trim().toUpperCase();

    if (cleanText === 'STOP' || cleanText === 'UNSUBSCRIBE' || cleanText === 'CANCEL' || cleanText === 'थांबवा') {
      this.localConsentMap.set(cleanPhone, {
        status: 'opted_out',
        updatedAt: new Date().toISOString()
      });

      const supabase = getAdminSupabaseClient();
      if (supabase) {
        supabase
          .from('whatsapp_consent_records')
          .update({ consent_status: 'opted_out', opted_out_at: new Date().toISOString() })
          .eq('phone_number', cleanPhone)
          .then(() => {});
      }

      return {
        actionTaken: 'opted_out',
        replyText: 'You have been unsubscribed from Rozzy WhatsApp alerts. Reply START anytime to re-enable.'
      };
    }

    if (cleanText === 'START' || cleanText === 'UNSTOP' || cleanText === 'सुरू करा') {
      this.recordOptIn(cleanPhone);
      return {
        actionTaken: 'opted_in',
        replyText: 'Welcome back! Rozzy industrial job & interview notifications have been re-enabled.'
      };
    }

    return { actionTaken: 'none' };
  }
}

export const consentManager = new ConsentManager();
