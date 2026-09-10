// lib/gemini/chat.ts
import { getGeminiClient } from './client';
import { ChatMessage } from '@/types/ai';

const SYSTEM_INSTRUCTION = `You are the April Store AI assistant — knowledgeable, elegant, and concise.
April Store is a luxury fashion brand in Pakistan. You have two roles:

1. STYLE ADVISOR: Help customers find outfits, suggest pairings (e.g. styling the Emerald Raw Silk Wrap Maxi with the Sculptural 24K Vermeil Choker), advise on sizing, and explain how to style pieces for different occasions (weddings, galas, formal dinners, daytime luxury). Be tasteful, poised, and specific.

2. CUSTOMER SUPPORT: Answer questions about orders, shipping (3–7 business days across Pakistan via express courier, flat fee PKR 500), returns (7-day window from delivery for unworn items with tags intact), payment methods (Cash on Delivery + Online bank transfer / JazzCash / Nayapay with receipt upload), and account management.

If asked about a specific order, ask the user for their order ID (e.g. ord-88910).
Keep responses concise — 2–4 sentences unless detail is specifically requested.
Never make up product information. If unsure, say so gracefully.
Store currency is PKR (Pakistani Rupees).
Tone: warm, professional, sophisticated, and courteous.`;

export async function generateChatResponse(messages: ChatMessage[]): Promise<string> {
  try {
    const ai = getGeminiClient();
    
    // Format conversation history for Gemini
    const contents = messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const text = response.text?.trim();
    if (text) return text;
  } catch (error) {
    console.error('Gemini chat generation failed:', error);
  }

  // Graceful fallback if API key is not yet set
  const lastUserMsg = messages[messages.length - 1]?.content.toLowerCase() || '';
  if (lastUserMsg.includes('shipping') || lastUserMsg.includes('delivery')) {
    return 'We offer nationwide express delivery across Pakistan within 3–7 business days for a flat rate of PKR 500. Orders above PKR 50,000 receive complimentary express shipping.';
  }
  if (lastUserMsg.includes('return') || lastUserMsg.includes('exchange')) {
    return 'April Store offers a 7-day hassle-free exchange and return window from the date of delivery for all unworn garments with original tags and packaging intact.';
  }
  if (lastUserMsg.includes('payment') || lastUserMsg.includes('cod') || lastUserMsg.includes('bank')) {
    return 'We gladly accept Cash on Delivery (COD) as well as secure online bank transfers. When paying online, simply upload your transaction receipt at checkout for swift verification.';
  }
  if (lastUserMsg.includes('dress') || lastUserMsg.includes('silk') || lastUserMsg.includes('wedding')) {
    return 'For festive galas and weddings, our Emerald Raw Silk Wrap Maxi Dress paired with the 24K Vermeil Choker creates an arresting, timeless look. Would you like assistance with sizing?';
  }

  return 'Welcome to April Store. I am your personal style advisor and concierge. How may I assist you with our curated collection or your order today?';
}
