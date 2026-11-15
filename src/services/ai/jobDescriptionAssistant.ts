import { aiClient } from './aiClient';

export interface JDInputParams {
  trade: string;
  companyName: string;
  cluster: string;
  shiftType?: string;
  monthlySalaryMin?: number;
  monthlySalaryMax?: number;
  busRoute?: string;
  customNotes?: string;
}

export interface JDOutput {
  jobTitle: string;
  summary: string;
  responsibilities: string[];
  safetyRequirements: string[];
  qualifications: string;
  shiftAndPerks: string;
  hasProhibitedFeeTerms: boolean;
  warning?: string;
}

export const jobDescriptionAssistant = {
  async generateJobDescription(params: JDInputParams) {
    const rawInput = `${params.trade} ${params.companyName} ${params.cluster} ${params.customNotes || ''}`.toLowerCase();
    const hasProhibitedFeeTerms = /fee|charge|deposit|pay\s*rs|pay\s*₹|gate\s*pass\s*charge/i.test(rawInput);

    return aiClient.generateCompletion<JDOutput>({
      featureName: 'job_description_assistant',
      systemPrompt: 'You are an industrial HR assistant for auto-ancillary and machining factories in Chakan MIDC Pune. Output valid JSON.',
      userPrompt: `Generate a structured factory job description for: ${JSON.stringify(params)}`,
      fallbackGenerator: () => ({
        jobTitle: `${params.trade} — ${params.cluster}`,
        summary: `${params.companyName} is hiring experienced and certified ${params.trade} professionals for our manufacturing plant in ${params.cluster}. Transparent monthly in-hand salary with confirmed plant perks.`,
        responsibilities: [
          `Setup, operate and monitor ${params.trade} equipment according to engineering production drawings.`,
          'Perform periodic dimensional inspections using Vernier calipers, micrometers, and height gauges.',
          'Record hourly production shift output and scrap logs in plant ERP / register.',
          'Perform daily Total Productive Maintenance (TPM) cleaning, lubrication, and coolant checks.'
        ],
        safetyRequirements: [
          'Mandatory wearing of steel-toe ISI safety shoes and protective safety goggles on the plant floor.',
          'Strict adherence to 5S methodology and Lockout/Tagout (LOTO) protocols during maintenance.'
        ],
        qualifications: 'ITI / Diploma in Mechanical, Production, Machinist or related technical trade. Minimum 1+ years industrial floor experience.',
        shiftAndPerks: `${params.shiftType || 'Rotational 8-hour'} shifts. ${params.busRoute ? `Company bus facility available (${params.busRoute}).` : 'Transport facility provided.'} Subsidized hygienic plant canteen.`,
        hasProhibitedFeeTerms,
        warning: hasProhibitedFeeTerms ? 'Prohibited recruitment fee or deposit demand detected in parameters. Must be purged before publishing.' : undefined
      })
    });
  }
};
