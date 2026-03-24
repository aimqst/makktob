"use client";

import { useState } from "react";
import { NovelForm } from "@/components/novel-builder/NovelForm";
import { NovelViewer } from "@/components/novel-builder/NovelViewer";
import { NovelStats } from "@/components/novel-builder/NovelStats";
import { NovelOutline } from "@/components/novel-builder/NovelOutline";
import { NovelState, NovelFormValues, NovelChapter } from "@/lib/types";
import { generateNovelOutline } from "@/ai/flows/generate-novel-outline";
import { writeNovelChapter } from "@/ai/flows/write-novel-chapter";
import { updateNovelMemory } from "@/ai/flows/update-novel-memory";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Wand2, BookOpen, Loader2 } from "lucide-react";

export default function StoryWeaverPage() {
  const { toast } = useToast();
  const [state, setState] = useState<NovelState>({
    isGenerating: false,
    status: 'idle',
    outline: null,
    chapters: [],
    currentChapterIndex: -1,
    totalWordCount: 0,
    activeKeyIndex: 0,
    narrativeMemory: {
      characterBible: [],
      relationshipMatrix: "بداية العلاقات",
      discoveredTruths: [],
      worldUpdates: ""
    }
  });

  const handleStartGeneration = async (values: NovelFormValues) => {
    const uiKeys = values.apiKeys.split(',').map(k => k.trim()).filter(k => k !== "");
    const rotationKeys: (string | undefined)[] = [undefined, ...uiKeys];
    let keyIndex = 0;

    const getActiveKey = () => rotationKeys[keyIndex];

    const rotateKeySilently = (): boolean => {
      if (keyIndex < rotationKeys.length - 1) {
        keyIndex++;
        setState(prev => ({ ...prev, activeKeyIndex: keyIndex }));
        return true;
      }
      return false;
    };

    try {
      setState(prev => ({ 
        ...prev, 
        isGenerating: true, 
        status: 'outlining',
        chapters: [],
        totalWordCount: 0,
        currentChapterIndex: -1,
        error: undefined,
        narrativeMemory: { characterBible: [], relationshipMatrix: "بداية العلاقات", discoveredTruths: [], worldUpdates: "" }
      }));

      let outline = null;
      while (!outline) {
        try {
          outline = await generateNovelOutline({
            storySeed: values.storySeed,
            genre: values.genre,
            maxWordCount: values.maxWordCount,
            apiKey: getActiveKey(),
          });
        } catch (err: any) {
          if ((err.message?.includes('429') || err.message?.toLowerCase().includes('quota')) && rotateKeySilently()) continue;
          throw err;
        }
      }

      setState(prev => ({ ...prev, outline, status: 'writing', currentChapterIndex: 0 }));

      const generatedChapters: NovelChapter[] = [];
      let accumulatedWordCount = 0;
      let deficit = 0;
      let currentMemory = { characterBible: [], relationshipMatrix: "بداية العلاقات", discoveredTruths: [], worldUpdates: "" };

      for (let i = 0; i < outline.chapters.length; i++) {
        setState(prev => ({ ...prev, currentChapterIndex: i }));
        const chapterPlan = outline.chapters[i];
        
        const targetForThisChapter = Math.max(1000, Math.min(2500, 1000 + (deficit > 0 ? Math.ceil(deficit / 3) : 0)));
        const prevSummary = generatedChapters.slice(-5).map(c => `الفصل ${c.index + 1}: ${c.title}.`).join('\n');

        let chapterResult = null;
        while (!chapterResult) {
          try {
            chapterResult = await writeNovelChapter({
              ...values,
              worldBuildingDatabase: outline.worldBuildingDatabase,
              narrativeMemory: currentMemory,
              targetChapterWordCount: targetForThisChapter,
              currentChapterNumber: i + 1,
              currentChapterSummary: chapterPlan.summary,
              previousChaptersSummary: prevSummary,
              previousChapterContent: generatedChapters.length > 0 ? generatedChapters[generatedChapters.length - 1].content.slice(-2000) : "",
              apiKey: getActiveKey(),
              novelGenre: values.genre,
              novelTone: values.tone,
            });
          } catch (err: any) {
            if ((err.message?.includes('429') || err.message?.toLowerCase().includes('quota')) && rotateKeySilently()) continue;
            throw err;
          }
        }

        try {
           const memoryUpdate = await updateNovelMemory({
             chapterContent: chapterResult.chapterContent,
             currentMemory: currentMemory,
             apiKey: getActiveKey(),
           });
           currentMemory = memoryUpdate.updatedMemory;
        } catch (e) {
           console.warn("تحديث الذاكرة فشل، الاستمرار بالذاكرة الحالية.");
        }

        accumulatedWordCount += chapterResult.chapterWordCount;
        const expectedTotalSoFar = (i + 1) * 1000;
        deficit = expectedTotalSoFar - accumulatedWordCount;

        const newChapter: NovelChapter = {
          index: i,
          title: chapterPlan.title,
          content: chapterResult.chapterContent,
          wordCount: chapterResult.chapterWordCount,
          summary: chapterPlan.summary,
        };

        generatedChapters.push(newChapter);
        setState(prev => ({
          ...prev,
          chapters: [...prev.chapters, newChapter],
          totalWordCount: accumulatedWordCount,
          narrativeMemory: currentMemory
        }));
      }

      setState(prev => ({ ...prev, isGenerating: false, status: 'completed' }));
      toast({ title: "اكتمل نسج الرواية!", description: `إجمالي الكلمات: ${accumulatedWordCount.toLocaleString()}` });

    } catch (err: any) {
      setState(prev => ({ ...prev, isGenerating: false, status: 'error', error: err.message }));
      toast({ variant: "destructive", title: "توقف العمل", description: err.message });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <aside className="w-full md:w-96 lg:w-[400px] border-l border-border bg-gray-50 flex flex-col h-screen overflow-hidden">
        <div className="p-6 flex-1 overflow-y-auto scrollbar-hide space-y-8">
          <header className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <Wand2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-primary">مكتوب</h1>
          </header>

          {state.status === 'idle' || state.status === 'error' ? (
            <NovelForm onSubmit={handleStartGeneration} isLoading={state.isGenerating} />
          ) : (
            <div className="space-y-6">
              <NovelStats state={state} />
              <NovelOutline state={state} />
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
        {state.status === 'idle' ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
            <BookOpen className="w-16 h-16 text-primary/20" />
            <h2 className="text-3xl font-bold text-primary">مكتوب: من الفكرة إلى الرواية</h2>
            <p className="max-w-md text-muted-foreground">أدخل بذور قصتك، وسيقوم نظامنا بنسجها بذاكرة لا تنسى ومنطق لا يخطئ تحت إشرافك الإبداعي.</p>
          </div>
        ) : state.status === 'outlining' ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <h3 className="text-xl font-semibold">مكتوب: جاري هندسة المخطط السردي...</h3>
          </div>
        ) : (
          <NovelViewer state={state} />
        )}
      </main>
      <Toaster />
    </div>
  );
}
