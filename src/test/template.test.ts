import { describe, it } from 'node:test';
import assert from 'node:assert';
import { PromptTemplate } from '../template';
import { TokenEstimator } from '../tokenizer';

describe('HyperPrompt Template & Token Estimator', () => {
  it('should interpolate required and default variables', () => {
    const template = new PromptTemplate('You are an expert in {{domain}}. Target audience: {{audience|general public}}.');
    const slots = template.getSlots();

    assert.strictEqual(slots.length, 2);
    assert.strictEqual(slots[0].name, 'domain');
    assert.strictEqual(slots[0].required, true);
    assert.strictEqual(slots[1].name, 'audience');
    assert.strictEqual(slots[1].defaultValue, 'general public');

    const rendered = template.format({ domain: 'Quantum Physics' });
    assert.strictEqual(rendered, 'You are an expert in Quantum Physics. Target audience: general public.');
  });

  it('should throw when a required variable is missing', () => {
    const template = new PromptTemplate('Execute {{command}} immediately.');
    assert.throws(() => {
      template.format({});
    }, /Missing required prompt variables: command/);
  });

  it('should estimate tokens and cost accurately', () => {
    const text = 'Write an optimized Rust function to calculate Fibonacci numbers.';
    const est = TokenEstimator.estimate(text);

    assert.ok(est.estimatedTokens >= 8);
    assert.ok(est.costEstimatesUsd.gpt4o > 0);
    assert.ok(est.costEstimatesUsd.gemini15Pro > 0);
  });
});
