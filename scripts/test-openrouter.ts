import type { ChatMessages } from '../types';
import { openRouterService } from '../services/openrouter';

const messages: ChatMessages[] = [
  { role: 'user', content: 'Hola, prueba de OpenRouter' }
];

(async () => {
  console.log('Starting OpenRouter standalone test...');
  const stream = await openRouterService.chat(messages);
  for await (const chunk of stream) {
    process.stdout.write(chunk);
  }
  console.log('\nOpenRouter test finished');
})();
