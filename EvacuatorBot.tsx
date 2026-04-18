
import React, { useState, useRef, useEffect } from 'react';
import { GeminiModelType, EvacuatorStyle, EvacuatorLanguage, UserDemographic, FontSize, EMERGENCY_TEMPLATES } from '../types';
import { generateTextResponse } from '../services/geminiService';

interface EvacuatorBotProps {
  userLocation: { lat: number; lng: number } | null;
  isAdmin: boolean;
  onReportSystemError: (log: any) => void;
  lang: EvacuatorLanguage;
  setLang: (l: EvacuatorLanguage) => void;
  setGlobalFontSize?: (s: FontSize) => void;
}

const HISTORY_KEY = 'evacuator_chat_history_v18';
const DEMOGRAPHIC_KEY = 'evacuator_user_demographic_v18';

const CRISIS_SYMBOLS = [
  { icon: '🆘', label: 'SOS', text: 'SZYBKIE WEZWANIE POMOCY - SYGNAŁ SOS' },
  { icon: '🏠', label: 'SCHRON', text: 'GDZIE JEST NAJBLIŻSZA BEZPIECZNA JASKINIA?' },
  { icon: '👮', label: 'SŁUŻBY', text: 'WIDZĘ ZAGROŻENIE LUB SŁUŻBY MUNDUROWE' },
  { icon: '🏥', label: 'MEDYK', text: 'POTRZEBUJĘ POMOCY MEDYCZNEJ' },
  { icon: '🥪', label: 'ZAPASY', text: 'POTRZEBUJĘ WODY I JEDZENIA' },
  { icon: '📵', label: 'ŁĄCZNOŚĆ', text: 'MAM PROBLEMY Z TELEFONEM LUB SIECIĄ' },
];

