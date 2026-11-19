import { WhatsAppTemplateType } from './types';

export interface TemplateDefinition {
  en: string;
  mr: string;
  hi: string;
}

export const TEMPLATES: Record<WhatsAppTemplateType, TemplateDefinition> = {
  application_submitted: {
    en: '✅ Rozzy: Your job application for {{jobTitle}} at {{companyName}} has been successfully submitted. Track your status: https://rozzy.in/candidate/applications',
    mr: '✅ रॉझी: {{companyName}} मधील {{jobTitle}} पदासाठीचा तुमचा अर्ज यशस्वीरीत्या सादर झाला आहे. अर्जाची स्थिती तपासा: https://rozzy.in/candidate/applications',
    hi: '✅ रॉज़ी: {{companyName}} में {{jobTitle}} पद के लिए आपका आवेदन सफलतापूर्वक जमा कर दिया गया है। स्थिति देखें: https://rozzy.in/candidate/applications'
  },
  interview_scheduled: {
    en: '📅 Interview Scheduled: {{companyName}} has invited you for {{jobTitle}} on {{dateTime}} at {{location}}. Please carry original Aadhar and ITI/Diploma marksheets. Reply STOP to unsubscribe.',
    mr: '📅 मुलाखत निश्चित: {{companyName}} ने तुम्हाला {{jobTitle}} पदासाठी {{dateTime}} रोजी {{location}} येथे मुलाखतीस बोलावले आहे. कृपया मूळ आधार व आयटीआय/डिप्लोमा प्रमाणपत्रे सोबत आणावीत. संदेश बंद करण्यासाठी STOP पाठवा.',
    hi: '📅 साक्षात्कार निर्धारित: {{companyName}} ने आपको {{jobTitle}} पद के लिए {{dateTime}} को {{location}} पर साक्षात्कार के लिए आमंत्रित किया है। कृपया मूल आधार और दस्तावेज साथ लाएं।'
  },
  interview_reminder: {
    en: '⏰ Plant Interview Reminder: Your direct plant interview at {{companyName}} is tomorrow, {{dateTime}}. Gate entry requires valid photo ID. Address: {{location}}.',
    mr: '⏰ मुलाखत स्मरणपत्र: {{companyName}} मधील तुमची थेट प्लांट मुलाखत उद्या {{dateTime}} रोजी आहे. प्रवेशासाठी ओळखपत्र आवश्यक. पत्ता: {{location}}.',
    hi: '⏰ साक्षात्कार अनुस्मारक: {{companyName}} में आपका प्रत्यक्ष प्लांट साक्षात्कार कल {{dateTime}} को है। गेट प्रवेश के लिए फोटो आईडी जरूरी है। पता: {{location}}.'
  },
  application_shortlisted: {
    en: '🎉 Congratulations! Your profile has been shortlisted by {{companyName}} for {{jobTitle}}. The HR team will contact you shortly for shift schedule verification.',
    mr: '🎉 अभिनंदन! {{companyName}} ने {{jobTitle}} पदासाठी तुमच्या प्रोफाईलची निवड (Shortlist) केली आहे. पुढील प्रक्रियेसाठी कंपनी लवकरच संपर्क करेल.',
    hi: '🎉 बधाई हो! {{companyName}} ने {{jobTitle}} पद के लिए आपकी प्रोफ़ाइल को शॉर्टलिस्ट किया है। कंपनी की टीम शीघ्र ही आपसे संपर्क करेगी।'
  },
  job_alert_match: {
    en: '🔔 New Matching Industrial Job: {{companyName}} has posted {{jobTitle}} in {{cluster}}. Salary: {{salary}}. Bus & canteen facility available. View: {{jobUrl}}',
    mr: '🔔 नवीन नोकरी संधी: {{companyName}} मध्ये {{cluster}} येथे {{jobTitle}} पदासाठी भरती सुरू आहे. वेतन: {{salary}}. बस व कॅन्टीन सुविधा उपलब्ध. पहा: {{jobUrl}}',
    hi: '🔔 नई औद्योगिक नौकरी: {{companyName}} द्वारा {{cluster}} में {{jobTitle}} पद के लिए अवसर। वेतन: {{salary}}। बस और कैंटीन सुविधा। देखें: {{jobUrl}}'
  },
  offer_letter_issued: {
    en: '📄 Offer Letter Issued: {{companyName}} has released your provisional employment letter for {{jobTitle}}. Login to review terms and accept: https://rozzy.in/candidate/dashboard',
    mr: '📄 नियुक्ती पत्र जारी: {{companyName}} ने {{jobTitle}} पदासाठी तुमचे नियुक्ती पत्र जारी केले आहे. अटी तपासून स्वीकारण्यासाठी लॉगिन करा: https://rozzy.in/candidate/dashboard',
    hi: '📄 नियुक्ति पत्र जारी: {{companyName}} ने {{jobTitle}} पद के लिए आपका प्रस्ताव पत्र जारी किया है। देखने और स्वीकार करने के लिए लॉगिन करें।'
  }
};

export function renderTemplate(
  templateName: WhatsAppTemplateType,
  lang: 'en' | 'mr' | 'hi' = 'en',
  parameters: Record<string, string>
): string {
  const tplDef = TEMPLATES[templateName];
  if (!tplDef) return 'Rozzy Notification';

  let raw = tplDef[lang] || tplDef['en'];

  for (const [key, val] of Object.entries(parameters)) {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    raw = raw.replace(placeholder, val);
  }

  return raw;
}
