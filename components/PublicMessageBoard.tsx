
import React, { useState, useEffect, useRef } from 'react';
import { PublicMessage, EvacuatorLanguage } from '../types';

const STORAGE_KEY = 'safepoint_public_messages_v1';

const PublicMessageBoard: React.FC<{ lang: EvacuatorLanguage; isAdmin: boolean }> = ({ lang, isAdmin }) => {
  const [messages, setMessages] = useState<PublicMessage[]>([]);
  const [input, setInput] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadMessages = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { 
        setMessages(JSON.parse(saved)); 
      } catch (e) {
        console.error("Failed to load public messages", e);
      }
    } else {
      // Seed initial tactical communications
      const defaults: PublicMessage[] = [
        { id: '1', text: 'Zwiększona obecność służb w rejonie Wałów Chrobrego. 🚢', timestamp: Date.now() - 3600000, isAdmin: false, userHandle: 'OBYWATEL_104' },
        { id: '2', text: '⚠ KOMUNIKAT ADMINA: Wszystkie schrony w sektorze Centrum są obecnie otwarte i monitorowane. ⚠', timestamp: Date.now() - 7200000, isAdmin: true, userHandle: 'ADMIN_HQ' },
        { id: '3', text: 'Dostęp do darmowego WiFi w schronie CH Kaskada został przywrócony. 📶', timestamp: Date.now() - 14400000, isAdmin: false, userHandle: 'WEZEL_DELTA' },
      ];
      setMessages(defaults);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handlePost = () => {
    const cleanInput = input.trim();
    if (!cleanInput || cleanInput.length > 280) return;

    const newMessage: PublicMessage = {
      id: Date.now().toString(),
      text: cleanInput,
      timestamp: Date.now(),
      isAdmin: isAdmin,
      userHandle: isAdmin ? 'ADMIN_HQ' : `OBYWATEL_${Math.floor(1000 + Math.random() * 9000)}`,
    };

    const updated = [newMessage, ...messages].slice(0, 100); 
    setMessages(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setInput('');
  };

  const charCount = input.length;
  const isOverLimit = charCount > 280;
  const isPl = lang === EvacuatorLanguage.PL;

  const helpText = isPl 
    ? "📢 TABLICA PUBLICZNA: Miejsce anonimowej wymiany informacji między mieszkańcami. Możesz tu przeczytać ostrzeżenia o utrudnieniach lub komunikaty od administracji sztabu (oznaczone na żółto)."
    : "📢 PUBLIC BOARD: A place for anonymous information exchange among residents. You can read warnings about obstructions or messages from HQ administration (highlighted in yellow).";

  return (
    <div className="flex flex-col h-full bg-black border-2 border-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl font-mono relative">
      
      {showHelp && (
        <div className="absolute inset-0 z-[50] bg-black/95 p-8 flex flex-col items-center justify-center text-center animate-fadeIn">
          <span className="text-4xl mb-4">❔</span>
          <p className="text-sm font-black text-white uppercase italic leading-relaxed mb-6">{helpText}</p>
          <button onClick={() => setShowHelp(false)} className="bg-red-700 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase">OK</button>
        </div>
      )}

      {/* Tactical Navigation Header */}
      <div className="bg-zinc-950 p-6 border-b-2 border-yellow-600 flex justify-between items-center shadow-lg z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-3 h-3 bg-yellow-500 rounded-full animate-ping opacity-40"></div>
          </div>
          <h3 className="font-black text-white text-xs uppercase tracking-[0.3em] italic">
            {isPl ? 'TABLICA_OGŁOSZEŃ_SEKTORA' : 'SECTOR_MESSAGE_BOARD'}
          </h3>
          <button onClick={() => setShowHelp(true)} className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center text-zinc-600 hover:text-white transition-all text-[10px]">❔</button>
        </div>
        <button 
          onClick={loadMessages}
          className="text-[10px] bg-zinc-900 hover:bg-zinc-800 px-5 py-2.5 rounded-xl text-yellow-500 font-black uppercase transition-all border border-yellow-600/30 active:scale-95 flex items-center gap-2 group"
        >
          <span className="group-hover:rotate-180 transition-transform duration-500">⟳</span>
          {isPl ? 'ODŚWIEŻ' : 'REFRESH'}
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-black tactical-grid" ref={scrollRef}>
        <div className="bg-yellow-500/10 p-5 rounded-3xl border border-yellow-600/40 text-[10px] text-yellow-500 font-black uppercase tracking-wider mb-8 flex items-start gap-4 backdrop-blur-md">
          <span className="text-2xl mt-1">📢</span>
          <p className="leading-relaxed italic">
            {isPl 
              ? 'UWAGA: System bez rejestracji. Wszystkie komunikaty są publiczne i anonimowe. Szanuj innych użytkowników sektora Szczecin.' 
              : 'NOTICE: Public board, no registration. All messages are anonymous and public. Respect other users in the Szczecin Sector.'}
          </p>
        </div>

        {[...messages].reverse().map((msg) => (
          <div 
            key={msg.id} 
            className={`p-6 rounded-[2.5rem] border-2 animate-fadeIn transition-all duration-300 relative group ${
              msg.isAdmin 
                ? 'bg-yellow-600/10 border-yellow-600 shadow-[0_15px_40px_rgba(234,179,8,0.15)]' 
                : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                <span className={`text-[12px] font-black uppercase flex items-center gap-2 ${msg.isAdmin ? 'text-yellow-500' : 'text-zinc-400'}`}>
                  {msg.isAdmin && <span className="text-xl animate-pulse">⚠</span>}
                  {msg.userHandle}
                  {msg.isAdmin && <span className="text-[8px] bg-yellow-600 text-black px-2 py-0.5 rounded font-black tracking-widest ml-2">OFFICIAL</span>}
                </span>
                <span className="text-[8px] text-zinc-600 font-black tracking-[0.2em] uppercase mt-1">
                  SEC_ID: {msg.id.slice(-6)} • NODE_SYNC_OK
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-zinc-500 font-black uppercase tabular-nums block">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <span className="text-[7px] text-zinc-700 font-black uppercase tracking-tighter">
                   {new Date(msg.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
            <p className={`text-base leading-relaxed break-words font-sans font-bold ${msg.isAdmin ? 'text-white' : 'text-zinc-300'}`}>
              {msg.text}
            </p>
          </div>
        ))}
      </div>

      {/* Tactical Input Terminal */}
      <div className="p-8 bg-zinc-950 border-t-2 border-zinc-900 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-4xl mx-auto flex flex-col gap-5">
          <div className="relative">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={280}
              className={`w-full bg-black border-4 rounded-[2.5rem] p-8 text-lg text-white focus:border-yellow-600 outline-none resize-none h-32 transition-all font-sans font-bold placeholder:text-zinc-800 shadow-inner ${
                isOverLimit ? 'border-red-600' : 'border-zinc-800'
              }`}
              placeholder={isPl ? 'NADAJ KOMUNIKAT DO SEKTORA...' : 'TRANSMIT COMMUNIQUE TO SECTOR...'}
            />
            <div className="absolute bottom-6 right-8 flex items-center gap-4">
              <div className={`text-[11px] font-black px-3 py-1.5 rounded-xl border-2 transition-colors ${isOverLimit ? 'text-red-500 border-red-600 bg-red-900/20' : 'text-zinc-600 border-zinc-800 bg-black'}`}>
                {charCount} / 280
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-3">
               <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-red-600 animate-pulse' : 'bg-zinc-700'}`}></span>
               <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em] italic">
                 {isAdmin ? 'TRYB_NADAWANIA_ADMINISTRACYJNEGO' : 'POŁĄCZENIE_OBYWATELSKIE_P2P'}
               </p>
            </div>
            <button 
              onClick={handlePost}
              disabled={!input.trim() || isOverLimit}
              className={`px-12 py-5 rounded-[2rem] text-[12px] font-black uppercase shadow-2xl active:scale-95 transition-all flex items-center gap-4 border-b-8 ${
                !input.trim() || isOverLimit 
                  ? 'bg-zinc-800 text-zinc-600 border-zinc-900 cursor-not-allowed' 
                  : 'bg-yellow-600 hover:bg-yellow-500 text-black border-yellow-800 shadow-[0_15px_30px_rgba(234,179,8,0.3)]'
              }`}
            >
              {isPl ? 'WYŚLIJ KOMUNIKAT' : 'SEND MESSAGE'}
              <span className="text-xl">📡</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicMessageBoard;
