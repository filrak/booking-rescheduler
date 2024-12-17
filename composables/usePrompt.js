import OpenAI from 'openai';
import { useRuntimeConfig } from '#app';

export const usePrompt = async (messages) => {
  const config = useRuntimeConfig();

  const openai = new OpenAI({
    apiKey: config.public.openaiApiKey,
    dangerouslyAllowBrowser: true
  });
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
  });

  return { response: completion?.choices[0]?.message };
}; 