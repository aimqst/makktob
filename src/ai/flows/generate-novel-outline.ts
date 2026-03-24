"use server";

import { ai, getAi } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateNovelOutlineInputSchema = z.object({
  storySeed: z.string(),
  genre: z.string(),
  maxWordCount: z.number(),
  apiKey: z.string().optional(),
});

const ChapterSummarySchema = z.object({
  chapterNumber: z.number().int(),
  title: z.string(),
  summary: z.string(),
  targetChapterWordCount: z.number().int(),
});

const GenerateNovelOutlineOutputSchema = z.object({
  novelTitle: z.string(),
  overallSynopsis: z.string(),
  worldBuildingDatabase: z.object({
    history: z.string(),
    geography: z.string(),
    technologyAndMagic: z.string(),
    socialOrder: z.string(),
  }),
  chapters: z.array(ChapterSummarySchema),
});

/**
 * مهندس المخططات الروائية في مكتوب.
 */
const outlinePrompt = ai.definePrompt({
  name: 'generateNovelOutlinePromptV4',
  input: { schema: GenerateNovelOutlineInputSchema },
  output: { schema: GenerateNovelOutlineOutputSchema },
  prompt: `أنت خبير التخطيط الروائي في منصة "مكتوب". 
مهمتك بناء هيكل درامي لرواية طويلة تهدف للوصول لـ {{maxWordCount}} كلمة.

الاستراتيجية السردية:
- قسم الرواية لعدد فصول يضمن تغطية شاملة (هدف كل فصل 1000 كلمة).
- اجعل كل فصل يمثل "وحدة بناء" درامية مستقلة ومترابطة.

البذرة: "{{storySeed}}"
النوع: "{{genre}}"

أخرج المخطط الآن بالتفصيل الممل لكل فصل.`,
});

export async function generateNovelOutline(input: z.infer<typeof GenerateNovelOutlineInputSchema>) {
  const activeAi = input.apiKey ? getAi(input.apiKey) : ai;
  const { output } = await activeAi.generate({
    prompt: outlinePrompt(input),
    output: { schema: GenerateNovelOutlineOutputSchema }
  });
  if (!output) throw new Error('فشل في بناء مخطط الرواية.');
  return output;
}
