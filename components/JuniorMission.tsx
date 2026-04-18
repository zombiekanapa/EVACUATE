
import React, { useState } from 'react';
import { EvacuatorLanguage } from '../types';

interface MissionStep {
  id: number;
  question: string;
  questionEn: string;
  options: { icon: string, label: string, labelEn: string, isCorrect: boolean }[];
  reward: string;
  hint: string;
  hintEn: string;
}

const MISSIONS: MissionStep[] = [
  {
    id: 1,
    question: "Który znak oznacza Twoją 'Bezpieczną Jaskinię' (Schron)?",
    questionEn: "Which sign marks your 'Safe Cave' (Shelter)?",
    options: [
      { icon: '🍦', label: 'Lody', labelEn: 'Ice Cream', isCorrect: false },
      { icon: '☢️', label: 'Schron', labelEn: 'Shelter', isCorrect: true },
      { icon: '🎈', label: 'Balon', labelEn: 'Balloon', isCorrect: false }
    ],
    reward: "ODZNAKA_SOKOŁA (Symmetry Badge)",
    hint: "Szukaj żółtego kółka z czarnymi skrzydłami!",
    hintEn: "Look for the yellow circle with black wings!"
  },
  {
    id: 2,
    question: "Gdy jesteś w Galaxy koło sklepu z zabawkami (Smyk), gdzie się schowasz?",
    questionEn: "When you are in Galaxy near the toy store (Smyk), where do you hide?",
    options: [
      { icon: '🎥', label: 'Do kina', labelEn: 'In the cinema', isCorrect: false },
      { icon: '🌳', label: 'Na zewnątrz', labelEn: 'Outside', isCorrect: false },
      { icon: '🚗', label: 'Piętro niżej - parking', labelEn: 'Floor below - parking', isCorrect: true }
    ],
    reward: "KARTA_KRETA (Mole Card)",
    hint: "Parking podziemny w Galaxy to wielka i bezpieczna jaskinia!",
    hintEn: "The underground parking in Galaxy is a big, safe cave!"
  },
  {
    id: 3,
    question: "Jesteś w Kaskadzie przy kawie (Starbucks). Gdzie jest najbezpieczniej?",
    questionEn: "You are in Kaskada near coffee (Starbucks). Where is safest?",
    options: [
      { icon: '🛡️', label: 'Poziom -1 (Podziemia)', labelEn: 'Level -1 (Underground)', isCorrect: true },
      { icon: '🛗', label: 'W windzie', labelEn: 'In the elevator', isCorrect: false },
      { icon: '🚽', label: 'W łazience', labelEn: 'In the bathroom', isCorrect: false }
    ],
    reward: "PLECAK_MISTRZA (Master Pack)",
    hint: "Zawsze szukaj schodów w dół, tam gdzie śpią samochody.",
    hintEn: "Always look for stairs down, to where the cars sleep."
  },
  {
    id: 4,
    question: "Co robisz, gdy zgubisz mamę lub tatę w schronie?",
    questionEn: "What do you do if you lose mom or dad in a shelter?",
    options: [
      { icon: '🏃', label: 'Uciekam na zewnątrz', labelEn: 'Run outside', isCorrect: false },
      { icon: '👮', label: 'Szukam Pana w mundurze', labelEn: 'Find a Uniform', isCorrect: true },
      { icon: '🙈', label: 'Chowam się w kącie', labelEn: 'Hide in corner', isCorrect: false }
    ],
    reward: "TYTUŁ_ZWIADOWCY (Scout Title)",
    hint: "Służby w mundurach (Policja, Straż) zawsze Ci pomogą.",
    hintEn: "People in uniforms (Police, Fire) will always help you."
  },
  {
    id: 5,
    question: "Głośna syrena (UUUU-uuuu)! Co to oznacza?",
    questionEn: "Loud siren (UUUU-uuuu)! What does it mean?",
    options: [
      { icon: '🚨', label: 'Zagrożenie! Idź do schronu', labelEn: 'Danger! Go to shelter', isCorrect: true },
      { icon: '🎶', label: 'Koncert w Filharmonii', labelEn: 'Concert at Filharmonia', isCorrect: false },
      { icon: '🎉', label: 'Dzień Dziecka', labelEn: 'Children\'s Day', isCorrect: false }
    ],
    reward: "USZY_RADARU (Radar Ears)",
    hint: "Dźwięk syreny to głos systemu, który mówi: Schowaj się!",
    hintEn: "The siren sound is the system's voice saying: Take cover!"
  }
];

