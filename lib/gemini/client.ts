// lib/gemini/client.ts
import { GoogleGenAI } from '@google/genai';

let geminiAiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!geminiAiClient) {
    const apiKey = process.env.GEMINI_API_KEY || '';
    geminiAiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiAiClient;
}
