import type { NextApiRequest, NextApiResponse } from 'next';
import { consentManager } from '../../../services/whatsapp/consentManager';
import { getAdminSupabaseClient } from '../../../lib/supabase/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'udyogsetu_whatsapp_verify_token_2026';

  // 1. Meta Webhook Handshake (GET)
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === verifyToken) {
      return res.status(200).send(challenge);
    }
    return res.status(403).json({ error: 'Verification token mismatch' });
  }

  // 2. Inbound Message & Delivery Event Receipt (POST)
  if (req.method === 'POST') {
    const body = req.body;

    if (body.object === 'whatsapp_business_account' || body.entry) {
      const entries = body.entry || [];
      const supabase = getAdminSupabaseClient();

      for (const entry of entries) {
        const changes = entry.changes || [];
        for (const change of changes) {
          const value = change.value || {};

          // Handle Inbound Message (Opt-out check)
          if (value.messages && value.messages.length > 0) {
            for (const msg of value.messages) {
              const fromPhone = msg.from;
              const textBody = msg.text?.body || '';

              if (fromPhone && textBody) {
                const result = consentManager.processInboundMessage(fromPhone, textBody);
                if (result.actionTaken === 'opted_out') {
                  console.log(`Candidate ${fromPhone} opted out of WhatsApp notifications via STOP command.`);
                }
              }
            }
          }

          // Handle Delivery Status Receipts
          if (value.statuses && value.statuses.length > 0 && supabase) {
            for (const statusObj of value.statuses) {
              const wamid = statusObj.id;
              const status = statusObj.status; // sent, delivered, read, failed

              if (wamid && status) {
                supabase
                  .from('whatsapp_message_logs')
                  .update({
                    status: status,
                    updated_at: new Date().toISOString()
                  })
                  .eq('whatsapp_message_id', wamid)
                  .then(() => {});
              }
            }
          }
        }
      }

      return res.status(200).json({ status: 'EVENT_RECEIVED' });
    }

    return res.status(200).json({ status: 'OK' });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
