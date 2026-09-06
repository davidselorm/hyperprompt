# HyperPrompt 🚀🧠
> Zero-dependency prompt engineering, token cost estimation, and LLM evaluation engine.

![HyperPrompt Status](https://img.shields.io/badge/HyperPrompt-Active-10b981?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript_5.5-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Zero_Dependencies](https://img.shields.io/badge/Dependencies-Zero-blue?style=for-the-badge)

HyperPrompt is a lightweight, zero-dependency framework for building production prompt systems with variable slots, token budget estimation, and regression evaluation suites.

---

## ⚡ Key Highlights

- **Type-Safe Prompt Slots**: Define dynamic parameters with default fallbacks (`{{topic|AI systems}}`).
- **Subword Token Estimator**: Predict token consumption and API operational costs across GPT-4o, Claude 3.5 Sonnet, and Gemini 1.5 Pro without native C++ compilation.
- **Assertion Regression Runner**: Protect against prompt drift and behavioral degradation.

---

## 🚀 Usage

```typescript
import { PromptTemplate, TokenEstimator } from 'hyperprompt';

const template = new PromptTemplate(
  'You are a senior engineer. Summarize the following {{language}} code:\n{{code}}'
);

const rendered = template.format({
  language: 'TypeScript',
  code: 'const x: number = 42;'
});

const economics = TokenEstimator.estimate(rendered);
console.log(`Estimated Tokens: ${economics.estimatedTokens}`);
console.log(`Estimated Cost (GPT-4o): $${economics.costEstimatesUsd.gpt4o}`);
```

---

## 📄 License
MIT © 2026 [davidselorm](https://github.com/davidselorm)
