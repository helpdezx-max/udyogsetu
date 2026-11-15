import { aiClient } from './aiClient';

export interface CandidateQuery {
  userMessage: string;
  language?: 'en' | 'mr' | 'hi';
}

export const candidateAssistant = {
  async askAssistant(query: CandidateQuery): Promise<{ answer: string; suggestedQuestions: string[] }> {
    const lang = query.language || 'en';
    const msg = query.userMessage.toLowerCase();

    return aiClient.generateCompletion<{ answer: string; suggestedQuestions: string[] }>({
      featureName: 'candidate_chat_assistant',
      systemPrompt: 'You are UdyogSetu AI, an expert industrial recruitment assistant for Chakan MIDC factory workers, ITI trades, and technicians. Be concise, respectful, and factual.',
      userPrompt: `Candidate query in ${lang}: ${query.userMessage}`,
      fallbackGenerator: () => {
        let answer = 'Welcome to UdyogSetu Industrial Assistance. How can I help you find verified plant vacancies in Chakan?';

        if (msg.includes('document') || msg.includes('carry') || msg.includes('कागदपत्र') || msg.includes('interview')) {
          if (lang === 'mr') {
            answer = 'चाकण मधील कंपनी मुलाखतीसाठी खालील कागदपत्रे सोबत ठेवा:\n1. मूळ आधार कार्ड आणि २ छायाप्रती\n2. आयटीआय / डिप्लोमा गुणपत्रिका व प्रमाणपत्र\n3. अद्ययावत बायोडाटा (Resume)\n4. ४ पासपोर्ट साईझ फोटो\n5. मागील कंपनीचे अनुभव प्रमाणपत्र किंवा पगार पावती (लागू असल्यास)\nटीप: कारखान्यात प्रवेश करताना सेफ्टी शूज घालणे आवश्यक आहे.';
          } else if (lang === 'hi') {
            answer = 'चाकण में फैक्ट्री इंटरव्यू के लिए आवश्यक दस्तावेज:\n1. मूल आधार कार्ड और फोटोकॉपी\n2. आईटीआई / डिप्लोमा मार्कशीट और प्रमाण पत्र\n3. अपडेटेड रिज्यूमे\n4. 4 पासपोर्ट फोटो\n5. पिछला अनुभव प्रमाण पत्र (यदि लागू हो)\nनोट: प्लांट में एंट्री के लिए सेफ्टी जूते अनिवार्य हैं।';
          } else {
            answer = 'Mandatory Checklist for Chakan Factory Interviews:\n1. Original Aadhar Card + 2 photocopies\n2. ITI / Diploma / Degree marksheets and passing certificates\n3. 2 updated printed copies of your Resume\n4. 4 passport-size photographs\n5. Relieving letter / last 3 months pay slips from previous plant (if experienced)\nImportant: Wearing ISI steel-toe safety shoes is mandatory for plant floor entry.';
          }
        } else if (msg.includes('vmc') || msg.includes('cnc')) {
          answer = 'CNC & VMC Machine Operators are in high demand across Chakan MIDC Phase 1, Phase 2, and Khed City. Operators familiar with Fanuc, Siemens, or Mitsubishi controllers typically receive confirmed monthly in-hand salaries between ₹18,500 and ₹26,000 with company bus and subsidized canteen facilities.';
        } else if (msg.includes('welder') || msg.includes('वेल्डर')) {
          answer = 'MIG / CO2 Welders are currently needed in automotive chassis and sheet metal pressing units across Kuruli and Chakan Phase 2. Ensure you have practical experience in flat and vertical positions, and valid ITI Welder trade certification.';
        }

        return {
          answer,
          suggestedQuestions: [
            'What documents do I need for a factory walk-in?',
            'Show VMC machine operator vacancies in Chakan Phase 2',
            'Which companies provide company bus facilities from Bhosari?'
          ]
        };
      }
    }).then(res => res.data);
  }
};
