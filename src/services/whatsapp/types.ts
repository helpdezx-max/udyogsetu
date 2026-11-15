export type WhatsAppConsentStatus = 'opted_in' | 'opted_out' | 'pending';

export type WhatsAppTemplateType =
  | 'application_submitted'
  | 'interview_scheduled'
  | 'interview_reminder'
  | 'application_shortlisted'
  | 'job_alert_match'
  | 'offer_letter_issued';

export interface WhatsAppSendParams {
  recipientPhone: string;
  templateName: WhatsAppTemplateType;
  lang: 'en' | 'mr' | 'hi';
  parameters: Record<string, string>;
  idempotencyKey: string;
  userId?: string;
}

export interface WhatsAppSendResult {
  success: boolean;
  messageId?: string;
  isDuplicate: boolean;
  status: 'queued' | 'sent' | 'delivered' | 'failed';
  error?: string;
  renderedText?: string;
}
