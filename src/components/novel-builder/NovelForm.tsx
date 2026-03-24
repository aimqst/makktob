"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { NovelFormValues } from "@/lib/types";
import { Info, Key, Plus, Trash2, Languages, Settings2, Sparkles, Swords, Clock } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  storySeed: z.string().min(10, "يرجى كتابة فكرة أطول قليلاً").max(2000),
  genre: z.string().default("دراما"),
  tone: z.string().default("جدي"),
  maxWordCount: z.number().min(5000).max(100000),
  characterDetails: z.string().default("شخصيات عميقة ذات دوافع واقعية."),
  worldBuildingDetails: z.string().default("عالم متماسك منطقياً."),
  pov: z.string().default("ضمير الغائب (هو/هي)"),
  narrativeStyle: z.string().default("وصفي أدبي"),
  languageLevel: z.string().default("فصحى متوسطة"),
  dialect: z.string().default("الفصحى الحديثة"),
  targetAudience: z.string().default("جمهور عام"),
  pacing: z.string().default("متوازن"),
  dialogueFrequency: z.string().default("متوسط"),
  emotionalArc: z.enum(['هادئ', 'متصاعد', 'ذروة صادمة', 'متقلب']).default('متصاعد'),
  conflictIntensity: z.string().default("متوسط"),
  storyEra: z.string().default("العصر الحديث"),
  apiKeys: z.string().default(""),
});

const genres = [
  "خيال (Fantasy)", "دراما", "خيال علمي", "رعب", "جريمة وغموض", "رومانسية", 
  "واقعية سحرية", "تاريخي", "نفسي", "مغامرات", "سياسي", "ملحمي"
];

const tones = [
  "جدي", "ساخر", "غامض", "عاطفي", "سوداوي", "متفائل", "فلسفي", "شاعري", "ساخر بمرارة"
];

const dialects = [
  "الفصحى الحديثة", "الفصحى التراثية (جزلة)", "المصرية (عامية مثقفة)", "المصرية (عامية شارع)", 
  "الخليجية", "الشامية", "العراقية", "المغاربية", "السودانية", "اليمنية", "اللغة البيضاء"
];

const povs = [
  "ضمير الغائب (هو/هي) - عليم", "ضمير الغائب - محدود", "ضمير المتكلم (أنا)", "ضمير المخاطب (أنت)", "تعدد الرواة"
];

const styles = [
  "وصفي أدبي مكثف", "سينمائي سريع", "فلسفي تأملي", "بسيط ومباشر", "تجريبي", "قوطي (Gothic)", "تعبيري"
];

const languageLevels = [
  "فصحى تراثية قوية", "فصحى حديثة رصينة", "فصحى متوسطة بسلسة", "لغة بيضاء معاصرة", "مزيج فصحى وعامية"
];

const eras = [
  "العصر الحديث", "المستقبل البعيد", "العصور الوسطى", "العصر الجاهلي", "العصر العباسي", 
  "الثمانينات", "التسعينات", "عصر النهضة", "تاريخ بديل"
];

