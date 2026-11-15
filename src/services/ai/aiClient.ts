import { AIFeatureKey, AICompletionRequest, AICompletionResult, AIModelProvider } from './types';
import { getAdminSupabaseClient } from '../../lib/supabase/server';

export class AIClient {
  private featureToggles: Map<AIFeatureKey, boolean> = new Map([
    ['job_description_assistant', true],
    ['resume_parser', true],
    ['explainable_job_matcher', true],
    ['candidate_chat_assistant', true],
    ['employer_interview_assistant', true],
    ['ai_risk_signals', true]
  ]);

  public isFeatureEnabled(feature: AIFeatureKey): boolean {
    return this.featureToggles.get(feature) ?? true;
  }

  public setFeatureEnabled(feature: AIFeatureKey, isEnabled: boolean): void {
    this.featureToggles.set(feature, isEnabled);
  }

  public async generateCompletion<T = any>(request: AICompletionRequest<T>): Promise<AICompletionResult<T>> {
    const startTime = Date.now();
    const promptLen = (request.systemPrompt + request.userPrompt).length;
    const estimatedPromptTokens = Math.ceil(promptLen / 4);

    // 1. Feature Toggle Check
    if (!this.isFeatureEnabled(request.featureName)) {
      const fallbackData = request.fallbackGenerator();
      return {
        success: true,
        status: 'fallback_rule_based',
        provider: 'rule_based_fallback',
        model: 'disabled-fallback',
        data: fallbackData,
        tokensUsed: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        estimatedCostUsd: 0,
        latencyMs: Date.now() - startTime
      };
    }

    // 2. Check for Live Gemini or OpenAI API Key
    const geminiKey = process.env.GEMINI_API_KEY;
    const hasLiveAi = Boolean(geminiKey && !geminiKey.includes('placeholder'));

    if (hasLiveAi) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    { text: `${request.systemPrompt}\n\nUser Request: ${request.userPrompt}` }
                  ]
                }
              ],
              generationConfig: {
                temperature: request.temperature ?? 0.2
              }
            }),
            signal: AbortSignal.timeout(8000)
          }
        );

        if (response.ok) {
          const apiData = await response.json();
          const rawText = apiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const completionTokens = Math.ceil(rawText.length / 4);
          const totalTokens = estimatedPromptTokens + completionTokens;
          const costUsd = (totalTokens / 1000000) * 0.35; // Gemini Flash pricing

          let parsedOutput: any = rawText;
          try {
            // Attempt JSON parse if structured output expected
            const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/) || rawText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              parsedOutput = JSON.parse(jsonMatch[1] || jsonMatch[0]);
            }
          } catch {
            // Keep raw text
          }

          this.logUsage(request.featureName, 'gemini-1.5-flash', estimatedPromptTokens, completionTokens, costUsd, 'success', request.userId);

          return {
            success: true,
            status: 'success',
            provider: 'gemini',
            model: 'gemini-1.5-flash',
            data: parsedOutput,
            tokensUsed: {
              promptTokens: estimatedPromptTokens,
              completionTokens,
              totalTokens
            },
            estimatedCostUsd: costUsd,
            latencyMs: Date.now() - startTime
          };
        }
      } catch (err: any) {
        console.warn(`Live AI call failed for ${request.featureName}, smoothly engaging rule-based fallback:`, err.message);
      }
    }

    // 3. Resilient Deterministic Rule-Based Fallback (Zero crash guarantee)
    const fallbackData = request.fallbackGenerator();
    const fallbackText = JSON.stringify(fallbackData);
    const estCompletionTokens = Math.ceil(fallbackText.length / 4);

    this.logUsage(
      request.featureName,
      'rule-based-fallback',
      estimatedPromptTokens,
      estCompletionTokens,
      0,
      'fallback_rule_based',
      request.userId
    );

    return {
      success: true,
      status: 'fallback_rule_based',
      provider: 'rule_based_fallback',
      model: 'deterministic-rules',
      data: fallbackData,
      tokensUsed: {
        promptTokens: estimatedPromptTokens,
        completionTokens: estCompletionTokens,
        totalTokens: estimatedPromptTokens + estCompletionTokens
      },
      estimatedCostUsd: 0,
      latencyMs: Date.now() - startTime
    };
  }

  private logUsage(
    feature: AIFeatureKey,
    model: string,
    promptTokens: number,
    completionTokens: number,
    costUsd: number,
    status: 'success' | 'fallback_rule_based' | 'failed',
    userId?: string
  ): void {
    const supabase = getAdminSupabaseClient();
    if (supabase) {
      supabase.from('ai_usage_logs').insert({
        feature_name: feature,
        model_name: model,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        estimated_cost_usd: costUsd,
        status,
        user_id: userId || null
      }).then(() => {});
    }
  }
}

export const aiClient = new AIClient();
