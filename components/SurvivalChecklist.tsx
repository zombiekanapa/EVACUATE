
import React, { useState, useEffect } from 'react';
import { EvacuatorLanguage } from '../types';

interface ChecklistItem {
  id: string;
  category: 'FOOD' | 'MED' | 'TOOLS' | 'DOCS';
  labelPl: string;
  labelEn: string;
  checked: boolean;
}

const DEFAULT_ITEMS: ChecklistItem[] = [
  { id: '1', category: 'FOOD', labelPl: 'Woda (min. 3L/osoba)', labelEn: 'Water (min. 3L/person)', checked: false },
  { id: '2', category: 'FOOD', labelPl: 'Konserwy / Energetyki', labelEn: 'Canned food / energy bars', checked: false },
  { id: '3', category: 'MED', labelPl: 'Apteczka (stazy, gazy)', labelEn: 'First aid (tourniquets, gauze)', checked: false },
  { id: '4', category: 'MED', labelPl: 'Leki stałe (zapas 7 dni)', labelEn: 'Daily meds (7 day supply)', checked: false },
  { id: '5', category: 'TOOLS', labelPl: 'Radio bateryjne (101.2 FM)', labelEn: 'Battery radio (101.2 FM)', checked: false },
  { id: '6', category: 'TOOLS', labelPl: 'Latarka + zapas baterii', labelEn: 'Flashlight + spare batteries', checked: false },
  { id: '7', category: 'DOCS', labelPl: 'Dowód osobisty / Paszport', labelEn: 'ID / Passport', checked: false },
  { id: '8', category: 'DOCS', labelPl: 'Gotówka w małych nominałach', labelEn: 'Cash in small denominations', checked: false },
  { id: '9', category: 'TOOLS', labelPl: 'Powerbank (naładowany)', labelEn: 'Powerbank (charged)', checked: false },
];

const SurvivalChecklist: React.FC<{ lang: EvacuatorLanguage }> = ({ lang }) => {
  const [items, setItems] = useState<ChecklistItem[]>(DEFAULT_ITEMS);
  const [showHelp, setShowHelp] = useState(false);
  const isPl = lang === EvacuatorLanguage.PL;

  useEffect(() => {
    const saved = localStorage.getItem('survival_checklist_v1');
    if (saved) try { setItems(JSON.parse(saved)); } catch (e) {}
  }, []);

  const toggleItem = (id: string) => {
    const updated = items.map(item => item.id === id ? { ...item, checked: !item.checked } : item);
    setItems(updated);
    localStorage.setItem('survival_checklist_v1', JSON.stringify(updated));
  };

  const categories = Array.from(new Set(items.map(i => i.category)));

  const helpText = isPl 
    ? "🎒 PLECAK PRZETRWANIA: Lista niezbędnych rzeczy na 72 godziny. Zaznaczaj co już masz, system zapamięta Twój postęp automatycznie." 
    : "🎒 SURVIVAL CHECKLIST: A list of essential items for 72 hours. Check what you already have; the system will remember your progress automatically.";

  return (
    <div className="h-full flex flex-col p-4 bg-black/40 font-mono overflow-y-auto custom-scrollbar relative">
      
      {showHelp && (
        <div className="absolute inset-0 z-50 bg-black/95 p-8 flex flex-col items-center justify-center text-center animate-fadeIn">
          <span className="text-4xl mb-4">❔</span>
          <p className="text-sm font-black text-white uppercase italic leading-relaxed mb-6">{helpText}</p>
          <button onClick={() => setShowHelp(false)} className="bg-red-700 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase">OK</button>
        </div>
      )}

      <div className="border-b-2 border-red-700/40 pb-4 mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
            {isPl ? 'PLECAK_UCIECZKI (72H)' : 'GO-BAG_CHECKLIST (72H)'}
          </h2>
          <span className="text-[7px] text-zinc-600 font-black uppercase tracking-widest">{isPl ? 'STAŁA_PAMIĘĆ_AKTYWNA' : 'PERSISTENT_STORAGE_ACTIVE'}</span>
        </div>
        <button onClick={() => setShowHelp(true)} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-600 hover:text-white transition-all text-sm mb-1">❔</button>
      </div>

      <div className="space-y-8">
        {categories.map(cat => (
          <section key={cat} className="space-y-3">
            <h3 className="text-[9px] font-black text-red-600 uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-1 h-3 bg-red-600"></span>
              {cat}
            </h3>
            <div className="grid gap-2">
              {items.filter(i => i.category === cat).map(item => (
                <button 
                  key={item.id} 
                  onClick={() => toggleItem(item.id)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                    item.checked 
                    ? 'bg-green-900/10 border-green-500/20 opacity-40 shadow-inner' 
                    : 'bg-white/5 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] transition-all ${
                    item.checked ? 'bg-green-600 border-green-400' : 'border-white/10'
                  }`}>
                    {item.checked ? '✓' : ''}
                  </div>
                  <span className={`text-[11px] font-black uppercase tracking-tight ${item.checked ? 'line-through text-zinc-600' : 'text-zinc-300'}`}>
                    {isPl ? item.labelPl : item.labelEn}
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 p-6 bg-red-900/10 border border-red-900/20 rounded-3xl text-center">
        <p className="text-[8px] text-red-500 font-black uppercase leading-relaxed italic">
          {isPl ? 'BRAK PRZYGOTOWANIA TO PRZYGOTOWANIE DO PORAŻKI.' : 'FAILING TO PREPARE IS PREPARING TO FAIL.'}
        </p>
      </div>
    </div>
  );
};

export default SurvivalChecklist;
