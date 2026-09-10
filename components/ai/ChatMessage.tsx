// components/ai/ChatMessage.tsx
import React from 'react';
import { Sparkles, User } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '@/types/ai';
import { cn } from '@/lib/utils';

export interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={cn(
        'flex items-start gap-2.5 text-[13px] font-sans leading-relaxed animate-slide-up',
        isAssistant ? 'justify-start' : 'justify-end'
      )}
    >
      {isAssistant && (
        <div className="w-6 h-6 rounded-none bg-[#121212] text-[#C5A880] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#121212]">
          <Sparkles className="w-3 h-3" />
        </div>
      )}

      <div
        className={cn(
          'max-w-[82%] rounded-none px-3.5 py-2.5 text-left',
          isAssistant
            ? 'bg-[#FFFFFF] text-[#121212] border border-[#121212]'
            : 'bg-[#121212] text-[#FFFFFF] font-medium border border-[#121212]'
        )}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        <span
          className={cn(
            'text-[9px] block mt-1 font-spartan uppercase tracking-[0.05em]',
            isAssistant ? 'text-[#8E8A83]' : 'text-[#C5A880]'
          )}
        >
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {!isAssistant && (
        <div className="w-6 h-6 rounded-none bg-[#C5A880] text-[#121212] flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-[10px] border border-[#121212]">
          <User className="w-3 h-3" />
        </div>
      )}
    </div>
  );
}