export function NovelForm({ onSubmit, isLoading }: { onSubmit: (v: NovelFormValues) => void; isLoading: boolean }) {
  const { toast } = useToast();
  const [savedKeys, setSavedKeys] = useState<string[]>([]);
  const [currentKeyInput, setCurrentKeyInput] = useState("");

  const form = useForm<NovelFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      storySeed: "",
      maxWordCount: 30000,
      genre: "دراما",
      tone: "جدي",
      characterDetails: "شخصيات عميقة ذات دوافع واقعية.",
      worldBuildingDetails: "عالم متماسك منطقياً.",
      pov: "ضمير الغائب (هو/هي)",
      narrativeStyle: "وصفي أدبي",
      languageLevel: "فصحى متوسطة",
      dialect: "الفصحى الحديثة",
      targetAudience: "جمهور عام",
      pacing: "متوازن",
      dialogueFrequency: "متوسط",
      emotionalArc: 'متصاعد',
      conflictIntensity: "متوسط",
      storyEra: "العصر الحديث",
      apiKeys: "",
    },
  });

  useEffect(() => {
    const stored = localStorage.getItem("maktoob_keys_v2");
    if (stored) {
      const keys = JSON.parse(stored);
      setSavedKeys(keys);
      form.setValue("apiKeys", keys.join(","));
    }
  }, [form]);

  const handleAddKey = () => {
    if (!currentKeyInput.trim()) return;
    const newKeys = [...savedKeys, currentKeyInput.trim()];
    setSavedKeys(newKeys);
    localStorage.setItem("maktoob_keys_v2", JSON.stringify(newKeys));
    form.setValue("apiKeys", newKeys.join(","));
    setCurrentKeyInput("");
    toast({ title: "تم إضافة مفتاح جديد لتدوير مكتوب" });
  };

  const removeKey = (idx: number) => {
    const newKeys = savedKeys.filter((_, i) => i !== idx);
    setSavedKeys(newKeys);
    localStorage.setItem("maktoob_keys_v2", JSON.stringify(newKeys));
    form.setValue("apiKeys", newKeys.join(","));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Accordion type="single" collapsible defaultValue="basics" className="w-full space-y-4">
          <AccordionItem value="basics" className="border rounded-xl bg-white px-4 shadow-sm">
            <AccordionTrigger className="hover:no-underline text-primary font-bold">
              <div className="flex items-center gap-2"><Sparkles className="w-4 h-4" /><span>بذرة القصة والنوع</span></div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <FormField control={form.control} name="storySeed" render={({ field }) => (
                <FormItem><FormControl><Textarea placeholder="صف فكرتك هنا بالتفصيل الممل..." className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="genre" render={({ field }) => (
                  <FormItem><FormLabel>نوع الرواية</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{genres.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select></FormItem>
                )} />
                <FormField control={form.control} name="storyEra" render={({ field }) => (
                  <FormItem><FormLabel>الحقبة الزمنية</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{eras.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select></FormItem>
                )} />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="narrative" className="border rounded-xl bg-white px-4 shadow-sm">
            <AccordionTrigger className="hover:no-underline text-primary font-bold">
              <div className="flex items-center gap-2"><Languages className="w-4 h-4" /><span>الهوية اللغوية والسردية</span></div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="dialect" render={({ field }) => (
                    <FormItem><FormLabel>اللهجة المطلوبة</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{dialects.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select></FormItem>
                  )} />
                 <FormField control={form.control} name="pov" render={({ field }) => (
                    <FormItem><FormLabel>وجهة النظر (POV)</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{povs.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></FormItem>
                  )} />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="narrativeStyle" render={({ field }) => (
                    <FormItem><FormLabel>الأسلوب الأدبي</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{styles.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></FormItem>
                  )} />
                 <FormField control={form.control} name="languageLevel" render={({ field }) => (
                    <FormItem><FormLabel>مستوى اللغة</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{languageLevels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select></FormItem>
                  )} />
               </div>
               <FormField control={form.control} name="maxWordCount" render={({ field }) => (
                <FormItem><div className="flex justify-between"><FormLabel>إجمالي الكلمات</FormLabel><span className="text-xs font-bold text-primary">{field.value.toLocaleString()} كلمة</span></div><FormControl><Slider min={5000} max={100000} step={5000} defaultValue={[field.value]} onValueChange={(v) => field.onChange(v[0])} /></FormControl></FormItem>
              )} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="advanced" className="border rounded-xl bg-white px-4 shadow-sm">
            <AccordionTrigger className="hover:no-underline text-primary font-bold">
              <div className="flex items-center gap-2"><Settings2 className="w-4 h-4" /><span>إيقاع وشدة الأحداث</span></div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="pacing" render={({ field }) => (
                  <FormItem><FormLabel>وتيرة السرد</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="سريع جداً">سريع جداً (أكشن)</SelectItem><SelectItem value="متوازن">متوازن</SelectItem><SelectItem value="بطيء جداً">بطيء (تأملي)</SelectItem></SelectContent></Select></FormItem>
                )} />
                <FormField control={form.control} name="conflictIntensity" render={({ field }) => (
                  <FormItem><FormLabel>كثافة الصراع</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="منخفض">منخفض (دراما اجتماعية)</SelectItem><SelectItem value="متوسط">متوسط</SelectItem><SelectItem value="دموي/عنيف">دموي/عنيف</SelectItem><SelectItem value="نفسي حاد">نفسي حاد</SelectItem></SelectContent></Select></FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="dialogueFrequency" render={({ field }) => (
                  <FormItem><FormLabel>كثافة الحوار</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="نادر">نادر (وصف فقط)</SelectItem><SelectItem value="متوسط">متوسط</SelectItem><SelectItem value="كثيف جداً">كثيف جداً</SelectItem></SelectContent></Select></FormItem>
                )} />
                <FormField control={form.control} name="tone" render={({ field }) => (
                  <FormItem><FormLabel>نبرة الرواية</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{tones.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></FormItem>
                )} />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="keys" className="border rounded-xl bg-primary/5 px-4 shadow-sm border-primary/20">
            <AccordionTrigger className="hover:no-underline text-primary font-bold">
              <div className="flex items-center gap-2"><Key className="w-4 h-4" /><span>مفاتيح API لتدوير مكتوب</span></div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="flex gap-2">
                <Textarea value={currentKeyInput} onChange={(e) => setCurrentKeyInput(e.target.value)} placeholder="أضف مفتاح Gemini جديد..." className="bg-white min-h-[40px] text-xs font-mono" />
                <Button type="button" size="icon" onClick={handleAddKey}><Plus className="w-4 h-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {savedKeys.map((k, i) => <Badge key={i} variant="secondary" className="gap-2 px-2 py-1 font-mono text-[10px]">{k.substring(0,8)}...<Trash2 className="w-3 h-3 cursor-pointer text-destructive" onClick={() => removeKey(i)} /></Badge>)}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button type="submit" disabled={isLoading} className="w-full h-14 rounded-xl shadow-lg text-lg font-bold">
          {isLoading ? "مكتوب ينسج عالمك..." : "ابدأ العمل الروائي المتكامل"}
        </Button>
      </form>
    </Form>
  );
}
