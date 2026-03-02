import type { ChatMessages } from '../types';
import { groqService } from '../services/groq';

const messages: ChatMessages[] = [
  { role: 'user', content: 'Test Groq service' }
];

(async () => {
  console.log('Starting Groq standalone test...');
  const stream = await groqService.chat(messages);
  for await (const chunk of stream) {
    process.stdout.write(chunk);
  }
  console.log('\nGroq test finished');
})();
