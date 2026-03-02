import { cerebrasService } from '../services/cerebras';

const messages = [
  { role: 'user', content: 'Resume en una frase lo que hace este servicio' }
];

(async () => {
  try {
    console.log('Starting Cerebras standalone test...');
    const stream = await cerebrasService.chat(messages as any);
    for await (const chunk of stream) {
      process.stdout.write(chunk);
    }
    console.log('\nCerebras test finished');
  } catch (err) {
    console.error('Error running Cerebras test:', err);
    process.exit(1);
  }
})();
