import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * دالة الحصول على نسخة Genkit مع دعم تدوير المفاتيح.
 * تم تصميمها لتعمل بكفاءة عالية دون إعادة تسجيل المكونات.
 */
export function getAi(apiKey?: string) {
  return genkit({
    plugins: [
      googleAI({
        apiKey: apiKey || process.env.GOOGLE_GENAI_API_KEY,
      }),
    ],
    model: 'googleai/gemini-2.5-flash',
  });
}

// النسخة الافتراضية للاستخدام العام
export const ai = getAi();
