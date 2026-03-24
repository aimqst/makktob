"use client";

import { NovelState } from "@/lib/types";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  state: NovelState;
}

export function NovelOutline({ state }: Props) {
  if (!state.outline) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">مسار القصة</h3>
        <span className="text-xs font-mono px-2 py-0.5 bg-secondary rounded text-muted-foreground">{state.outline.chapters.length} أجزاء</span>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pl-2 custom-scrollbar">
        {state.outline.chapters.map((chapter, idx) => {
          const isCompleted = state.chapters.some(c => c.index === idx);
          const isCurrent = state.currentChapterIndex === idx;

          return (
            <div 
              key={idx}
              className={cn(
                "group p-3 rounded-lg border transition-all duration-300",
                isCurrent 
                  ? "bg-primary/5 border-primary/50 shadow-lg shadow-primary/5" 
                  : isCompleted 
                    ? "bg-secondary/5 border-border" 
                    : "bg-transparent border-transparent opacity-60"
              )}
            >
              <div className="flex items-center gap-3">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={cn(
                      "text-sm font-medium truncate",
                      isCurrent || isCompleted ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {chapter.title}
                    </p>
                    {isCurrent && <span className="text-[10px] font-bold text-primary animate-pulse">مباشر</span>}
                  </div>
                  {(isCurrent || isCompleted) && (
                    <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">
                      {chapter.summary}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