const JuniorMission: React.FC<{ lang: EvacuatorLanguage }> = ({ lang }) => {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [showWorksheet, setShowWorksheet] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

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

  const handlePrint = () => {
    window.print();
  };

  const helpText = isPl 
    ? "🧸 MISJA JUNIOR: Edukacyjna gra dla dzieci, która uczy rozpoznawania schronów i bezpiecznych zachowań w Szczecinie. Po ukończeniu misji można wydrukować pamiątkowy arkusz zwiadowcy."
    : "🧸 JUNIOR MISSION: An educational game for children teaching shelter recognition and safe behavior in Szczecin. Upon completion, a commemorative scout worksheet can be printed.";

  if (showWorksheet) {
    return (
      <div className="bg-white text-black p-8 font-mono min-h-full print:p-0 print:m-0 animate-fadeIn overflow-y-auto">
        <div className="flex justify-between items-start border-b-4 border-black pb-4 mb-6">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase">RAPORT ZWIADOWCY</h1>
            <p className="text-xs font-black uppercase tracking-widest">Ground Scout Mission: Szczecin 2025</p>
          </div>
          <span className="text-4xl">☢️</span>
        </div>

        <div className="space-y-8">
          <div className="border-2 border-black p-4">
            <p className="text-xs font-black uppercase mb-2">1. TWOJE IMIĘ (KOD ZWIADOWCY):</p>
            <div className="border-b-2 border-dotted border-black h-8"></div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-black uppercase italic">DOKĄD DZISIAJ IDZIEMY? (SCHRON):</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-black p-4 aspect-square flex flex-col items-center justify-center text-center">
                 <span className="text-4xl mb-2">🏢</span>
                 <p className="text-[8px] font-black uppercase leading-tight">GALAXY / KASKADA</p>
              </div>
              <div className="border-2 border-black p-4 aspect-square flex flex-col items-center justify-center text-center opacity-40">
                 <span className="text-4xl mb-2">❓</span>
                 <p className="text-[8px] font-black uppercase leading-tight">INNE MIEJSCE</p>
              </div>
            </div>
          </div>

          <div className="border-2 border-black p-4">
            <p className="text-xs font-black uppercase mb-4">CO WIDZISZ NAJWIĘKSZEGO OBOK WEJŚCIA?</p>
            <div className="border-2 border-black h-40 flex items-center justify-center text-[10px] text-zinc-300 font-black uppercase tracking-widest italic">
               TU NARYSUJ COŚ ŚMIESZNEGO!
            </div>
          </div>

          <div className="border-2 border-black p-4">
            <p className="text-xs font-black uppercase mb-2 italic">MOJE NOTATKI TAKTYCZNE:</p>
            <div className="space-y-4">
               <div className="border-b-2 border-dotted border-black h-6"></div>
               <div className="border-b-2 border-dotted border-black h-6"></div>
               <div className="border-b-2 border-dotted border-black h-6"></div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-between items-end border-t-2 border-black pt-4">
          <p className="text-[8px] font-black italic opacity-40 uppercase">SZCZECIN_SAFEPOINT_JUNIOR_DOC_1.0</p>
          <div className="flex gap-2 print:hidden">
            <button onClick={() => setShowWorksheet(false)} className="bg-zinc-200 text-black px-4 py-2 rounded font-black text-[10px] uppercase">WRÓĆ</button>
            <button onClick={handlePrint} className="bg-black text-white px-6 py-2 rounded font-black text-[10px] uppercase">DRUKUJ 🖨️</button>
          </div>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-fadeIn bg-black">
        <div className="text-6xl mb-4 animate-bounce">🏆</div>
        <h2 className="text-2xl font-black text-pink-500 uppercase italic tracking-tighter">
          {isPl ? 'MISJA_WYKONANA!' : 'MISSION_COMPLETE!'}
        </h2>
        <div className="bg-white/5 border border-pink-500/20 p-6 rounded-[2rem] mt-6 font-mono text-[10px] text-zinc-400 max-w-sm">
          <pre className="text-pink-400">
{`   [ ^_^ ]
  /|     |\\
 / |_____| \\
   |     |
   |_____|
  _|_   _|_`}
          </pre>
          <p className="mt-6 uppercase font-black text-white/80 leading-relaxed">
            {isPl ? 'ZOSTAŁEŚ MŁODYM RATOWNIKIEM SZCZECINA! TWOJA WIEDZA MOŻE URATOWAĆ KOGOŚ BLISKIEGO.' : 'YOU ARE NOW A YOUNG SZCZECIN RESCUER! YOUR KNOWLEDGE CAN SAVE SOMEONE YOU LOVE.'}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-8 w-full max-w-xs">
          <button 
            onClick={() => { setStep(0); setCompleted(false); setScore(0); }}
            className="bg-white/5 text-white/40 border border-white/5 px-4 py-4 rounded-[1.5rem] font-black uppercase text-[8px] hover:text-white transition-all"
          >
            {isPl ? 'POWTÓRZ' : 'REPEAT'}
          </button>
          <button 
            onClick={() => setShowWorksheet(true)}
            className="bg-pink-600/20 text-pink-500 border border-pink-500/30 px-4 py-4 rounded-[1.5rem] font-black uppercase text-[8px] animate-pulse hover:bg-pink-500 hover:text-white transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)]"
          >
            {isPl ? 'RAPORT' : 'REPORT'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 font-sans max-w-lg mx-auto overflow-y-auto custom-scrollbar relative">
      
      {showHelp && (
        <div className="absolute inset-0 z-[50] bg-black/95 p-8 flex flex-col items-center justify-center text-center animate-fadeIn">
          <span className="text-4xl mb-4">❔</span>
          <p className="text-sm font-black text-white uppercase italic leading-relaxed mb-6">{helpText}</p>
          <button onClick={() => setShowHelp(false)} className="bg-red-700 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase">OK</button>
        </div>
      )}

      <div className="flex justify-between items-center mb-8 shrink-0">
        <div className="flex items-center gap-3">
          <div>
             <span className="text-pink-500 font-black text-[12px] uppercase tracking-widest italic block">MISSION_{step + 1}/{MISSIONS.length}</span>
             <span className="text-[6px] text-zinc-600 font-black uppercase tracking-[0.4em]">SAFEPOINT_ACADEMY</span>
          </div>
          <button onClick={() => setShowHelp(true)} className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-zinc-600 hover:text-white transition-all text-[10px]">❔</button>
        </div>
        <div className="flex gap-1.5">
          {MISSIONS.map((_, i) => (
            <div key={i} className={`w-4 h-1.5 rounded-full transition-all duration-500 ${i <= step ? 'bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]' : 'bg-white/5'}`}></div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-10">
        <h3 className="text-2xl font-black text-white leading-tight uppercase italic tracking-tighter text-center">
          {isPl ? currentMission.question : currentMission.questionEn}
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {currentMission.options.map((opt, i) => (
            <button 
              key={i} 
              onClick={() => handleAnswer(opt.isCorrect)}
              className="bg-white/5 hover:bg-white/10 border-2 border-white/5 hover:border-pink-500/30 p-5 rounded-[2rem] flex items-center gap-6 transition-all group active:scale-95 shadow-xl"
            >
              <div className="w-14 h-14 bg-black/40 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                 {opt.icon}
              </div>
              <span className="font-black text-[11px] text-zinc-500 uppercase tracking-widest group-hover:text-white text-left flex-1">
                {isPl ? opt.label : opt.labelEn}
              </span>
            </button>
          ))}
        </div>

        {showHint && (
          <div className="bg-pink-600/10 border border-pink-500/20 p-5 rounded-[1.5rem] animate-fadeIn flex items-start gap-4">
            <span className="text-2xl">💡</span>
            <p className="text-[10px] text-pink-400 font-black uppercase italic leading-relaxed">
              {isPl ? currentMission.hint : currentMission.hintEn}
            </p>
          </div>
        )}
      </div>

      <div className="mt-12 flex justify-between items-center shrink-0 border-t border-white/5 pt-4">
        <p className="text-[6px] text-zinc-800 font-black uppercase tracking-[0.5em] opacity-40 italic">
          JUNIOR_ACADEMY_SEC_SZN_PROTO
        </p>
        <button onClick={() => setShowWorksheet(true)} className="text-[8px] text-zinc-600 font-black uppercase underline decoration-dotted hover:text-white transition-all">DRUKUJ ARKUSZ</button>
      </div>
    </div>
  );
};

export default JuniorMission;
