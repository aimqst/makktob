"use server";

import { ai, getAi } from '@/ai/genkit';
import { z } from 'genkit';

const WriteNovelChapterInputSchema = z.object({
  storySeed: z.string(),
  novelGenre: z.string(),
  novelTone: z.string(),
  characterDetails: z.string(),
  worldBuildingDatabase: z.any(),
  narrativeMemory: z.any(),
  emotionalArc: z.string().optional(),
  targetChapterWordCount: z.number().int(),
  currentChapterNumber: z.number(),
  currentChapterSummary: z.string(),
  previousChaptersSummary: z.string(),
  previousChapterContent: z.string(),
  narrativeStyle: z.string(),
  languageLevel: z.string().optional(),
  dialect: z.string().optional(),
  targetAudience: z.string().optional(),
  pacing: z.string().optional(),
  dialogueFrequency: z.string().optional(),
  pov: z.string().optional(),
  conflictIntensity: z.string().optional(),
  storyEra: z.string().optional(),
  apiKey: z.string().optional(),
});

const WriteNovelChapterOutputSchema = z.object({
  chapterContent: z.string(),
  chapterWordCount: z.number(),
});

/**
 * تعريف المطالبة خارج الدالة لمنع خطأ الـ 500 وضمان استقرار خادم مكتوب.
 */
const chapterPrompt = ai.definePrompt({
  name: 'writeNovelChapterPromptV6',
  input: { schema: WriteNovelChapterInputSchema },
  output: { schema: WriteNovelChapterOutputSchema },
  prompt: `أنت روائي عالمي في منصة "مكتوب". مهمتك كتابة الفصل رقم {{currentChapterNumber}} بطول مستهدف {{targetChapterWordCount}} كلمة.

إرشادات السرد الفنية (Artistic Guidelines):
- وجهة النظر (POV): "{{pov}}".
- الأسلوب السردي: "{{narrativeStyle}}".
- اللهجة المطلوبة: "{{dialect}}" (التزم بها تماماً في الحوار والسرد).
- مستوى اللغة: "{{languageLevel}}".
- الحقبة الزمنية: "{{storyEra}}".
- شدة الصراع: "{{conflictIntensity}}".
- الجمهور المستهدف: "{{targetAudience}}".
- وتيرة الأحداث (Pacing): "{{pacing}}".
- كثافة الحوار: "{{dialogueFrequency}}".
- نبرة الرواية العامة: "{{novelTone}}".
- منحنى التوتر المطلوب لهذا الفصل: "{{emotionalArc}}"
  * إذا كان "هادئ": ركز على الوصف الأدبي العميق والمونولوج الداخلي.
  * إذا كان "ذروة صادمة": استخدم جمل قصيرة، سريعة، وأحداثاً صادمة ومكثفة.
  * إذا كان "متصاعد": ابنِ التوتر تدريجياً نحو نهاية مشوقة للفصل.

قاعدة الالتزام بالذاكرة العميقة (Deep Memory Protocol):
- الذاكرة الحالية (حقائق الشخصيات والعالم): {{{narrativeMemory}}}
- يجب أن تظل ملامح الشخصيات، إصاباتهم، وأسرارهم ثابتة كما في الذاكرة.
- لا تضف تفاصيل تناقض ما حدث في: "{{{previousChaptersSummary}}}".

السياق الدرامي للفصل الحالي:
"{{{currentChapterSummary}}}"

اكتب الآن بأسلوب "مكتوب" الاحترافي الذي يجمع بين البلاغة الأدبية والمنطق السردي الصارم، مع الالتزام التام باللهجة وكافة الإعدادات الفنية الممررة.`,
});

export async function writeNovelChapter(input: z.infer<typeof WriteNovelChapterInputSchema>) {
  const activeAi = input.apiKey ? getAi(input.apiKey) : ai;
  const { output } = await activeAi.generate({
    prompt: chapterPrompt(input),
    output: { schema: WriteNovelChapterOutputSchema }
  });
  if (!output) throw new Error('فشل في نسج الفصل عبر منصة مكتوب.');
  return output;
}
