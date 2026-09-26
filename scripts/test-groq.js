const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
let key = '';
let model = 'openai/gpt-oss-120b';

env.split(/\r?\n/).forEach(line => {
  if (line.startsWith('GROQ_API_KEY=')) key = line.replace('GROQ_API_KEY=', '').trim().replace(/["']/g, '');
  if (line.startsWith('AI_MODEL=')) model = line.replace('AI_MODEL=', '').trim().replace(/["']/g, '');
});

console.log('Testing Groq with model:', model, 'and key prefix:', key ? key.slice(0, 8) : 'NONE');

fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + key
  },
  body: JSON.stringify({
    model: model,
    messages: [
      { role: 'system', content: 'You are GATE Personal AI Coach. Give 1 sentence advice for Day 1.' },
      { role: 'user', content: 'What should I do right now?' }
    ],
    temperature: 0.3,
    max_tokens: 150
  })
}).then(async r => {
  console.log('HTTP Status:', r.status);
  const data = await r.json();
  console.log('AI Output:', data.choices?.[0]?.message?.content);
}).catch(err => console.error('Error:', err));
