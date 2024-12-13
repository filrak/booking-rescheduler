import OpenAI from 'openai';
import { useRuntimeConfig } from '#app';

export const usePrompt = async (prompt, context = [{   
  role: "system", 
  content: prompt
}]) => {
  const config = useRuntimeConfig();

  const openai = new OpenAI({
    apiKey: config.openaiApiKey
  });
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: context
  });

  return { response: completion?.choices[0]?.message, context: completion };
}; 