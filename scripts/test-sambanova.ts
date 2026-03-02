import type { ChatMessages } from '../types';
import { sambanovaService } from '../services/sambanova';

const messages: ChatMessages[] = [
  { role: 'user', content: 'Test SambaNova service' }
];

(async () => {
  console.log('Starting SambaNova standalone test...');
  const stream = await sambanovaService.chat(messages);
  for await (const chunk of stream) {
    process.stdout.write(chunk);
  }
  console.log('\nSambaNova test finished');
})();
