import { AssertionRule, AssertionResult, EvalReport } from './types';
import { TokenEstimator } from './tokenizer';

export class PromptEvaluator {
  private rules: AssertionRule[] = [];
  private promptName: string;

  constructor(promptName: string = 'AnonymousPrompt') {
    this.promptName = promptName;
  }

  public addRule(rule: AssertionRule): this {
    this.rules.push(rule);
    return this;
  }

  public evaluate(response: string): EvalReport {
    const startTime = Date.now();
    const results: AssertionResult[] = [];

    for (const rule of this.rules) {
      let passed = false;
      let errorMessage: string | undefined;

      switch (rule.type) {
        case 'contains':
          passed = response.includes(String(rule.target));
          if (!passed) errorMessage = `Response does not contain expected substring: "${rule.target}"`;
          break;

        case 'not_contains':
          passed = !response.includes(String(rule.target));
          if (!passed) errorMessage = `Response contains forbidden substring: "${rule.target}"`;
          break;

        case 'matches_regex':
          const regex = typeof rule.target === 'string' ? new RegExp(rule.target) : rule.target;
          passed = regex.test(response);
          if (!passed) errorMessage = `Response does not match regular expression pattern: ${regex}`;
          break;

        case 'max_tokens':
          const maxAllowed = Number(rule.target);
          const est = TokenEstimator.estimate(response);
          passed = est.estimatedTokens <= maxAllowed;
          if (!passed) errorMessage = `Response exceeded token limit: estimated ${est.estimatedTokens} > ${maxAllowed}`;
          break;

        case 'json_schema':
          try {
            JSON.parse(response);
            passed = true;
          } catch (e: any) {
            passed = false;
            errorMessage = `Response is not valid JSON: ${e.message}`;
          }
          break;
      }

      results.push({
        passed,
        rule,
        actual: response.slice(0, 100),
        errorMessage
      });
    }

    const durationMs = Date.now() - startTime;
    const passedCount = results.filter((r) => r.passed).length;

    return {
      promptName: this.promptName,
      totalAssertions: this.rules.length,
      passedCount,
      failedCount: this.rules.length - passedCount,
      durationMs,
      results
    };
  }
}
