
import React, { useState } from 'react';
import { EmergencyProtocol, EvacuatorLanguage } from '../types';

const OFFICIAL_PROTOCOLS: (EmergencyProtocol & { titleEn: string, contentEn: string })[] = [
  {
    id: 'o1',
    title: 'Dezinformacja i Cyber-Odporność',
    titleEn: 'Disinformation & Cyber Resilience',
    category: 'Information Security',
    content: 'WAŻNE: Podczas zagrożenia ufaj tylko Polskie Radio Szczecin (101.2 FM) i oficjalnym portalom gov.pl/rcb. Ignoruj plotki z mediów społecznościowych.',
    contentEn: 'CRITICAL: During threats, trust only Polskie Radio Szczecin (101.2 FM) and official gov.pl/rcb portals. Disregard social media rumors.',
    lastUpdated: '2025-01-20',
    source: 'GOV.PL / RCB',
    externalLink: 'https://www.gov.pl/web/rcb'
  },
  {
    id: 'o2',
    title: 'Dostęp do Podziemi Szczecina',
    titleEn: 'Szczecin Underground Access',
    category: 'Shelter Protocol',
    content: 'Priorytetowe schrony: Parking CH Kaskada (-1), CH Galaxy (-1/-2) oraz wyznaczone tunele historyczne.',
    contentEn: 'Priority shelters: CH Kaskada Parking (-1), CH Galaxy (-1/-2), and pre-designated historical tunnels.',
    lastUpdated: '2025-02-15',
    source: 'CD SZCZECIN'
  },
  {
    id: 'o4',
    title: 'Naloty i Sygnały Syren',
    titleEn: 'Air Raid & Siren Signals',
    category: 'Military Alert',
    content: 'SYGNAŁ: Dźwięk modulowany ciągły (3 min) = ZAGROŻENIE. SYGNAŁ: Dźwięk ciągły jednostajny (3 min) = ODWOŁANIE.',
    contentEn: 'SIGNAL: Continuous modulated sound (3 min) = THREAT. SIGNAL: Continuous steady sound (3 min) = ALL CLEAR.',
    lastUpdated: '2025-01-01',
    source: 'Civil Defense / NATO'
  }
];

const COMMUNITY_RESOURCES: (EmergencyProtocol & { titleEn: string, contentEn: string })[] = [
  {
    id: 'c1',
    title: 'Duck and Cover (1951) - Trening Historyczny',
    titleEn: 'Duck and Cover (1951) - Legacy Training',
    category: 'Multimedia / Education',
    content: 'Podstawowy trening ochrony przed impulsem termicznym. Logika "Padnij i Zakryj" pozostaje fundamentem ochrony przed falą uderzeniową.',
    contentEn: 'Essential historical training on thermal pulse protection. "Drop and Cover" logic remains a fundamental physics-based survival reflex for blast mitigation.',
    lastUpdated: '2025-01-01',
    source: 'YouTube / Archives',
    externalLink: 'https://www.youtube.com/watch?v=IKqXu-5jw60'
  },
  {
    id: 'c6',
    title: 'NUKEMAP - Symulator Wybuchu',
    titleEn: 'NUKEMAP - Tactical Blast Simulator',
    category: 'Strategic Planning',
    content: 'Wizualizacja promienia wybuchu i opadu w zależności od mocy głowicy. Użyj do identyfikacji stref ryzyka w Szczecinie.',
    contentEn: 'Visualize blast radius and fallout patterns based on weapon yield. Use to identify high-risk sectors and secondary fallout zones in Szczecin.',
    lastUpdated: '2025-02-10',
    source: 'Alex Wellerstein / NUKEMAP',
    externalLink: 'https://nuclearsecrecy.com/nukemap/'
  }
];

