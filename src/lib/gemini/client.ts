import { GoogleGenerativeAI } from '@google/generative-ai';

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set');
  return new GoogleGenerativeAI(apiKey);
}

export async function runAgent(
  model: 'flash' | 'pro',
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const genAI = getGenAI();
  const config = model === 'pro'
    ? { model: 'gemini-2.5-pro', generationConfig: { temperature: 0.5, maxOutputTokens: 4096 } }
    : { model: 'gemini-2.5-flash', generationConfig: { temperature: 0.7, maxOutputTokens: 2048 } };

  const m = genAI.getGenerativeModel(config);
  const result = await m.generateContent([
    { text: `[SYSTEM]\n${systemPrompt}` },
    { text: `[USER]\n${userPrompt}` },
  ]);
  return result.response.text();
}