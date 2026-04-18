
import React, { useState } from 'react';
import { EvacuatorLanguage } from '../types';

interface ServiceLink {
  name: { PL: string, EN: string };
  desc: { PL: string, EN: string };
  url: string;
  icon: string;
}

const SERVICES: ServiceLink[] = [
  {
    name: { PL: 'POLICJA', EN: 'POLICE' },
    desc: { PL: 'Ogólnopolski portal policji.', EN: 'National police portal.' },
    url: 'https://www.policja.pl/',
    icon: '👮'
  },
  {
    name: { PL: 'STRAŻ POŻARNA', EN: 'FIRE DEPARTMENT' },
    desc: { PL: 'Krajowy system ratowniczo-gaśniczy.', EN: 'National rescue and firefighting system.' },
    url: 'https://www.gov.pl/web/kgpsp',
    icon: '🚒'
  },
  {
    name: { PL: 'ZARZĄDZANIE KRYZYSOWE (RCB)', EN: 'CRISIS MANAGEMENT (RCB)' },
    desc: { PL: 'Rządowe Centrum Bezpieczeństwa - alerty.', EN: 'Government Centre for Security - alerts.' },
    url: 'https://www.gov.pl/web/rcb',
    icon: '📡'
  },
  {
    name: { PL: 'SZPITAL (SPSK-2 POMORZANY)', EN: 'MAIN HOSPITAL' },
    desc: { PL: 'Główny szpital kliniczny w Szczecinie.', EN: 'Main clinical hospital in Szczecin.' },
    url: 'https://www.spsk2-szczecin.pl/',
    icon: '🏥'
  },
  {
    name: { PL: 'STRAŻ MIEJSKA', EN: 'CITY GUARD' },
    desc: { PL: 'Portal Straży Miejskiej w Szczecinie.', EN: 'Szczecin City Guard portal.' },
    url: 'https://sm.szczecin.pl/',
    icon: '🚔'
  },
  {
    name: { PL: 'CENTRUM KRWIODAWSTWA', EN: 'BLOOD DONATION' },
    desc: { PL: 'Regionalne Centrum Krwiodawstwa.', EN: 'Regional Blood Donation Centre.' },
    url: 'https://krwiodawstwo.szczecin.pl/',
    icon: '🩸'
  }
];

const PublicServices: React.FC<{ lang: EvacuatorLanguage }> = ({ lang }) => {
  const [refreshSeed, setRefreshSeed] = useState(0);
  const isPl = lang === EvacuatorLanguage.PL;
  
  const handleRefresh = () => {
    setRefreshSeed(s => s + 1);
  };

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar font-sans space-y-8 relative">
      <div className="flex justify-between items-center border-b-4 border-red-600 pb-4">
        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
          {isPl ? 'SŁUŻBY PUBLICZNE' : 'PUBLIC SERVICES'}
        </h2>
        <button onClick={handleRefresh} className="bg-zinc-800 text-yellow-500 px-4 py-2 rounded-xl text-[9px] font-black uppercase hover:bg-zinc-700 transition-colors border border-zinc-700">
          ⟳ {isPl ? 'ODŚWIEŻ_LINKI' : 'REFRESH_LINKS'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12" key={refreshSeed}>
        {SERVICES.map((s, i) => (
          <a 
            key={i} 
            href={s.url} 
            target="_blank" 
            rel="noreferrer" 
            className="bg-zinc-900 border-2 border-zinc-800 p-6 rounded-[2.5rem] flex flex-col gap-4 hover:border-red-600 transition-all shadow-xl group"
          >
            <div className="flex justify-between items-center">
              <span className="text-4xl">{s.icon}</span>
              <span className="bg-red-700 text-white text-[9px] px-3 py-1 rounded-lg font-black uppercase">LINK_EXTERNAL</span>
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase italic">{isPl ? s.name.PL : s.name.EN}</h3>
              <p className="text-zinc-500 text-[10px] font-bold mt-1 uppercase leading-tight">{isPl ? s.desc.PL : s.desc.EN}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default PublicServices;
