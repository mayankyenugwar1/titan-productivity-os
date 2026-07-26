import type { AIProvider, StructuredIntent } from "./AIProvider";
import { MockProvider } from "./MockProvider";

export class OpenAIProvider implements AIProvider {
  id = "OPENAI" as const;
  name = "OpenAI GPT-4o Provider Engine";
  private fallback = new MockProvider();

  async sendMessage(prompt: string, contextPayload: any, apiKey?: string): Promise<string> {
    if (!apiKey) {
      return this.fallback.sendMessage(prompt, contextPayload);
    }

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are TITAN's Wayne OS Executive AI Commander. Context: ${JSON.stringify(contextPayload)}`,
            },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!response.ok) {
        return this.fallback.sendMessage(prompt, contextPayload);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || this.fallback.sendMessage(prompt, contextPayload);
    } catch {
      return this.fallback.sendMessage(prompt, contextPayload);
    }
  }

  async detectIntent(input: string): Promise<StructuredIntent> {
    return this.fallback.detectIntent(input);
  }
}
