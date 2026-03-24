"use server";

import { ai, getAi } from '@/ai/genkit';
import { z } from 'genkit';

const UpdateNovelMemoryInputSchema = z.object({
  chapterContent: z.string(),
  currentMemory: z.any(),
  apiKey: z.string().optional(),
});

const UpdateNovelMemoryOutputSchema = z.object({
  updatedMemory: z.object({
    characterBible: z.array(z.object({
      name: z.string(),
      appearance: z.string(),
      psychologicalState: z.string(),
      currentInjuries: z.string(),
      secrets: z.string(),
    })),
    relationshipMatrix: z.string(),
    discoveredTruths: z.array(z.string()),
    worldUpdates: z.string(),
  }),
});

/**
 * نظام التحديث التلقائي للذاكرة لمنع الفجوات المنطقية في مكتوب.
 */
const memoryPrompt = ai.definePrompt({
  name: 'updateNovelMemoryPromptV2',
  input: { schema: UpdateNovelMemoryInputSchema },
  output: { schema: UpdateNovelMemoryOutputSchema },
  prompt: `أنت المحلل السردي والمدقق المنطقي لمنصة "مكتوب". 
مهمتك تحديث الذاكرة العميقة للرواية بناءً على ما حدث في الفصل الأخير.

الذاكرة القديمة:
{{{currentMemory}}}

نص الفصل الجديد:
{{{chapterContent}}}

المطلوب استخراجه وتحديثه:
1. أي إصابات جسدية جديدة (مثلاً: جرح في اليد اليمنى).
2. أي أسرار تم كشفها للقارئ أو الشخصيات.
3. أي تطور في العلاقات (ثقة، خيانة، شجار).
4. أي تفاصيل جديدة عن العالم.

أخرج الذاكرة المحدثة الآن بدقة متناهية لضمان استمرارية منطقية كاملة.`,
});

export async function updateNovelMemory(input: z.infer<typeof UpdateNovelMemoryInputSchema>) {
  const activeAi = input.apiKey ? getAi(input.apiKey) : ai;
  const { output } = await activeAi.generate({
    prompt: memoryPrompt(input),
    output: { schema: UpdateNovelMemoryOutputSchema }
  });
  if (!output) throw new Error('فشل تحديث ذاكرة مكتوب.');
  return output;
}
