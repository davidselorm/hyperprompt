import { describe, it } from 'node:test';
import assert from 'node:assert';
import { PromptEvaluator } from '../evaluator';

describe('HyperPrompt Regression Evaluator', () => {
  it('should pass valid response assertions', () => {
    const evaluator = new PromptEvaluator('CodeGenerator')
      .addRule({ type: 'contains', target: 'function', description: 'Must contain function keyword' })
      .addRule({ type: 'not_contains', target: 'hallucination', description: 'Must not hallucinate' })
      .addRule({ type: 'max_tokens', target: 50, description: 'Must be concise' });

    const report = evaluator.evaluate('function add(a, b) { return a + b; }');

    assert.strictEqual(report.totalAssertions, 3);
    assert.strictEqual(report.passedCount, 3);
    assert.strictEqual(report.failedCount, 0);
  });

  it('should catch invalid JSON output schema', () => {
    const evaluator = new PromptEvaluator('JsonFormatter')
      .addRule({ type: 'json_schema', target: 'json', description: 'Must parse as JSON' });

    const report = evaluator.evaluate('Not a JSON string');

    assert.strictEqual(report.passedCount, 0);
    assert.strictEqual(report.failedCount, 1);
    assert.ok(report.results[0].errorMessage?.includes('not valid JSON'));
  });
});
