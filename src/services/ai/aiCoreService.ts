import type { AIProvider, ProviderId, StructuredIntent } from "./providers/AIProvider";
import { MockProvider } from "./providers/MockProvider";
import { OpenAIProvider } from "./providers/OpenAIProvider";
import { GeminiProvider } from "./providers/GeminiProvider";
import { AnthropicProvider } from "./providers/AnthropicProvider";
import type { AIContextPayload } from "./contextAssembler";

class AICoreService {
  private providers: Record<ProviderId, AIProvider> = {
    LOCAL: new MockProvider(),
    OPENAI: new OpenAIProvider(),
    GEMINI: new GeminiProvider(),
    CLAUDE: new AnthropicProvider(),
  };

  private activeProviderId: ProviderId = "LOCAL";
  private apiKeys: Record<string, string> = {};

  setProvider(id: ProviderId) {
    this.activeProviderId = id;
  }

  setAPIKey(providerId: ProviderId, key: string) {
    this.apiKeys[providerId] = key;
  }

  getActiveProvider(): AIProvider {
    return this.providers[this.activeProviderId] || this.providers.LOCAL;
  }

  async sendMessage(prompt: string, context: AIContextPayload): Promise<string> {
    const provider = this.getActiveProvider();
    const apiKey = this.apiKeys[this.activeProviderId];
    return provider.sendMessage(prompt, context, apiKey);
  }

  async detectIntent(input: string): Promise<StructuredIntent> {
    const provider = this.getActiveProvider();
    return provider.detectIntent(input);
  }
}

export const aiCoreService = new AICoreService();
