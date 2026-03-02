import type { ChatMessages } from '../types';
import { googleService } from '../services/google';

const messages: ChatMessages[] = [
  { role: 'user', content: 'Test Google GenAI service' }
];

(async () => {
  console.log('Starting Google standalone test...');
  const stream = await googleService.chat(messages);
  for await (const chunk of stream) {
    process.stdout.write(chunk);
  }
  console.log('\nGoogle test finished');
})();
