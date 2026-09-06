import { TokenEstimation } from './types';

export class TokenEstimator {
  public static estimate(text: string): TokenEstimation {
    const charCount = text.length;
    const words = text.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Subword estimation heuristic:
    // English words ~1.3 tokens/word; punctuation, numbers, code symbols add ~1 token per 3 non-space chars
    const baseWordTokens = wordCount * 1.25;
    const punctuationMatches = text.match(/[{}\[\]()<>=+\-*/:;,."`~@#$%^&|\\]/g);
    const punctuationCount = punctuationMatches ? punctuationMatches.length : 0;
    const codeAdjustment = punctuationCount * 0.45;

    const estimatedTokens = Math.max(1, Math.ceil(baseWordTokens + codeAdjustment));

    // Pricing models per 1M tokens (blended input cost):
    // GPT-4o: $2.50 per 1M input tokens
    // Claude 3.5 Sonnet: $3.00 per 1M input tokens
    // Gemini 1.5 Pro: $1.25 per 1M input tokens
    const costGpt4o = parseFloat(((estimatedTokens / 1_000_000) * 2.50).toFixed(6));
    const costClaude = parseFloat(((estimatedTokens / 1_000_000) * 3.00).toFixed(6));
    const costGemini = parseFloat(((estimatedTokens / 1_000_000) * 1.25).toFixed(6));

    return {
      estimatedTokens,
      characterCount: charCount,
      wordCount,
      costEstimatesUsd: {
        gpt4o: costGpt4o,
        claude35Sonnet: costClaude,
        gemini15Pro: costGemini
      }
    };
  }
}
