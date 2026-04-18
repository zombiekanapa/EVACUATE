
import React, { useState } from 'react';
import { EvacuatorLanguage } from '../types';

interface MissionStep {
  id: number;
  question: string;
  options: { icon: string, label: string, isCorrect: boolean }[];
  hint: string;
}

const MISSIONS: MissionStep[] = [
  {
    id: 1,
    question: "Który znak oznacza Twoją 'Bezpieczną Jaskinię' (Schron)?",
    options: [
      { icon: '🍦', label: 'Lody', isCorrect: false },
      { icon: '☢️', label: 'Schron', isCorrect: true },
      { icon: '🎈', label: 'Balon', isCorrect: false }
    ],
    hint: "Szukaj żółtego kółka z czarnymi skrzydłami!"
  },
  {
    id: 2,
    question: "Gdy jesteś w Galaxy koło sklepu z zabawkami (Smyk), gdzie się schowasz?",
    options: [
      { icon: '🎥', label: 'Do kina', isCorrect: false },
      { icon: '🌳', label: 'Na zewnątrz', isCorrect: false },
      { icon: '🚗', label: 'Piętro niżej - parking', isCorrect: true }
    ],
    hint: "Parking podziemny w Galaxy to wielka i bezpieczna jaskinia!"
  },
  {
    id: 3,
    question: "Jesteś w Kaskadzie przy kawie (Starbucks). Gdzie jest najbezpieczniej?",
    options: [
      { icon: '🛡️', label: 'Poziom -1 (Podziemia)', isCorrect: true },
      { icon: '🛗', label: 'W windzie', isCorrect: false },
      { icon: '🚽', label: 'W łazience', isCorrect: false }
    ],
    hint: "Zawsze szukaj schodów w dół, tam gdzie śpią samochody."
  }
];

const GameModule: React.FC<{ lang: EvacuatorLanguage }> = ({ lang }) => {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const isPl = lang === EvacuatorLanguage.PL;
  const currentMission = MISSIONS[step];

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1);
      if (step < MISSIONS.length - 1) {
        setStep(step + 1);
        setShowHint(false);
      } else {
        setCompleted(true);
      }
    } else {
      setShowHint(true);
    }
  };

  const introSection = (
    <div className="space-y-6 text-center animate-fadeIn py-10">
      <div className="text-6xl mb-6">🎮</div>
      <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter italic">CENTRUM TRENINGOWE</h2>
      <div className="bg-red-900/10 border border-red-900/20 p-6 rounded-[2rem] text-sm leading-relaxed text-zinc-300 italic">
        <p>
          Sekcja <b>GRA!</b> to interaktywne serce SafePoint. Wierzymy, że najlepszym sposobem na przetrwanie jest edukacja poprzez doświadczenie. 
          Poniższa gra "Młody Ratownik" to tylko początek – prototyp narzędzia, które uczy najmłodszych mieszkańców Szczecina intuicyjnego rozpoznawania bezpiecznych stref.
        </p>
      </div>
      <button 
        onClick={() => setGameStarted(true)}
        className="bg-red-700 hover:bg-red-600 text-white font-black px-12 py-5 rounded-full text-xs uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 border-b-4 border-red-900"
      >
        URUCHOM SYMULACJĘ: MŁODY RATOWNIK 🕹️
      </button>

      <div className="mt-20 space-y-4">
        <h3 className="text-xs font-black text-zinc-600 uppercase tracking-[0.4em]">POTENCJAŁ ROZWOJU SEKCJI</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
            <h4 className="text-[10px] font-black text-red-500 uppercase mb-2">🔭 Wirtualne Spacery</h4>
            <p className="text-[9px] text-zinc-500 leading-tight">Interaktywne panoramy 360° najgłębszych schronów Szczecina, pozwalające oswoić się z przestrzenią przed kryzysem.</p>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
            <h4 className="text-[10px] font-black text-blue-500 uppercase mb-2">⏱️ Próba Czasu</h4>
            <p className="text-[9px] text-zinc-500 leading-tight">Symulacja ewakuacji w czasie rzeczywistym – wyznaczanie trasy do najbliższego punktu pod presją zegara.</p>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
            <h4 className="text-[10px] font-black text-green-500 uppercase mb-2">🩹 Akademia Medyka</h4>
            <p className="text-[9px] text-zinc-500 leading-tight">Grywalizacja nauki pierwszej pomocy z użyciem AI analizującego Twoje ruchy przez kamerę smartfona.</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (!gameStarted) return <div className="h-full overflow-y-auto custom-scrollbar p-6">{introSection}</div>;

  if (completed) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-fadeIn bg-black">
        <div className="text-6xl mb-4 animate-bounce">🏆</div>
        <h2 className="text-2xl font-black text-red-500 uppercase italic tracking-tighter">MISJA_WYKONANA!</h2>
        <p className="mt-6 uppercase font-black text-white/80 leading-relaxed text-sm max-w-sm">
          ZOSTAŁEŚ MŁODYM RATOWNIKIEM SZCZECINA! TWOJA WIEDZA MOŻE URATOWAĆ KOGOŚ BLISKIEGO.
        </p>
        <button 
          onClick={() => { setStep(0); setCompleted(false); setGameStarted(false); }}
          className="mt-10 bg-white/5 text-white/40 border border-white/5 px-10 py-4 rounded-full font-black uppercase text-[10px] hover:text-white transition-all"
        >
          POWRÓT DO CENTRUM
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 font-sans max-w-lg mx-auto overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-center mb-12">
        <span className="text-red-500 font-black text-[12px] uppercase tracking-widest italic">MISJA_{step + 1}/{MISSIONS.length}</span>
        <div className="flex gap-1.5">
          {MISSIONS.map((_, i) => (
            <div key={i} className={`w-4 h-1.5 rounded-full ${i <= step ? 'bg-red-500' : 'bg-white/5'}`}></div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-10">
        <h3 className="text-2xl font-black text-white leading-tight uppercase italic tracking-tighter text-center">
          {currentMission.question}
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {currentMission.options.map((opt, i) => (
            <button 
              key={i} 
              onClick={() => handleAnswer(opt.isCorrect)}
              className="bg-white/5 hover:bg-white/10 border-2 border-white/5 hover:border-red-500/30 p-5 rounded-[2rem] flex items-center gap-6 transition-all group active:scale-95 shadow-xl"
            >
              <div className="w-14 h-14 bg-black/40 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                 {opt.icon}
              </div>
              <span className="font-black text-[11px] text-zinc-500 uppercase tracking-widest group-hover:text-white text-left flex-1">
                {opt.label}
              </span>
            </button>
          ))}
        </div>

        {showHint && (
          <div className="bg-red-600/10 border border-red-500/20 p-5 rounded-[1.5rem] animate-fadeIn flex items-start gap-4">
            <span className="text-2xl">💡</span>
            <p className="text-[10px] text-red-400 font-black uppercase italic leading-relaxed">
              {currentMission.hint}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameModule;
