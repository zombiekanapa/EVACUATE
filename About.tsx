
import React from 'react';
import { EvacuatorLanguage } from '../types';

interface AboutProps {
  lang: EvacuatorLanguage;
  onGoToBot: () => void;
}

const About: React.FC<AboutProps> = ({ lang, onGoToBot }) => {
  const isPl = lang === EvacuatorLanguage.PL;

  return (
    <div className="h-full flex flex-col p-8 font-sans overflow-y-auto custom-scrollbar bg-black text-zinc-300 tactical-grid">
      <div className="max-w-3xl mx-auto space-y-10 pb-20">
        
        {/* Header section */}
        <div className="text-center space-y-4">
          <div className="inline-block p-4 rounded-full bg-red-900/20 border-2 border-red-600 animate-pulse mb-4">
            <span className="text-5xl">🛡️</span>
          </div>
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter italic">
            {isPl ? 'MISJA: BEZPIECZNY SZCZECIN' : 'MISSION: SAFE SZCZECIN'}
          </h2>
          <p className="text-zinc-500 font-black text-xs uppercase tracking-[0.3em]">Project Version: 2025.Q1.TACTICAL</p>
        </div>

        {/* Content sections */}
        <div className="grid gap-8">
          <section className="bg-white/5 p-6 rounded-[2rem] border border-white/5 hover:border-red-900/20 transition-all">
            <h3 className="text-xl font-black text-white mb-3 flex items-center gap-3 italic uppercase">
              <span>📍</span> {isPl ? 'DLACZEGO TA MAPA?' : 'WHY THIS MAP?'}
            </h3>
            <p className="text-sm leading-relaxed opacity-80 italic">
              {isPl 
                ? 'Szczecin to miasto z bogatą historią podziemi, ale w sytuacji stresu trudno przypomnieć sobie, gdzie szukać schronienia. Nasza mapa priorytetyzuje schrony podziemne (parkingi, sklepy, schrony cywilne), które oferują natychmiastową ochronę przed odłamkami, wiatrem i niebezpieczeństwem.'
                : 'Szczecin is a city with a rich underground history, but in stress, it is hard to remember where to seek shelter. Our map prioritizes underground locations (parkings, stores, civil shelters) offering immediate protection.'}
            </p>
          </section>

          <section className="bg-white/5 p-6 rounded-[2rem] border border-white/5 hover:border-blue-900/20 transition-all">
            <h3 className="text-xl font-black text-white mb-3 flex items-center gap-3 italic uppercase">
              <span>🤖</span> {isPl ? 'KIM JEST RATOWNIK AI?' : 'WHO IS RESCUER AI?'}
            </h3>
            <p className="text-sm leading-relaxed opacity-80 italic">
              {isPl
                ? 'To Twój cyfrowy opiekun. Został zaprogramowany tak, by rozpoznawać potrzeby dzieci, dorosłych i seniorów. Doradzi Ci, co spakować do plecaka, jak udzielić pierwszej pomocy i jak zachować spokój, gdy dzieje się coś niepokojącego.'
                : 'Your digital guardian. Programmed to recognize needs of kids, adults, and seniors. It will advise on packing gear, first aid, and staying calm.'}
            </p>
          </section>

          <section className="bg-white/5 p-6 rounded-[2rem] border border-white/5 hover:border-yellow-900/20 transition-all">
            <h3 className="text-xl font-black text-white mb-3 flex items-center gap-3 italic uppercase">
              <span>📋</span> {isPl ? 'REDUNDANCJA ANALOGOWA' : 'ANALOG REDUNDANCY'}
            </h3>
            <p className="text-sm leading-relaxed opacity-80 italic">
              {isPl
                ? 'Wierzymy, że technologia może zawieść, gdy braknie prądu. Dlatego promujemy drukowanie list schronów (zakładka Biblioteka) i posiadanie fizycznych map. Ta aplikacja to drogowskaz, który ma Cię przygotować na czas, gdy internet zniknie.'
                : 'Technology may fail without power. That is why we promote printing shelter lists (Library tab) and physical maps. This app is a guide to prepare you for when the internet is gone.'}
            </p>
          </section>
        </div>

        {/* CTA Section */}
        <div className="bg-red-700/10 border-2 border-red-700 p-8 rounded-[3rem] text-center space-y-6 shadow-[0_0_40px_rgba(185,28,28,0.2)]">
          <p className="text-white font-black uppercase text-sm tracking-widest italic leading-tight">
            {isPl 
              ? 'MASZ PYTANIA DOTYCZĄCE BEZPIECZEŃSTWA? POTRZEBUJESZ POMOCY DORAŹNEJ?' 
              : 'HAVE QUESTIONS ABOUT SAFETY? NEED IMMEDIATE SUPPORT?'}
          </p>
          <button 
            onClick={onGoToBot}
            className="bg-red-700 hover:bg-red-600 text-white font-black px-10 py-5 rounded-full text-xs uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 border-b-4 border-red-900"
          >
            {isPl ? 'ZAPYTAJ RATOWNIKA AI! 🤖' : 'ASK RESCUER AI! 🤖'}
          </button>
        </div>

        {/* Footer info */}
        <div className="text-center opacity-30">
          <p className="text-[10px] font-black uppercase tracking-[0.5em]">Civic Project Szczecin • 2025 • Non-Profit</p>
        </div>
      </div>
    </div>
  );
};

export default About;
