import OpenAI from 'openai';
import { useRuntimeConfig } from '#app';

export const usePrompt = async (prompt) => {
  const config = useRuntimeConfig();

  const openai = new OpenAI({
    apiKey: config.openaiApiKey
  });
  
  const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [{   
          role: "system", 
          content: prompt
      }]
  });

  return completion?.choices[0]?.message
}; 