const ProtocolLibrary: React.FC<{ lang: EvacuatorLanguage }> = ({ lang }) => {
  const [activeView, setActiveView] = useState<'protocols' | 'registry' | 'wallet'>('protocols');
  const [showHelp, setShowHelp] = useState(false);
  const isPl = lang === EvacuatorLanguage.PL;

  const registryText = `1. CH KASKADA - ul. Kaszubska (-1)
2. GALAXY CENTER - al. Wyzwolenia (-1/-2)
3. BUNKIER GRUNWALDZKI - pl. Grunwaldzki
4. FILHARMONIA - ul. Małopolska (-2)
5. DWORZEC GŁÓWNY - Schron pod peronami
6. POSEJDON - Brama Portowa (-2)
7. WAŁY CHROBREGO - Tunele pod Urzędem
8. HANZA TOWER - al. Wyzwolenia (-2/-3)
9. TURZYN - al. Boh. Warszawy (-1)
10. BLACK PEARL - al. Niepodległości (-1)
11. PRZEJŚCIE BRAMA PORTOWA
12. PRZEJŚCIE PLAC RODŁA
13. ZAMEK - Piwnice/Tunele
14. URZĄD MIASTA - Schron OC-1
15. MANHATTAN - Magazyny podziemne
16. JAGIELLOŃSKA - Piwnice Luftschutz
17. RAYSKIEGO - Systemy piwnic
18. KINO PIONIER - Podziemia
19. PL. NOAKOWSKIEGO - Bunkier
20. POMORZANY PUM - Tunele szpitalne
21. SZPITAL ARKOŃSKA - Tunele
22. STARA RZEŹNIA - Piwnice brick
23. MCN - Poziom techniczny
24. UNIWERSYTET PIASTÓW - Lab/Piwnice
25. CMENTARZ CENTRALNY - Schron OC
26. NETTO ARENA - Magazyny (-1)
27. PAZIM - Poziom serwisowy (-2)
28. KASPROWICZA - Bunkry Parkowe
29. BULWAR PIASTOWSKI - Przyczółki
30. KRZYWOUSTEGO - Piwnice handlowe`;

  const downloadRegistryAsTxt = () => {
    const blob = new Blob([registryText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SZN_SAFEPOINT_REGISTRY_30.txt';
    a.click();
  };

  const renderProtocolCard = (protocol: any) => (
    <div key={protocol.id} className="bg-white/5 border-l-2 border-red-900/40 p-3 rounded-xl hover:bg-white/10 transition-all shadow-sm group relative overflow-hidden flex flex-col justify-between backdrop-blur-sm">
      <div className="absolute top-0 right-0 p-2 opacity-10 text-2xl pointer-events-none group-hover:opacity-20 transition-opacity">
        {protocol.category.includes('Multimedia') ? '🎬' : '📡'}
      </div>
      <div>
        <div className="flex justify-between items-start mb-2 relative z-10">
           <h4 className="font-black text-[9px] text-white/80 uppercase tracking-tighter group-hover:text-white transition-colors max-w-[80%] italic">
             {isPl ? protocol.title : protocol.titleEn}
           </h4>
           <span className="text-[5px] bg-black/40 text-zinc-500 px-1.5 py-0.5 rounded-full font-black uppercase whitespace-nowrap border border-white/5">
             {protocol.category}
           </span>
        </div>
        <p className="text-zinc-400 text-[8px] leading-tight mb-3 italic relative z-10">
          "{isPl ? protocol.content : protocol.contentEn}"
        </p>
      </div>
      <div className="space-y-2">
        {protocol.externalLink && (
          <a href={protocol.externalLink} target="_blank" rel="noreferrer" className="block bg-white/5 text-zinc-400 px-3 py-1.5 rounded-lg text-[6px] font-black uppercase hover:bg-white/10 transition-all border border-white/5 text-center relative z-10">
            {isPl ? 'URUCHOM_LINK ↗' : 'LAUNCH_LINK ↗'}
          </a>
        )}
        <div className="pt-2 mt-2 border-t border-white/5 flex justify-between items-center text-[5px] text-zinc-600 font-black uppercase relative z-10">
           <span>VER: {protocol.lastUpdated}</span>
           <span className="text-red-900/40">{isPl ? 'ŹRÓDŁO' : 'SOURCE'}: {protocol.source}</span>
        </div>
      </div>
    </div>
  );

  const helpText = isPl 
    ? "📖 BIBLIOTEKA WIEDZY: Dostęp do oficjalnych procedur bezpieczeństwa, listy 30 schronów w Szczecinie (można pobrać jako plik .txt) oraz generatora karty portfelowej z adresami schronów."
    : "📖 KNOWLEDGE LIBRARY: Access to official safety protocols, a list of 30 shelters in Szczecin (downloadable as .txt), and a wallet card generator with shelter addresses.";

  return (
    <div className="h-full flex flex-col font-sans overflow-hidden relative">
      
      {showHelp && (
        <div className="absolute inset-0 z-[50] bg-black/95 p-8 flex flex-col items-center justify-center text-center animate-fadeIn">
          <span className="text-4xl mb-4">❔</span>
          <p className="text-sm font-black text-white uppercase italic leading-relaxed mb-6">{helpText}</p>
          <button onClick={() => setShowHelp(false)} className="bg-red-700 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase">OK</button>
        </div>
      )}

      {/* 50% Scaled Compact Header */}
      <div className="bg-transparent py-2 border-b border-white/5 px-2 flex justify-between items-center backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div>
            <h3 className="text-xs font-black text-white uppercase italic tracking-tighter opacity-60">
              {isPl ? 'WIEDZA_TAKTYCZNA' : 'TACTICAL_KNOWLEDGE'}
            </h3>
            <p className="text-[5px] text-zinc-700 uppercase font-black tracking-widest mt-0.5 flex items-center gap-1">
              <span className="w-1 h-1 bg-green-500/30 rounded-full"></span>
              SZN_NODE_VER_2025
            </p>
          </div>
          <button onClick={() => setShowHelp(true)} className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center text-zinc-600 hover:text-white transition-all text-[10px]">❔</button>
        </div>
        <div className="flex bg-white/5 p-0.5 rounded-full border border-white/5">
           <button onClick={() => setActiveView('protocols')} className={`px-2 py-0.5 rounded-full text-[6px] font-black uppercase transition-all ${activeView === 'protocols' ? 'bg-white/10 text-white' : 'text-zinc-600'}`}>DOCS</button>
           <button onClick={() => setActiveView('registry')} className={`px-2 py-0.5 rounded-full text-[6px] font-black uppercase transition-all ${activeView === 'registry' ? 'bg-white/10 text-white' : 'text-zinc-600'}`}>LIST</button>
           <button onClick={() => setActiveView('wallet')} className={`px-2 py-0.5 rounded-full text-[6px] font-black uppercase transition-all ${activeView === 'wallet' ? 'bg-white/10 text-white' : 'text-zinc-600'}`}>CARD</button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
        {activeView === 'protocols' && (
          <div className="space-y-4">
             <div className="bg-red-900/10 border border-red-900/20 p-3 rounded-xl mb-4 animate-pulse">
                <h4 className="text-red-600 font-black text-[10px] uppercase text-center tracking-tighter italic">
                  ⚠ DOWNLOAD, PRINT & LEARN ⚠
                </h4>
                <p className="text-[6px] text-zinc-500 uppercase font-black text-center mt-1 leading-tight">
                  {isPl ? 'POBIERZ LISTĘ I SCHOWAJ DO PORTFELA. ANALOGOWA REDUNDANCJA TO TWOJE ŻYCIE.' : 'DOWNLOAD THE LIST AND STOW IT IN YOUR WALLET. ANALOG REDUNDANCY IS YOUR LIFE.'}
                </p>
             </div>
             
            <section className="space-y-2">
              <div className="flex items-center gap-2">
                <h5 className="text-red-900/40 font-black text-[6px] uppercase tracking-[0.2em] whitespace-nowrap">{isPl ? 'PROCEDURY_GLOWNE' : 'PRIMARY_PROTOCOLS'}</h5>
                <div className="h-px flex-1 bg-red-900/10"></div>
              </div>
              <div className="grid gap-2">{OFFICIAL_PROTOCOLS.map(renderProtocolCard)}</div>
            </section>

            <section className="space-y-2">
              <div className="flex items-center gap-2">
                <h5 className="text-blue-900/40 font-black text-[6px] uppercase tracking-[0.2em] whitespace-nowrap">{isPl ? 'NARZEDZIA' : 'TOOLS'}</h5>
                <div className="h-px flex-1 bg-blue-900/10"></div>
              </div>
              <div className="grid gap-2">{COMMUNITY_RESOURCES.map(renderProtocolCard)}</div>
            </section>
          </div>
        )}

        {activeView === 'registry' && (
          <div className="animate-fadeIn space-y-3">
             <div className="bg-black/40 border border-white/5 rounded-xl p-3 shadow-inner">
                <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
                  <h4 className="text-[8px] font-black text-white/40 uppercase italic tracking-widest">TACTICAL_LOCATION_LIST_30</h4>
                  <button onClick={downloadRegistryAsTxt} className="bg-red-900/20 text-red-600 text-[6px] px-2 py-1 rounded font-black uppercase hover:bg-red-900/40 transition-all">↓ TXT</button>
                </div>
                <pre className="text-[7px] text-zinc-400 font-mono leading-tight whitespace-pre-wrap select-all">
                   {registryText}
                </pre>
                <div className="mt-3 pt-2 border-t border-white/5 flex justify-between items-center">
                   <p className="text-[5px] text-zinc-700 font-black uppercase leading-none italic">{isPl ? 'KOPIUJ_DO_NOTATNIKA' : 'COPY_TO_NOTEBOOK'}</p>
                   <button onClick={() => {navigator.clipboard.writeText(registryText); alert("LOG_COPIED");}} className="bg-white/5 text-white/40 border border-white/5 px-2 py-1 rounded text-[5px] font-black uppercase hover:text-white transition-all">COPY</button>
                </div>
             </div>
          </div>
        )}

        {activeView === 'wallet' && (
          <div className="animate-fadeIn flex flex-col items-center">
             <div className="bg-white text-black p-4 w-[280px] rounded-lg shadow-2xl border-4 border-black font-mono">
                <div className="flex justify-between items-center border-b-2 border-black pb-1 mb-2">
                   <span className="text-[10px] font-black italic tracking-tighter">SZN_SAFE_CARD</span>
                   <span className="text-[12px]">☢</span>
                </div>
                <div className="space-y-1">
                   <p className="text-[7px] font-black uppercase leading-none">TOP_HUB_ESCAPES:</p>
                   <div className="grid grid-cols-1 text-[6.5px] font-bold">
                      <span>1. KASKADA - ul. Kaszubska (-1)</span>
                      <span>2. GALAXY - al. Wyzwolenia (-1/-2)</span>
                      <span>3. PL. GRUNWALDZKI - Centrum (5m)</span>
                      <span>4. FILHARMONIA - Małopolska (-2)</span>
                      <span>5. DWORZEC GLOWNY - Perony (☢)</span>
                      <span>6. POSEJDON - Brama Portowa (-2)</span>
                      <span>7. WALY CHROBREGO - Urząd (Tunele)</span>
                      <span>8. HANZA TOWER - Wyzwolenia (-2)</span>
                      <span>9. TURZYN - Boh. Warszawy (-1)</span>
                      <span>10. BRAMA PORTOWA - Przejście Podz.</span>
                   </div>
                </div>
                <div className="mt-3 pt-1 border-t-2 border-black flex justify-between items-center">
                   <span className="text-[5px] font-black uppercase">RADIO_SZN: 101.2 FM</span>
                   <span className="text-[5px] font-black">APP_VER_2025</span>
                </div>
             </div>
             <p className="text-[6px] text-zinc-600 font-black uppercase mt-4 max-w-[200px] text-center italic">
               {isPl ? 'Zrób zrzut ekranu lub wydrukuj w rozmiarze 85x55mm (Rozmiar karty kredytowej).' : 'Take a screenshot or print at 85x55mm (Credit card size).'}
             </p>
             <button onClick={() => window.print()} className="mt-4 bg-white/5 text-zinc-400 border border-white/5 px-4 py-2 rounded-full text-[7px] font-black uppercase hover:bg-white/10 transition-all">
               {isPl ? 'DRUKUJ_KARTĘ 🖨' : 'PRINT_CARD 🖨'}
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProtocolLibrary;
