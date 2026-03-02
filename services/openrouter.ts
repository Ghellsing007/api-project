import { OpenRouter } from '@openrouter/sdk';
import type { AIServices, ChatMessages } from '../types';

// client configured with env variable; defaultHeaders optional
const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.OPENROUTER_REFERER || '',
    'X-OpenRouter-Title': process.env.OPENROUTER_TITLE || '',
  },
});

export const openRouterService: AIServices = {
  name: 'OpenRouter',
  async chat(messages: ChatMessages[]) {
    try {
      // send without streaming to keep simple
      const completion = await openRouter.chat.send({
        chatGenerationParams: {
          model: 'openai/gpt-5.2',
          messages: messages as any,
          stream: false,
        },
      });

      const text = completion.choices?.[0]?.message?.content || '';
      return (async function* () {
        yield text;
      })();
    } catch (err) {
      console.error('OpenRouter service error', err);
      const message = (err && (err as any).message) || String(err);
      return (async function* () {
        yield `OpenRouter error: ${message}`;
      })();
    }
  },
};
