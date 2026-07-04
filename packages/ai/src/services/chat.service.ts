import type { AIProvider } from '../providers/provider.interface'
import type { AIMessage, AIContext } from '@ceo-os/shared'

export class ChatService {
  constructor(
    private provider: AIProvider,
    private getApiKey: () => Promise<string>
  ) {}

  async sendMessage(messages: AIMessage[], context: AIContext): Promise<string> {
    const apiKey = await this.getApiKey()
    return this.provider.chat(messages, context, apiKey)
  }

  async getSuggestions(context: AIContext): Promise<string[]> {
    const apiKey = await this.getApiKey()
    return this.provider.getSuggestions(context, apiKey)
  }
}
