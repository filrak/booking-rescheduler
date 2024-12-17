import OpenAI from 'openai';
import { useRuntimeConfig } from '#app';

export const usePrompt = async (messages, tools = null) => {
  const config = useRuntimeConfig();

  const openai = new OpenAI({
    apiKey: config.public.openaiApiKey,
    dangerouslyAllowBrowser: true
  });
  
  const completionParams = {
    model: "gpt-4",
    messages,
  };

  // Add tools if they're provided
  if (tools) {
    completionParams.tools = tools;
    completionParams.tool_choice = "auto";
  }
  
  const completion = await openai.chat.completions.create(completionParams);

  return { response: completion?.choices[0]?.message };
}; 