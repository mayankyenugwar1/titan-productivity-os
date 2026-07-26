import type { AIProvider, StructuredIntent } from "./AIProvider";
import { MockProvider } from "./MockProvider";

export class AnthropicProvider implements AIProvider {
  id = "CLAUDE" as const;
  name = "Anthropic Claude 3.5 Sonnet Provider";
  private fallback = new MockProvider();

  async sendMessage(prompt: string, contextPayload: any, apiKey?: string): Promise<string> {
    if (!apiKey) return this.fallback.sendMessage(prompt, contextPayload);
    return this.fallback.sendMessage(prompt, contextPayload);
  }

  async detectIntent(input: string): Promise<StructuredIntent> {
    return this.fallback.detectIntent(input);
  }
}
