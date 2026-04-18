
import React, { useState, useEffect } from 'react';
import { MarkerData, EvacuatorLanguage } from '../types';

interface UserLocationManagerProps {
  userMarkers: MarkerData[];
  setMarkers: (m: MarkerData[]) => void;
  lang: EvacuatorLanguage;
  userLocation: { lat: number; lng: number } | null;
}

const STORAGE_KEY = 'evacuate_user_markers';

const UserLocationManager: React.FC<UserLocationManagerProps> = ({ userMarkers, setMarkers, lang, userLocation }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<MarkerData>>({ title: '', description: '', type: 'user_proposed' });
  const isPl = lang === EvacuatorLanguage.PL;

  const handleSave = () => {
    if (!formData.title || !userLocation) {
        alert(isPl ? "Błąd: Brak tytułu lub lokalizacji GPS." : "Error: Missing title or GPS location.");
        return;
    }

    const newMarker: MarkerData = {
      id: editingId || Date.now().toString(),
      lat: userLocation.lat,
      lng: userLocation.lng,
      title: formData.title || '',
      description: formData.description || '',
      type: 'user_proposed',
      verified: false,
      timestamp: Date.now()
    };

    let updated;
    if (editingId) {
      updated = userMarkers.map(m => m.id === editingId ? newMarker : m);
    } else {
      updated = [...userMarkers, newMarker];
    }

    setMarkers(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    resetForm();
    alert(isPl ? "Lokalizacja zapisana! Oczekuje na weryfikację przez Sztab." : "Location saved! Pending verification by HQ.");
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ title: '', description: '', type: 'user_proposed' });
  };

  const deleteMarker = (id: string) => {
    if (!confirm(isPl ? "Czy na pewno usunąć tę lokalizację?" : "Delete this location?")) return;
    const updated = userMarkers.filter(m => m.id !== id);
    setMarkers(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <div className="h-full flex flex-col p-6 font-sans bg-black/40 backdrop-blur-xl tactical-grid overflow-hidden">
      <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
         <div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter italic">
              {isPl ? 'TWOJE LOKALIZACJE' : 'YOUR LOCATIONS'}
            </h2>
            <p className="text-[6px] text-zinc-500 uppercase font-black tracking-[0.4em]">USER_NODES_DATABASE</p>
         </div>
         <button 
           onClick={() => setIsAdding(true)} 
           className="bg-red-900/20 text-red-600 px-6 py-2 rounded-full text-[8px] font-black uppercase border border-red-900/20 hover:bg-red-900/40 transition-all"
         >
           {isPl ? '+ DODAJ NOWĄ' : '+ ADD NEW'}
         </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
         {isAdding && (
           <div className="bg-zinc-900/60 p-6 rounded-[2rem] border border-white/10 animate-fadeIn space-y-4 shadow-2xl">
              <h3 className="text-[10px] font-black text-yellow-500 uppercase italic border-b border-white/5 pb-2">NOWY_WEZEL_DANYCH</h3>
              <div className="space-y-3">
                 <input 
                   className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-[12px] text-white outline-none focus:border-red-600" 
                   placeholder={isPl ? "NAZWA (np. Garaż podziemny blok 5)..." : "TITLE..."}
                   value={formData.title}
                   onChange={e => setFormData({...formData, title: e.target.value})}
                 />
                 <textarea 
                   className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-[12px] text-white outline-none focus:border-red-600 h-24 resize-none" 
                   placeholder={isPl ? "KRÓTKI OPIS (np. wejście od podwórka, kod 1234)..." : "DESCRIPTION..."}
                   value={formData.description}
                   onChange={e => setFormData({...formData, description: e.target.value})}
                 />
                 <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="text-[7px] text-zinc-600 font-black uppercase mb-1">GPS_AUTODETECT</p>
                    <p className="text-[10px] text-blue-500 font-mono">
                      {userLocation ? `${userLocation.lat.toFixed(6)}, ${userLocation.lng.toFixed(6)}` : 'POBIERANIE_SYGNAŁU...'}
                    </p>
                 </div>
              </div>
              <div className="flex gap-2">
                 <button onClick={resetForm} className="flex-1 bg-white/5 py-3 rounded-xl text-[8px] font-black uppercase text-zinc-500">ANULUJ</button>
                 <button onClick={handleSave} className="flex-1 bg-red-800 py-3 rounded-xl text-[8px] font-black uppercase text-white shadow-lg">ZAPISZ_WĘZEŁ</button>
              </div>
           </div>
         )}

         <div className="space-y-2">
            <h4 className="text-[8px] font-black text-zinc-600 uppercase tracking-widest pl-2 mb-2 italic">ZAREJESTROWANE_WĘZŁY:</h4>
            {userMarkers.length === 0 ? (
              <div className="py-20 text-center opacity-10 flex flex-col items-center">
                 <span className="text-6xl mb-4">📍</span>
                 <p className="text-xs font-black uppercase tracking-[0.5em]">BRAK_DANYCH</p>
              </div>
            ) : (
              userMarkers.map(m => (
                <div key={m.id} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex justify-between items-center group hover:bg-white/10 transition-all">
                  <div>
                    <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${m.verified ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></span>
                       <h5 className="font-black text-white text-[10px] uppercase">{m.title}</h5>
                    </div>
                    <p className="text-[8px] text-zinc-500 italic mt-1 max-w-[200px] truncate">"{m.description}"</p>
                  </div>
                  <div className="flex gap-2">
                     <button onClick={() => deleteMarker(m.id)} className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-700 hover:text-red-500 transition-all">✕</button>
                  </div>
                </div>
              ))
            )}
         </div>
      </div>
    </div>
  );
};
export default UserLocationManager;
