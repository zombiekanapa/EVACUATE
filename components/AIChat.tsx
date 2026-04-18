
import React, { useState, useRef, useEffect } from 'react';
import { generateTextResponse } from '../services/geminiService';
import { ChatMessage, GeminiModelType } from '../types';

interface AIChatProps {
  userLocation: { lat: number; lng: number } | null;
}

const AIChat: React.FC<AIChatProps> = ({ userLocation }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "EVACUATOR_PRO Online. System utilizes Gemini 3 Thinking for survival planning. Ask about shelter routes or verify rumors with Search.",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<GeminiModelType>(GeminiModelType.SMART);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateTextResponse(currentInput, mode, userLocation || undefined);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        timestamp: Date.now(),
        groundingUrls: response.groundingUrls
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (e: any) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "ERR: SIGNAL_LOST. Check local radio frequencies.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black font-mono">
      <div className="bg-zinc-900 p-4 border-b border-white/5 flex justify-between items-center">
        <h3 className="text-yellow-500 font-black text-[10px] tracking-[0.2em] uppercase italic">AI_INTEL_STREAM</h3>
        <div className="flex gap-2">
            <select 
                value={mode} 
                onChange={(e) => setMode(e.target.value as GeminiModelType)}
                className="bg-black text-white text-[9px] border border-zinc-700 rounded-lg px-2 py-1 outline-none font-bold"
            >
                <option value={GeminiModelType.SMART}>🧠 THINKING</option>
                <option value={GeminiModelType.SEARCH}>🔍 SEARCH</option>
                <option value={GeminiModelType.MAPS}>📍 MAPS</option>
                <option value={GeminiModelType.FAST}>⚡ FAST</option>
            </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-fadeIn`}>
            <div className={`max-w-[90%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white font-bold rounded-tr-none' 
                : 'bg-zinc-900 text-zinc-300 border border-yellow-600/20 rounded-tl-none'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-1">
                   {msg.groundingUrls.map((url, i) => (
                     <a key={i} href={url} target="_blank" rel="noreferrer" className="text-[8px] text-blue-400 hover:underline truncate">
                       REF_{i+1}: {url}
                     </a>
                   ))}
                </div>
              )}
            </div>
            <span className="text-[7px] text-zinc-600 mt-1 uppercase font-black">{msg.role} • {new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
        {isLoading && (
            <div className="flex items-center gap-2 text-yellow-500 text-[9px] font-black animate-pulse px-2 uppercase">
                <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                Thinking...
            </div>
        )}
      </div>

      <div className="p-4 bg-zinc-900 border-t border-white/5">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="TYPE_COMMAND..."
            className="flex-1 bg-black border border-zinc-800 text-white rounded-xl px-4 py-3 text-xs outline-none focus:border-yellow-600 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="bg-yellow-600 hover:bg-yellow-500 text-black font-black px-6 py-3 rounded-xl uppercase text-[9px] active:scale-95"
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
