import { readFileSync } from 'fs';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI();

const SYSTEM_PROMPT = readFileSync(new URL('./routerPrompt.txt', import.meta.url), 'utf8');

export async function routePrompt(userPrompt) {
  const chat = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.1,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt }
    ]
  });
  let json;
  try {
    json = JSON.parse(chat.choices[0].message.content);
  } catch (err) {
    console.error('Router returned invalid JSON:', chat.choices[0].message.content);
    throw err;
  }
  return json;
}
