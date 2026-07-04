import OpenAI from 'openai'
import type { AIProvider } from './provider.interface'
import type { AIMessage, AIContext } from '@ceo-os/shared'

export class OpenAIProvider implements AIProvider {
  readonly name = 'openai'

  async chat(messages: AIMessage[], context: AIContext, apiKey: string): Promise<string> {
    const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })
    const systemMessage = this.buildSystemPrompt(context)

    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemMessage },
        ...messages.map(m => ({ role: m.role as 'user' | 'assistant' | 'system', content: m.content })),
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    return response.choices[0]?.message?.content ?? 'No response generated.'
  }

  async getSuggestions(context: AIContext, apiKey: string): Promise<string[]> {
    const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })
    const prompt = this.buildSuggestionsPrompt(context)

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 500,
    })

    const text = response.choices[0]?.message?.content ?? ''
    return text.split('\n').filter(s => s.trim().length > 0).slice(0, 5)
  }

  private buildSystemPrompt(context: AIContext): string {
    return `You are an AI business assistant for a solo entrepreneur running multiple businesses.
Today is ${context.dateContext}.
The user has ${context.projects.length} active projects: ${context.projects.map(p => p.name).join(', ')}.
They have ${context.todayTasks.length} tasks scheduled today.
You have access to their project and task context. Be concise, actionable, and helpful.
Always provide specific, practical advice tailored to their actual work.`
  }

  private buildSuggestionsPrompt(context: AIContext): string {
    return `Based on the following business context, generate 5 actionable suggestions for what the user should focus on today. Return each suggestion on a new line, no numbering, no markdown formatting.

Date: ${context.dateContext}
Active Projects: ${context.projects.map(p => `${p.name} (${p.taskCount} active tasks)`).join(', ')}
Today's Tasks: ${context.todayTasks.map(t => `${t.title} [${t.status}]`).join(', ') || 'None scheduled'}

Suggestions:`
  }
}
