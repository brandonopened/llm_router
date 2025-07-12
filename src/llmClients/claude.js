import {Anthropic} from '@anthropic-ai/sdk';
const anthropic = new Anthropic();

export default async function askClaude(prompt, model = 'claude-3-5-sonnet-20241022') {
  const res = await anthropic.messages.create({
    model: model,
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }]
  });
  // anthropic returns array segments
  return res.content.map(p => p.text).join('');
}
