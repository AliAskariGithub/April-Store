// types/ai.ts
import { Product } from './product';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string | Date;
}

export interface SearchResult {
  products: Product[];
  query: string;
  intent: string;
  matchedCount: number;
}

export interface ReceiptVerification {
  isValid: boolean;
  extractedAmount?: number;
  extractedDate?: string;
  extractedReference?: string;
  bankName?: string;
  confidence: number;
  note: string;
}
