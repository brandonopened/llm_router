import OpenAI from 'openai';
const openai = new OpenAI();

export default async function askOpenAI(prompt, model = 'gpt-4o') {
  const res = await openai.chat.completions.create({
    model: model,
    messages: [{ role: 'user', content: prompt }]
  });
  return res.choices[0].message.content;
}
