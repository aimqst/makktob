import { config } from 'dotenv';
config();

import '@/ai/flows/generate-novel-outline.ts';
import '@/ai/flows/write-novel-chapter.ts';
import '@/ai/flows/update-novel-memory.ts';
