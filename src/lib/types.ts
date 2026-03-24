import { GenerateNovelOutlineOutput } from "@/ai/flows/generate-novel-outline";

export interface NovelChapter {
  index: number;
  title: string;
  content: string;
  wordCount: number;
  summary: string;
}

export interface NarrativeMemory {
  characterBible: Array<{
    name: string;
    appearance: string;
    psychologicalState: string;
    currentInjuries: string;
    secrets: string;
  }>;
  relationshipMatrix: string;
  discoveredTruths: string[];
  worldUpdates: string;
}

export interface NovelState {
  isGenerating: boolean;
  status: 'idle' | 'outlining' | 'writing' | 'completed' | 'error';
  outline: GenerateNovelOutlineOutput | null;
  chapters: NovelChapter[];
  currentChapterIndex: number;
  totalWordCount: number;
  narrativeMemory: NarrativeMemory;
  error?: string;
  activeKeyIndex?: number;
}

export interface NovelFormValues {
  storySeed: string;
  genre: string;
  tone: string;
  maxWordCount: number;
  characterDetails: string;
  worldBuildingDetails: string;
  pov: string;
  narrativeStyle: string;
  languageLevel: string;
  dialect: string;
  targetAudience: string;
  pacing: string;
  dialogueFrequency: string;
  emotionalArc: 'هادئ' | 'متصاعد' | 'ذروة صادمة' | 'متقلب';
  conflictIntensity: string;
  storyEra: string;
  apiKeys: string;
}