const EvacuatorBot: React.FC<EvacuatorBotProps> = ({ userLocation, lang, setLang, setGlobalFontSize }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string, timestamp: number, demographic?: UserDemographic}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [demographic, setDemographic] = useState<UserDemographic>('UNKNOWN');
  const [ttsEnabled, setTtsEnabled] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPl = lang === EvacuatorLanguage.PL;

  useEffect(() => {
    const savedMsg = localStorage.getItem(HISTORY_KEY);
    const savedDemo = localStorage.getItem(DEMOGRAPHIC_KEY);
    if (savedMsg) try { setMessages(JSON.parse(savedMsg)); } catch (e) {}
    if (savedDemo) {
      setDemographic(savedDemo as UserDemographic);
      handleDemographicShift(savedDemo as UserDemographic);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(messages));
    localStorage.setItem(DEMOGRAPHIC_KEY, demographic);
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handleDemographicShift = (demo: UserDemographic) => {
    if (setGlobalFontSize) {
      if (demo === 'SENIOR') setGlobalFontSize(FontSize.XLARGE);
      else if (demo === 'JUNIOR') setGlobalFontSize(FontSize.SMALL);
      else setGlobalFontSize(FontSize.MEDIUM);
    }
  };

  const speakText = (text: string) => {
    if (!ttsEnabled) return;
    const synth = window.speechSynthesis;
    if (synth.speaking) synth.cancel();
    
    const utter = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    
    // Select best voice for the current language
    const langCode = isPl ? 'pl-PL' : 'en-US';
    const voice = voices.find(v => v.lang.startsWith(langCode)) || voices[0];
    
    if (voice) utter.voice = voice;
    utter.lang = langCode;
    
    // Adjust rate for seniors
    utter.rate = demographic === 'SENIOR' ? 0.8 : 1.0;
    utter.pitch = demographic === 'JUNIOR' ? 1.2 : 1.0;
    
    synth.speak(utter);
  };

  const handleSend = async (customPrompt?: string) => {
    const messageToSend = customPrompt || input;
    if (!messageToSend.trim() || isLoading) return;
    
    const userMsg = { role: 'user' as const, text: messageToSend, timestamp: Date.now(), demographic };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await generateTextResponse(messageToSend, GeminiModelType.FAST, userLocation || undefined, { 
        style: EvacuatorStyle.STANDARD, 
        lang: lang, 
        useJson: true, 
        currentDemographic: demographic
      });
      
      if (result.detectedDemographic && result.detectedDemographic !== demographic) {
        setDemographic(result.detectedDemographic as UserDemographic);
        handleDemographicShift(result.detectedDemographic as UserDemographic);
      }

      const botMsg = { 
        role: 'model' as const, 
        text: result.text, 
        timestamp: Date.now(), 
        demographic: (result.detectedDemographic as UserDemographic) || demographic 
      };

      setMessages(prev => [...prev, botMsg]);
      if (ttsEnabled) speakText(result.text);

    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: isPl ? "BRAK ŁĄCZNOŚCI ZE SZTABEM." : "CONNECTION LOST WITH HQ.", timestamp: Date.now() }]);
    } finally { 
      setIsLoading(false); 
    }
  };

  return (
    <div className={`h-full flex flex-col transition-all duration-500 overflow-hidden relative ${
      demographic === 'SENIOR' ? 'bg-white text-black' : 
      demographic === 'JUNIOR' ? 'bg-indigo-950/20' : 'bg-zinc-950'
    }`}>
      
      {/* Bot Header with Flags */}
      <div className={`p-4 flex justify-between items-center border-b z-20 transition-colors ${
        demographic === 'SENIOR' ? 'bg-blue-900 border-blue-950 text-white' : 
        demographic === 'JUNIOR' ? 'bg-purple-900/30 border-purple-500/20' : 'bg-zinc-900/50 border-white/5'
      }`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl filter drop-shadow-lg">
            {demographic === 'JUNIOR' ? '🧸' : demographic === 'SENIOR' ? '👴' : '🛡️'}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`font-black uppercase text-xs tracking-widest ${demographic === 'SENIOR' ? 'text-white underline decoration-2' : ''}`}>
                {demographic === 'JUNIOR' ? (isPl ? 'PRZYJACIEL RATOWNIK' : 'RESCUE FRIEND') : 
                 demographic === 'SENIOR' ? (isPl ? 'OPIEKUN AI' : 'AI GUARDIAN') : 'RATOWNIK AI'}
              </h2>
              {/* Language Flags */}
              <div className="flex gap-1.5 ml-1">
                <button onClick={() => setLang(EvacuatorLanguage.PL)} className={`text-base hover:scale-125 transition-transform ${lang === EvacuatorLanguage.PL ? 'grayscale-0 scale-110' : 'grayscale opacity-50'}`}>🇵🇱</button>
                <button onClick={() => setLang(EvacuatorLanguage.EN)} className={`text-base hover:scale-125 transition-transform ${lang === EvacuatorLanguage.EN ? 'grayscale-0 scale-110' : 'grayscale opacity-50'}`}>🇬🇧</button>
              </div>
            </div>
            <p className="text-[7px] font-black opacity-50 uppercase tracking-widest leading-none">
              {demographic !== 'UNKNOWN' ? `DEMO_${demographic}_ACTIVE` : 'USER_DETECTION_LIVE'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              if (!ttsEnabled) speakText(isPl ? "Głos włączony." : "Voice enabled.");
              setTtsEnabled(!ttsEnabled);
            }} 
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border shadow-lg ${
              ttsEnabled ? 'bg-yellow-500 border-yellow-600 text-black animate-pulse' : 'bg-white/5 border-white/10 text-zinc-500'
            }`}
            title="Toggle Text-to-Speech"
          >
            {ttsEnabled ? '🔊' : '🔇'}
          </button>
          <button 
            onClick={() => {setMessages([]); setDemographic('UNKNOWN'); if(setGlobalFontSize) setGlobalFontSize(FontSize.MEDIUM);}} 
            className="text-[8px] text-zinc-400 uppercase font-black px-3 py-1.5 bg-white/5 rounded-xl border border-white/5 hover:bg-red-900 hover:text-white transition-all"
          >
            RESET
          </button>
        </div>
      </div>

      {/* Message Area */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar tactical-grid`} ref={scrollRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-fadeIn`}>
             <div className={`max-w-[88%] p-5 rounded-3xl border shadow-2xl relative transition-all duration-500 ${
               msg.role === 'user' 
                ? 'bg-zinc-800 border-white/10 rounded-tr-none text-white' 
                : msg.demographic === 'SENIOR' ? 'bg-white text-black border-blue-900 border-4 rounded-tl-none font-black text-2xl' : 
                  msg.demographic === 'JUNIOR' ? 'bg-gradient-to-br from-indigo-900 to-purple-900 border-purple-400/30 rounded-tl-none text-indigo-50 font-medium italic' : 
                  'bg-zinc-900/80 border-white/5 rounded-tl-none backdrop-blur-xl text-zinc-100'
             }`}>
                <p className="whitespace-pre-wrap leading-relaxed tracking-tight">{msg.text}</p>
             </div>
             <span className="text-[7px] text-zinc-600 mt-1 uppercase font-black px-2 tabular-nums">
               {msg.role} • {new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
             </span>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-3 px-6 animate-pulse">
            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
            <div className="text-[10px] font-black text-red-600 uppercase tracking-widest italic">
              {isPl ? 'PRZETWARZANIE_INTELU...' : 'PROCESSING_INTEL...'}
            </div>
          </div>
        )}
      </div>

      {/* Footer Interface */}
      <div className={`border-t p-4 space-y-4 shadow-[0_-10px_40px_rgba(0,0,0,0.4)] ${demographic === 'SENIOR' ? 'bg-blue-50 border-blue-200' : 'bg-zinc-950 border-white/5'}`}>
        
        {/* Silent Crisis Symbol Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
           {CRISIS_SYMBOLS.map(sym => (
             <button 
                key={sym.label}
                onClick={() => handleSend(sym.text)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all active:scale-95 group border shadow-md ${
                  demographic === 'SENIOR' ? 'bg-white border-blue-900 text-blue-900' : 'bg-white/5 border-white/5 hover:border-red-600'
                }`}
             >
                <span className="text-2xl group-hover:scale-125 transition-transform mb-1">{sym.icon}</span>
                <span className="text-[7px] font-black uppercase group-hover:text-red-500 text-center leading-none tracking-tighter">
                  {isPl ? sym.label : sym.label}
                </span>
             </button>
           ))}
        </div>

        {/* Input Control */}
        <div className="flex gap-3 max-w-5xl mx-auto">
          <textarea 
            rows={1}
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} 
            placeholder={isPl ? "OPISZ SYTUACJĘ LUB KLIKNIJ SYMBOL POWYŻEJ..." : "DESCRIBE SITUATION OR CLICK SYMBOL..."} 
            className={`flex-1 rounded-[1.5rem] px-6 py-4 text-sm font-bold outline-none transition-all resize-none shadow-inner border-2 ${
              demographic === 'SENIOR' ? 'bg-white border-blue-900 text-black focus:ring-4 ring-blue-100' : 'bg-black border-white/10 text-white focus:border-red-800'
            }`} 
          />
          <button 
            onClick={() => handleSend()} 
            className={`font-black px-8 py-4 rounded-[1.5rem] text-xs uppercase active:scale-95 shadow-2xl transition-all border-b-4 ${
              demographic === 'SENIOR' ? 'bg-blue-900 text-white border-blue-950' : 'bg-red-800 hover:bg-red-700 text-white border-red-950'
            }`}
          >
            {isPl ? 'NADAJ' : 'SEND'}
          </button>
        </div>

        {/* Quick Response Bar */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
           {EMERGENCY_TEMPLATES.map(t => (
             <button 
               key={t.id} 
               onClick={() => handleSend(t.text)}
               className={`whitespace-nowrap px-4 py-2 rounded-full text-[8px] font-black uppercase transition-all border ${
                 demographic === 'SENIOR' ? 'bg-white border-blue-900 text-blue-900' : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:border-red-600'
               }`}
             >
               {t.label}
             </button>
           ))}
        </div>
      </div>
    </div>
  );
};
export default EvacuatorBot;
