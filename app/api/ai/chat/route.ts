// app/api/ai/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse } from '@/lib/gemini/chat';
import { ChatMessage } from '@/types/ai';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const reply = await generateChatResponse(messages as ChatMessage[]);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ 
      reply: 'I am here to assist with any questions regarding April Store collections, sizing, or orders. How may I help you today?' 
    });
  }
}
