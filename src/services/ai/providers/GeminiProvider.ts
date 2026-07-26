import type { AIProvider, StructuredIntent } from "./AIProvider";
import { MockProvider } from "./MockProvider";

export class GeminiProvider implements AIProvider {
  id = "GEMINI" as const;
  name = "Google Gemini 1.5 Pro Provider";
  private fallback = new MockProvider();

  async sendMessage(prompt: string, contextPayload: any, apiKey?: string): Promise<string> {
    if (!apiKey) return this.fallback.sendMessage(prompt, contextPayload);
    return this.fallback.sendMessage(prompt, contextPayload);
  }

  async detectIntent(input: string): Promise<StructuredIntent> {
    return this.fallback.detectIntent(input);
  }
}
