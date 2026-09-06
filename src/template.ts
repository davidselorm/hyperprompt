import { PromptSlot } from './types';

export class PromptTemplate {
  private rawTemplate: string;
  private slots: Map<string, PromptSlot> = new Map();

  constructor(template: string) {
    this.rawTemplate = template;
    this.parseSlots();
  }

  private parseSlots(): void {
    const slotRegex = /\{\{\s*([a-zA-Z0-9_]+)(?:\|([^}]+))?\s*\}\}/g;
    let match: RegExpExecArray | null;

    while ((match = slotRegex.exec(this.rawTemplate)) !== null) {
      const name = match[1];
      const defaultValue = match[2]?.trim();
      const required = defaultValue === undefined;

      if (!this.slots.has(name)) {
        this.slots.set(name, {
          name,
          required,
          defaultValue
        });
      }
    }
  }

  public getSlots(): PromptSlot[] {
    return Array.from(this.slots.values());
  }

  public format(variables: Record<string, string | number | boolean>): string {
    const missing: string[] = [];

    for (const slot of this.slots.values()) {
      if (slot.required && (variables[slot.name] === undefined || variables[slot.name] === null)) {
        missing.push(slot.name);
      }
    }

    if (missing.length > 0) {
      throw new Error(`Missing required prompt variables: ${missing.join(', ')}`);
    }

    return this.rawTemplate.replace(/\{\{\s*([a-zA-Z0-9_]+)(?:\|([^}]+))?\s*\}\}/g, (_, name, def) => {
      const val = variables[name];
      if (val !== undefined && val !== null) {
        return String(val);
      }
      return def ? def.trim() : '';
    });
  }
}
