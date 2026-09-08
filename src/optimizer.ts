export interface OptimizeOptions {
  stripConsecutiveNewlines?: boolean;
  trimIndent?: boolean;
  removeCommentLines?: boolean;
}

export class PromptOptimizer {
  /**
   * Compresses prompt tokens by stripping redundant formatting while preserving semantically significant content.
   */
  public static optimize(template: string, options: OptimizeOptions = {}): string {
    let result = template;

    // 1. Remove comment lines (# or // at start of line)
    if (options.removeCommentLines ?? true) {
      result = result.replace(/^\s*(#|\/\/)[^\n]*\n?/gm, '');
    }

    // 2. Normalize whitespace and trailing spaces
    if (options.trimIndent ?? true) {
      result = result
        .split('\n')
        .map(line => line.trimEnd())
        .join('\n');
    }

    // 3. Compress 3+ consecutive newlines down to 2
    if (options.stripConsecutiveNewlines ?? true) {
      result = result.replace(/\n{3,}/g, '\n\n');
    }

    return result.trim();
  }

  /**
   * Conditional template interpolation: {{#if var}}content{{/if}}
   */
  public static renderConditionals(template: string, variables: Record<string, any>): string {
    const condRegex = /\{\{#if\s+([a-zA-Z0-9_]+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
    return template.replace(condRegex, (_, varName, innerContent) => {
      const condition = Boolean(variables[varName]);
      return condition ? innerContent : '';
    });
  }
}
