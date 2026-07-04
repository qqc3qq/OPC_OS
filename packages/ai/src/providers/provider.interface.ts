import type { AIMessage, AIContext } from '@ceo-os/shared'

export interface AIProvider {
  readonly name: string
  chat(messages: AIMessage[], context: AIContext, apiKey: string): Promise<string>
  getSuggestions(context: AIContext, apiKey: string): Promise<string[]>
}
