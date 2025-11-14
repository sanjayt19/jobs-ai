import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

// Don't throw during import time — missing API keys should not crash the whole app.
// When the key is absent we export a null placeholder so the app can render.
if (!apiKey) {
  // eslint-disable-next-line no-console
  console.warn('VITE_OPENAI_API_KEY not set — OpenAI features disabled in this environment');
}

export const openai: any = apiKey
  ? new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true })
  : null;
