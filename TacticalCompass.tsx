
import React, { useEffect, useState } from 'react';
import { MarkerData, EvacuatorLanguage } from '../types';

interface TacticalCompassProps {
  userLocation: { lat: number; lng: number } | null;
  target: MarkerData | null;
  lang: EvacuatorLanguage;
}

const TacticalCompass: React.FC<TacticalCompassProps> = ({ userLocation, target, lang }) => {
  const [rotation, setRotation] = useState(0);
  const [distance, setDistance] = useState<string>('---');
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (userLocation && target) {
      const y = Math.sin((target.lng - userLocation.lng) * Math.PI / 180) * Math.cos(target.lat * Math.PI / 180);
      const x = Math.cos(userLocation.lat * Math.PI / 180) * Math.sin(target.lat * Math.PI / 180) -
                Math.sin(userLocation.lat * Math.PI / 180) * Math.cos(target.lat * Math.PI / 180) * Math.cos((target.lng - userLocation.lng) * Math.PI / 180);
      const brng = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
      setRotation(brng);

      // Simple Haversine approximation for distance
      const R = 6371; // km
      const dLat = (target.lat - userLocation.lat) * Math.PI / 180;
      const dLon = (target.lng - userLocation.lng) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(target.lat * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c;
      setDistance(d < 1 ? `${(d * 1000).toFixed(0)}m` : `${d.toFixed(1)}km`);
    }
  }, [userLocation, target]);

  const isPl = lang === EvacuatorLanguage.PL;

  const helpText = isPl 
    ? "🧭 KOMPAS TAKTYCZNY: Wskazuje kierunek i odległość do najbliższego zweryfikowanego schronu w Szczecinie względem Twojej aktualnej pozycji GPS."
    : "🧭 TACTICAL COMPASS: Shows the direction and distance to the nearest verified shelter in Szczecin relative to your current GPS position.";

  return (
    <div className="bg-black/30 border border-red-900/20 rounded-[1.2rem] p-4 flex flex-col items-center gap-3 shadow-xl backdrop-blur-md relative overflow-hidden group">
      
      {showHelp && (
        <div className="absolute inset-0 z-[100] bg-black/95 p-4 flex flex-col items-center justify-center text-center animate-fadeIn">
          <p className="text-[8px] font-black text-white uppercase italic leading-tight mb-4">{helpText}</p>
          <button onClick={() => setShowHelp(false)} className="bg-red-700 text-white px-4 py-1.5 rounded-full text-[7px] font-black uppercase">OK</button>
        </div>
      )}

      <div className="absolute top-0 left-0 w-full h-1 bg-red-900/30"></div>
      
      <div className="w-full flex justify-between items-center">
         <div className="flex items-center gap-1">
            <h4 className="text-[7px] font-black text-white/40 uppercase tracking-widest italic">{isPl ? 'WEKTOR_SCHRON' : 'SHELTER_VECTOR'}</h4>
            <button onClick={() => setShowHelp(true)} className="text-[7px] text-zinc-700 hover:text-white">❔</button>
         </div>
         <span className="text-[9px] font-black text-red-500 tabular-nums animate-pulse">{distance}</span>
      </div>

      <div className="relative w-20 h-20 flex items-center justify-center">
         <div className="absolute inset-0 rounded-full border border-white/5 border-dashed animate-spin-slow"></div>
         <div className="absolute inset-2 rounded-full border border-white/10"></div>
         
         {/* Compass Needle */}
         <div 
           className="relative w-full h-full transition-transform duration-700 ease-out"
           style={{ transform: `rotate(${rotation}deg)` }}
         >
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[20px] border-b-red-600"></div>
           <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-t from-red-600 to-transparent"></div>
         </div>

         <div className="absolute text-[8px] font-black text-white/20 select-none">SZN</div>
      </div>

      <div className="w-full text-center">
         <p className="text-[8px] font-black text-white uppercase truncate tracking-tighter">
            {target ? target.title : (isPl ? 'LOKALIZACJA...' : 'SCANNING...')}
         </p>
         <span className="text-[5px] text-zinc-700 font-mono uppercase tracking-widest block mt-0.5">
           AZIMUTH: {rotation.toFixed(0)}°
         </span>
      </div>
    </div>
  );
};

export default TacticalCompass;
