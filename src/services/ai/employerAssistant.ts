import { aiClient } from './aiClient';

export interface InterviewRubricOutput {
  trade: string;
  evaluationCriteria: Array<{
    area: string;
    maxPoints: number;
    description: string;
  }>;
  technicalQuestions: string[];
  practicalMachineTestGuidelines: string[];
}

export const employerAssistant = {
  async generateInterviewRubric(trade: string) {
    return aiClient.generateCompletion<InterviewRubricOutput>({
      featureName: 'employer_interview_assistant',
      systemPrompt: 'Generate a structured technical evaluation scorecard for manufacturing plant interviews in Pune automotive corridor.',
      userPrompt: `Generate interview evaluation rubric for trade: ${trade}`,
      fallbackGenerator: () => ({
        trade,
        evaluationCriteria: [
          {
            area: 'Practical Machine Operation & Setup',
            maxPoints: 30,
            description: 'Workpiece fixture clamping, tool offset setting, program zero verification.'
          },
          {
            area: 'Metrology & Quality Measurement',
            maxPoints: 25,
            description: 'Accurate reading with Vernier caliper (0.02mm), outside micrometer (0.01mm), and surface roughness check.'
          },
          {
            area: 'Engineering Drawing Interpretation',
            maxPoints: 25,
            description: 'GD&T symbol comprehension, tolerance limits, and projection view reading.'
          },
          {
            area: 'Shopfloor Safety & 5S Discipline',
            maxPoints: 20,
            description: 'PPE compliance, emergency stop awareness, chip disposal, and machine cleanliness.'
          }
        ],
        technicalQuestions: [
          `What is the difference between G00 and G01 in machine program execution?`,
          `How do you compensate for tool wear when dimensional deviation is detected?`,
          `What safety precautions must be followed prior to initiating the cycle start on a CNC/VMC machine?`
        ],
        practicalMachineTestGuidelines: [
          'Hand candidate a machined sample part and request measurement of outer diameter and bore depth using micrometer within 3 minutes.',
          'Verify that candidate inspects oil/coolant level prior to powering the spindle.'
        ]
      })
    });
  }
};
