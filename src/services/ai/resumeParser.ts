import { aiClient } from './aiClient';

export interface ParsedResumeData {
  name: string;
  phone?: string;
  email?: string;
  educationLevel: 'iti' | 'diploma' | 'degree' | '10th_pass' | '12th_pass';
  tradeSpecialization: string;
  yearsExperience: number;
  skills: string[];
  recentCompany?: string;
  is_confirmed: boolean;
  requires_candidate_review: boolean;
}

export const resumeParser = {
  async parseResumeText(rawText: string) {
    return aiClient.generateCompletion<ParsedResumeData>({
      featureName: 'resume_parser',
      systemPrompt: 'Extract structured manufacturing profile from candidate resume text. Return valid JSON only.',
      userPrompt: `Parse the following industrial candidate resume:\n${rawText}`,
      fallbackGenerator: () => {
        // Deterministic regex parsing
        const nameMatch = rawText.match(/Name:\s*([^\n\r]+)/i) || rawText.match(/^([A-Z][a-z]+\s+[A-Z][a-z]+)/m);
        const phoneMatch = rawText.match(/(?:\+91[\s-]?)?[6789]\d{9}/);
        const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);

        let educationLevel: 'iti' | 'diploma' | 'degree' | '10th_pass' | '12th_pass' = '10th_pass';
        if (/diploma/i.test(rawText)) educationLevel = 'diploma';
        else if (/iti|machinist|fitter|welder/i.test(rawText)) educationLevel = 'iti';
        else if (/be|btech|degree/i.test(rawText)) educationLevel = 'degree';

        const expMatch = rawText.match(/(\d+)\+?\s*(?:years?|yrs?)/i);
        const yearsExperience = expMatch ? parseInt(expMatch[1], 10) : 1;

        const skills: string[] = [];
        if (/cnc/i.test(rawText)) skills.push('CNC Turning');
        if (/vmc/i.test(rawText)) skills.push('VMC Milling');
        if (/welder|mig|co2/i.test(rawText)) skills.push('MIG Welding');
        if (/vernier|micrometer|caliper/i.test(rawText)) skills.push('Metrology (Vernier / Micrometer)');
        if (/fanuc/i.test(rawText)) skills.push('Fanuc Controls');

        return {
          name: nameMatch ? nameMatch[1].trim() : 'Candidate',
          phone: phoneMatch ? phoneMatch[0] : undefined,
          email: emailMatch ? emailMatch[0] : undefined,
          educationLevel,
          tradeSpecialization: skills[0] || 'Machine Operator',
          yearsExperience,
          skills,
          is_confirmed: false, // Mandatory candidate confirmation gate
          requires_candidate_review: true
        };
      }
    });
  }
};
