"use client";

import { useEffect, useRef } from "react";
import { NovelState } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, Feather, Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  state: NovelState;
}

export function NovelViewer({ state }: Props) {
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewerRef.current) {
      const scrollContainer = viewerRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [state.chapters.length]);

  const handleDownload = () => {
    if (!state.outline) return;
    
    let content = `منصة مكتوب تقدم: ${state.outline.novelTitle}\n\n`;
    content += `الملخص العام:\n${state.outline.overallSynopsis}\n\n`;
    content += `--------------------------------------------------\n\n`;
    
    state.chapters.forEach((chapter) => {
      content += `الفصل ${chapter.index + 1}: ${chapter.title}\n\n`;
      content += `${chapter.content}\n\n`;
      content += `--------------------------------------------------\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${state.outline.novelTitle}-عبر-مكتوب.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background" ref={viewerRef}>
      <header className="p-6 md:px-12 md:py-8 border-b border-border bg-white z-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-foreground tracking-tight leading-tight">
              {state.outline?.novelTitle || "رواية جديدة من مكتوب"}
            </h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5 font-bold text-primary">بواسطة مكتوب</span>
              <Separator orientation="vertical" className="h-4 bg-border" />
              <span className="flex items-center gap-1.5"><Feather className="w-4 h-4" /> الطبعة الأولى</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
             <div className="flex items-center gap-2 text-xs text-muted-foreground">
               <Clock className="w-3.5 h-3.5" />
               <span>آخر تحديث {new Date().toLocaleTimeString('ar-SA')}</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                 <span className="text-xs font-bold text-primary">{state.totalWordCount.toLocaleString()} كلمة</span>
               </div>
               {state.status === 'completed' && (
                 <Button size="sm" variant="outline" className="gap-2 rounded-full border-primary text-primary" onClick={handleDownload}>
                   <Download className="w-4 h-4" />
                   تحميل من مكتوب
                 </Button>
               )}
             </div>
          </div>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
          
          {state.outline?.worldBuildingDatabase && (
            <div className="mb-8 p-4 bg-primary/5 rounded-xl border border-primary/10 text-sm text-primary/70 font-body italic text-right">
              مكتوب: تم تثبيت قواعد العالم السردية لضمان الواقعية والعمق.
            </div>
          )}

          {state.outline?.overallSynopsis && (
            <div className="mb-16 p-8 bg-secondary/5 rounded-2xl border border-border/50 relative overflow-hidden group">
               <div className="absolute top-0 left-0 p-4 opacity-10">
                  <Book className="w-16 h-16 text-primary" />
               </div>
               <h3 className="text-lg font-headline font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                 الملخص العام للرواية
               </h3>
               <p className="text-xl font-body leading-relaxed text-foreground/80 italic text-right">
                 {state.outline.overallSynopsis}
               </p>
            </div>
          )}

          <div className="space-y-24">
            {state.chapters.length === 0 && state.status === 'writing' && (
              <div className="text-center py-20 animate-pulse">
                <p className="text-2xl font-headline text-muted-foreground font-medium">مكتوب: ننسج أولى خيوط التاريخ...</p>
              </div>
            )}

            {state.chapters.map((chapter) => (
              <article key={chapter.index} className="animate-fade-in-up">
                <div className="text-center mb-12">
                   <p className="text-sm font-headline font-bold uppercase tracking-[0.3em] text-primary/70 mb-2">الفصل {chapter.index + 1}</p>
                   <h2 className="text-4xl font-headline font-bold text-foreground" style={{ fontFamily: 'Amiri, serif' }}>{chapter.title}</h2>
                   <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-6" />
                </div>
                
                <div className="novel-content text-foreground/90 selection:bg-primary/40 leading-[2.2] text-xl whitespace-pre-wrap text-right" style={{ fontFamily: 'Amiri, serif' }}>
                  {chapter.content}
                </div>

                <div className="mt-12 flex justify-center">
                   <div className="px-4 py-1.5 bg-secondary/20 rounded-full border border-border text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                      نهاية الفصل {chapter.index + 1} &bull; {chapter.wordCount} كلمة &bull; مكتوب
                   </div>
                </div>
                
                {chapter.index < (state.outline?.chapters.length || 0) - 1 && (
                  <div className="mt-24 mb-12 flex justify-center opacity-30">
                    <span className="text-2xl tracking-[1em] text-muted-foreground">***</span>
                  </div>
                )}
              </article>
            ))}
            
            {state.isGenerating && state.status === 'writing' && (
              <div className="py-20 flex flex-col items-center gap-6 animate-pulse">
                 <div className="flex gap-2">
                   <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                   <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                   <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                 </div>
                 <p className="text-lg font-body italic text-muted-foreground">مكتوب: القلم لا يتوقف عن السرد...</p>
              </div>
            )}

            {state.status === 'completed' && (
               <div className="py-32 text-center border-t border-border/50">
                  <h3 className="text-5xl font-headline font-bold text-foreground mb-4 text-primary">النهاية</h3>
                  <p className="text-muted-foreground italic font-body text-xl">شكرًا لأنك كنت شاهداً على ولادة هذه الرواية عبر منصة مكتوب.</p>
               </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
