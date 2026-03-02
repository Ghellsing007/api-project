import Cerebras from '@cerebras/cerebras_cloud_sdk';
import type { AIServices, ChatMessages } from '../types';

// instantiate with explicit key from environment (optional if env is automatically loaded)
const cerebras = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY,
});

export const cerebrasService: AIServices = {
  name: "Cerebras",
  async chat(messages: ChatMessages[]) {
    // The Cerebras SDK expects message objects with a specific shape.
    // Cast our simple ChatMessages[] to the SDK type at the call site to satisfy overloads.
    const sdkMessages = messages as unknown as any;

    try {
      const stream = await cerebras.chat.completions.create({
        messages: sdkMessages,
        model: 'gpt-oss-120b',
        stream: true,
        max_completion_tokens: 32768,
        temperature: 1,
        top_p: 1,
        reasoning_effort: 'medium'
      });

      return (async function* () {
        // The SDK's return type can be a variety of union types; cast to AsyncIterable<any>
        for await (const chunk of stream as AsyncIterable<any>) {
          yield (chunk.choices?.[0]?.delta?.content || '');
        }
      })();
    } catch (err) {
      // Log full error for debugging, but return a readable AsyncIterable so the server can respond.
      console.error('Cerebras service error:', err);

      const message = (err && (err as any).error?.message) || (err && (err as any).message) || String(err);

      return (async function* () {
        yield `Cerebras error: ${message}`;
      })();
    }
  }
}