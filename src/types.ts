export interface PromptSlot {
  name: string;
  required: boolean;
  defaultValue?: string;
  description?: string;
}

export interface TokenEstimation {
  estimatedTokens: number;
  characterCount: number;
  wordCount: number;
  costEstimatesUsd: {
    gpt4o: number;
    claude35Sonnet: number;
    gemini15Pro: number;
  };
}

export interface AssertionRule {
  type: 'contains' | 'not_contains' | 'matches_regex' | 'json_schema' | 'max_tokens';
  target: string | RegExp;
  description: string;
}

export interface AssertionResult {
  passed: boolean;
  rule: AssertionRule;
  actual?: string;
  errorMessage?: string;
}

export interface EvalReport {
  promptName: string;
  totalAssertions: number;
  passedCount: number;
  failedCount: number;
  durationMs: number;
  results: AssertionResult[];
}
