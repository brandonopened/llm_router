import { GoogleGenerativeAI } from '@google/generative-ai';
const genai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

export default async function askGemini(prompt) {
  const res = await model.generateContent(prompt);
  return res.response.text();
}
