// components/ai/ChatbotWidget.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sparkles, X, Send, Bot, RefreshCw } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { ChatMessage as ChatMessageType } from '@/types/ai';
import { ChatMessage } from './ChatMessage';
import { Spinner } from '@/components/ui/Spinner';

const INITIAL_MESSAGES: ChatMessageType[] = [
  {
    role: 'assistant',
    content: 'Hi! I am your April Store AI Shopping Assistant. How can I help you find trending fashion, gadgets, or the best deals today?',
    timestamp: new Date(),
  },
];

const PROMPT_SUGGESTIONS = [
  'What are your top trending hoodies?',
  'Tell me about the Air Max 270 sale',
  'What is your free shipping policy?',
  'Recommend noise-cancelling headphones',
];

export function ChatbotWidget() {
  const pathname = usePathname();
  const { isChatOpen, openChat, closeChat } = useUIStore();
  const [messages, setMessages] = useState<ChatMessageType[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [messages, isChatOpen]);

  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  const handleSend = async (contentToSend?: string) => {
    const text = (contentToSend || input).trim();
    if (!text || loading) return;

    const userMessage: ChatMessageType = {
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory }),
      });
      const data = await res.json();
      
      const assistantMessage: ChatMessageType = {
        role: 'assistant',
        content: data.reply || 'I am happy to help you find the best items on April Store!',
        timestamp: new Date(),
      };
      setMessages([...newHistory, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages([
        ...newHistory,
        {
          role: 'assistant',
          content: 'We offer free shipping on orders over $50, 30-day easy returns, and 24/7 support. How can I assist you?',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (pathname?.startsWith('/studio')) {
    return null;
  }

  return (
    <>
      {/* Floating Concierge Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isChatOpen && (
          <button
            type="button"
            onClick={openChat}
            className="group relative flex items-center gap-2.5 bg-gray-900 hover:bg-[#FF5722] text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
            aria-label="Open April Store AI Assistant"
          >
            <div className="w-6 h-6 rounded-full bg-[#FF5722] group-hover:bg-white text-white group-hover:text-[#FF5722] flex items-center justify-center font-bold transition-colors">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold pr-1">
              AI Assistant
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5722] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5722]"></span>
            </span>
          </button>
        )}
      </div>

      {/* Chat Window Panel */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-[380px] h-[540px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-slide-up">
          
          {/* Header */}
          <div className="p-4 bg-gray-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FF5722] text-white flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-white leading-tight">
                  April Store Assistant
                </h4>
                <p className="text-[10px] text-gray-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                  Online • Smart Shopping Guide
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMessages(INITIAL_MESSAGES)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Reset conversation"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={closeChat}
                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} message={msg} />
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-gray-500 italic p-2 bg-white rounded-xl border border-gray-100 shadow-xs">
                <Spinner size="sm" color="primary" />
                <span>April Store Assistant is searching items...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 border-t border-gray-100 bg-white flex gap-1.5 overflow-x-auto no-scrollbar">
              {PROMPT_SUGGESTIONS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(p)}
                  className="text-[11px] whitespace-nowrap bg-gray-100 hover:bg-[#FFF3E0] hover:text-[#FF5722] text-gray-700 px-2.5 py-1 rounded-full transition-colors cursor-pointer flex-shrink-0 font-medium"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-gray-100 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products, sizing, or deals..."
              className="flex-1 text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF5722] transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl bg-[#FF5722] hover:bg-[#F4511E] disabled:opacity-40 text-white flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
