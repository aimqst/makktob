"use client";

import { NovelState } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { PenTool, Hash, Layers } from "lucide-react";

interface Props {
  state: NovelState;
}

export function NovelStats({ state }: Props) {
  const totalChapters = state.outline?.chapters.length || 0;
  const currentChapter = state.currentChapterIndex + 1;
  const progress = totalChapters > 0 ? (currentChapter / totalChapters) * 100 : 0;

  return (
    <div className="p-5 bg-secondary/10 border border-border rounded-xl space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">إحصائيات مكتوب</h3>
        <div className="px-2 py-0.5 bg-primary/20 rounded-full border border-primary/20">
           <span className="text-[10px] font-bold text-primary animate-pulse italic">جاري التوليد...</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Layers className="w-3.5 h-3.5" />
            <span className="text-xs">الفصول</span>
          </div>
          <p className="text-xl font-headline font-bold">{currentChapter} / {totalChapters}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Hash className="w-3.5 h-3.5" />
            <span className="text-xs">الكلمات</span>
          </div>
          <p className="text-xl font-headline font-bold">{state.totalWordCount.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-muted-foreground">تقدم الإنجاز</span>
          <span className="text-primary font-bold">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-1.5 bg-secondary/30" />
      </div>

      <div className="pt-2 flex items-center gap-2 text-xs text-muted-foreground italic border-t border-border/50">
        <PenTool className="w-3 h-3 text-primary" />
        {state.status === 'outlining' ? 'مكتوب يرسم الخطوط العريضة...' : `نكتب الآن في الفصل ${currentChapter}...`}
      </div>
    </div>
  );
}
