import OpenAI from 'openai';
import { useRuntimeConfig } from '#app';

export const usePrompt = () => {
  const config = useRuntimeConfig();
  
  const openai = new OpenAI({
    apiKey: config.openaiApiKey
  });

  return {
    openai
  };
}; 