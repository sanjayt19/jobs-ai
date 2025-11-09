import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

// OpenAI is optional - if not configured, AI features will show a helpful message
export const openai = apiKey ? new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true
}) : null;

export const isOpenAIConfigured = () => !!apiKey;
