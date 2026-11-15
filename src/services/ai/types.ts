export type AIFeatureKey =
  | 'job_description_assistant'
  | 'resume_parser'
  | 'explainable_job_matcher'
  | 'candidate_chat_assistant'
  | 'employer_interview_assistant'
  | 'ai_risk_signals';

export type AIModelProvider = 'gemini' | 'openai' | 'anthropic' | 'rule_based_fallback';

export interface AICompletionRequest<T = any> {
  featureName: AIFeatureKey;
  systemPrompt: string;
  userPrompt: string;
  fallbackGenerator: () => T;
  userId?: string;
  temperature?: number;
}

export interface AICompletionResult<T = any> {
  success: boolean;
  status: 'success' | 'fallback_rule_based' | 'failed';
  provider: AIModelProvider;
  model: string;
  data: T;
  tokensUsed: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  estimatedCostUsd: number;
  latencyMs: number;
  error?: string;
}
