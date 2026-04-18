
import React, { useState, useEffect } from 'react';

const MOCK_NEWS = [
  { time: '14:02', text: '[PR SZCZECIN] Ćwiczenia służb mundurowych na placu Tobruckim. Możliwe utrudnienia w ruchu.', textEn: '[PR SZCZECIN] Uniformed services exercise at Tobrucki Square. Possible traffic obstructions.' },
  { time: '13:45', text: '[MSWiA] Nowe wytyczne dla schronów w województwie zachodniopomorskim. Sprawdź portal gov.pl.', textEn: '[MSWiA] New shelter guidelines for West Pomeranian Voivodeship. Check gov.pl portal.' },
  { time: '12:15', text: '[RADIO] Szczecińska Policja ostrzega przed dezinformacją w mediach społecznościowych.', textEn: '[RADIO] Szczecin Police warns against disinformation in social media.' },
  { time: '11:30', text: '[IMGW] Ostrzeżenie przed silnym wiatrem w pasie nadmorskim. Szczecin w strefie żółtej.', textEn: '[IMGW] Strong wind warning in the coastal belt. Szczecin in the yellow zone.' }
];

const NewsTicker: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % MOCK_NEWS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const news = MOCK_NEWS[index];

  return (
    <div className="bg-red-700 text-white py-1 px-4 overflow-hidden border-b border-black shadow-inner flex items-center justify-between">
      <div className="flex items-center gap-4 animate-fadeIn flex-1">
        <span className="font-black text-[10px] bg-black px-2 py-0.5 rounded whitespace-nowrap">RADIO_SZCZECIN_TRANSCRIPT</span>
        <span className="text-[10px] font-mono text-white/50">{news.time}</span>
        <p className="text-xs font-bold truncate flex-1 uppercase tracking-tighter italic">
          {news.text} <span className="opacity-60 ml-4 font-medium">— {news.textEn}</span>
        </p>
      </div>
      <div className="flex items-center gap-3 ml-4">
        <div className="hidden sm:flex items-center gap-2 border-l border-white/20 pl-4">
            <span className="text-[8px] font-black uppercase tracking-widest opacity-40">AI_LIVE_FEED</span>
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
