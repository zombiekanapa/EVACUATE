
import React, { useState, useEffect } from 'react';
import { AdminMessage, EvacuatorLanguage } from '../types';

const ADMIN_MSG_STORAGE = 'safepoint_admin_messages_v1';

const AdminMessageBoard: React.FC<{ lang: EvacuatorLanguage; isAdmin: boolean; userLocation: {lat: number, lng: number} | null }> = ({ lang, isAdmin, userLocation }) => {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [input, setInput] = useState('');

  const loadData = () => {
    const saved = localStorage.getItem(ADMIN_MSG_STORAGE);
    if (saved) try { setMessages(JSON.parse(saved)); } catch (e) {}
  };

  useEffect(() => {
    loadData();
    if (isAdmin) {
      const interval = setInterval(loadData, 5000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  const handlePost = () => {
    if (!input.trim()) return;
    const newMsg: AdminMessage = {
      id: Date.now().toString(),
      text: input,
      timestamp: Date.now(),
      location: userLocation || undefined
    };
    const saved = localStorage.getItem(ADMIN_MSG_STORAGE);
    const existing = saved ? JSON.parse(saved) : [];
    const updated = [newMsg, ...existing];
    setMessages(updated);
    localStorage.setItem(ADMIN_MSG_STORAGE, JSON.stringify(updated));
    setInput('');
    alert(lang === EvacuatorLanguage.PL ? "ZGŁOSZENIE WYSŁANE DO HQ." : "REPORT SENT TO HQ.");
  };

  const isPl = lang === EvacuatorLanguage.PL;

  if (isAdmin) {
    return (
      <div className="bg-black/20 border border-red-900/20 rounded-[1rem] p-3 shadow-sm flex flex-col gap-2 max-h-[250px] backdrop-blur-md">
        <div className="flex justify-between items-center border-b border-red-900/10 pb-1.5">
           <h3 className="text-[10px] font-black text-white/40 uppercase italic tracking-tighter">ADMIN_FEED ☢</h3>
           <div className="flex items-center gap-1">
              <button onClick={loadData} className="text-[6px] text-yellow-800 hover:text-white transition-all uppercase font-black">⟳</button>
              <span className="bg-red-900/40 text-white/80 text-[5px] px-1 py-0 rounded font-black animate-pulse">HQ_STREAM</span>
           </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-0.5 space-y-1.5 font-mono">
          {messages.length === 0 ? (
            <div className="py-6 text-center text-zinc-900 text-[6px] uppercase font-black italic opacity-20">NO_INTEL</div>
          ) : (
            messages.map(m => (
              <div key={m.id} className="bg-white/5 border border-white/5 p-1.5 rounded-lg hover:border-red-900/20 transition-all">
                <p className="text-[7px] text-zinc-400 font-bold leading-tight">"{m.text}"</p>
                <div className="flex justify-between mt-1 text-[4px] text-zinc-700 uppercase">
                  <span>{new Date(m.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                  {m.location && <span className="text-blue-900/40 font-black">L:{m.location.lat.toFixed(1)},{m.location.lng.toFixed(1)}</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/10 border border-zinc-800/20 rounded-[1rem] p-3 shadow-sm space-y-2 backdrop-blur-md">
      <div className="flex justify-between items-center">
         <h3 className="text-[10px] font-black text-white/30 uppercase italic tracking-tighter">HQ_REPORT ☢</h3>
         <div className="flex items-center gap-1">
            <button onClick={loadData} className="text-[6px] text-zinc-800 hover:text-white transition-all">⟳</button>
         </div>
      </div>
      <p className="text-[6px] text-zinc-800 uppercase font-black italic leading-none opacity-40">{isPl ? 'RAPORT_DO_SZTABU' : 'REPORT_TO_HQ'}</p>
      <textarea 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full bg-white/5 border border-white/5 rounded-lg p-2 text-[7px] text-white/60 focus:border-red-900/40 outline-none h-12 font-bold resize-none"
        placeholder={isPl ? "Wiadomość..." : "Message..."}
      />
      <button onClick={handlePost} className="w-full bg-red-900/10 hover:bg-red-900/20 text-red-900 py-1.5 rounded-lg font-black uppercase text-[7px] transition-all active:scale-95 border border-red-900/10">TRANSMIT</button>
    </div>
  );
};

export default AdminMessageBoard;
