
import React, { useState, useEffect, useRef } from 'react';
import SafePointMap from './components/SafePointMap';
import EvacuatorBot from './components/EvacuatorBot';
import ProtocolLibrary from './components/ProtocolLibrary';
import VisionTool from './components/VisionTool';
import AdminPanel from './components/AdminPanel';
import SurvivalChecklist from './components/SurvivalChecklist';
import NewsTicker from './components/NewsTicker';
import { MarkerData, AppMode, EvacuatorLanguage, FontSize, APP_VERSION } from './types';

const ADMIN_MARKERS: MarkerData[] = [
  { id: '1', lat: 53.4297, lng: 14.5532, title: 'CH Kaskada', description: 'Parking level -1. Entrances: pl. Żołnierza & ul. Kaszubska.', type: 'underground', verified: true },
  { id: '2', lat: 53.4328, lng: 14.5583, title: 'Galaxy Center', description: 'Deep underground parking -1/-2. High structural integrity.', type: 'underground', verified: true },
  { id: '3', lat: 53.4250, lng: 14.5450, title: 'Bunkier pl. Grunwaldzki', description: 'Civil Defense shelter. Stairs entrance. Tactical depth: 5m.', type: 'shelter', verified: true },
  { id: '4', lat: 53.4294, lng: 14.5587, title: 'Filharmonia Szczecińska', description: 'Underground parking -2. Massive concrete reinforcement.', type: 'underground', verified: true },
  { id: '5', lat: 53.4187, lng: 14.5505, title: 'Schron Dworzec Główny', description: 'Civilian nuclear-rated shelter. Entrance via platform tunnels.', type: 'shelter', verified: true },
  { id: '6', lat: 53.4246, lng: 14.5502, title: 'Posejdon', description: 'Brama Portowa (-2). Modern deep parking core.', type: 'underground', verified: true },
  { id: '7', lat: 53.4312, lng: 14.5651, title: 'Wały Chrobrego', description: 'Complex beneath Voivodeship Office. Tactical depth.', type: 'underground', verified: true },
  { id: '8', lat: 53.4357, lng: 14.5544, title: 'Hanza Tower', description: 'Modern deep foundations (-2/-3). High mass shielding.', type: 'underground', verified: true },
  { id: '9', lat: 53.4225, lng: 14.5365, title: 'Turzyn Parking', description: 'Underground parking -1. Immediate cover for market area.', type: 'underground', verified: true },
  { id: '10', lat: 53.4278, lng: 14.5512, title: 'Black Pearl', description: 'al. Niepodległości. Reinforced commercial basement.', type: 'underground', verified: true },
  { id: '11', lat: 53.4245, lng: 14.5518, title: 'Brama Portowa Sub', description: 'Pedestrian tunnels. Immediate protection from shrapnel.', type: 'underground', verified: true },
  { id: '12', lat: 53.4318, lng: 14.5552, title: 'Plac Rodła Sub', description: 'Underground crossing linking Pazim/Galaxy.', type: 'underground', verified: true },
  { id: '13', lat: 53.4265, lng: 14.5605, title: 'Zamek Tunnels', description: 'Basements and historical tunnels under the castle.', type: 'underground', verified: true },
  { id: '14', lat: 53.4335, lng: 14.5482, title: 'Urząd Miasta (OC-1)', description: 'Official Civil Defense shelter. Entrance from rear courtyard.', type: 'shelter', verified: true },
  { id: '15', lat: 53.4410, lng: 14.5515, title: 'Manhattan Basement', description: 'Underground storage. Quick escape from market.', type: 'underground', verified: true },
  { id: '16', lat: 53.4255, lng: 14.5415, title: 'Jagiellońska Reinforced', description: 'Historical Luftschutz legacy basements. Deep and connected.', type: 'shelter', verified: true },
  { id: '17', lat: 53.4330, lng: 14.5525, title: 'Rayskiego Vaults', description: 'Connected basement network. Thick masonry.', type: 'underground', verified: true },
  { id: '18', lat: 53.4242, lng: 14.5540, title: 'Kino Pionier Sub', description: 'Oldest cinema basement. Reinforced substructure.', type: 'underground', verified: true },
  { id: '19', lat: 53.4282, lng: 14.5422, title: 'Plac Noakowskiego', description: 'Post-German air raid bunker. Partially blocked.', type: 'shelter', verified: true },
  { id: '20', lat: 53.4115, lng: 14.5325, title: 'PUM Pomorzany Tunnels', description: 'Hospital tunnel network connecting blocks.', type: 'underground', verified: true },
  { id: '21', lat: 53.4542, lng: 14.5480, title: 'Szpital Arkońska', description: 'Extensive underground corridor network.', type: 'underground', verified: true },
  { id: '22', lat: 53.4215, lng: 14.5802, title: 'Stara Rzeźnia Vaults', description: 'Reinforced brick basements. Łasztownia cover.', type: 'underground', verified: true },
  { id: '23', lat: 53.4240, lng: 14.5780, title: 'MCN Technical Base', description: 'Underground technical deck. Modern concrete.', type: 'underground', verified: true },
  { id: '24', lat: 53.4310, lng: 14.5442, title: 'Uniwersytet Piastów', description: 'Massive basement laboratories and corridor system.', type: 'underground', verified: true },
  { id: '25', lat: 53.4152, lng: 14.5445, title: 'Cmentarz Centralny', description: 'Large OC shelter near main gate.', type: 'shelter', verified: true },
  { id: '26', lat: 53.4375, lng: 14.5385, title: 'Netto Arena Storage', description: 'Underground storage levels of the arena.', type: 'underground', verified: true },
  { id: '27', lat: 53.4285, lng: 14.5682, title: 'PAZIM Deep Deck', description: 'Underground service deck level -2. High shielding.', type: 'underground', verified: true },
  { id: '28', lat: 53.4415, lng: 14.5420, title: 'Kasprowicza Bunkers', description: 'Historical shelters near Summer Theater.', type: 'shelter', verified: true },
  { id: '29', lat: 53.4250, lng: 14.5580, title: 'Bulwar Piastowski', description: 'Bridge foundations and service basements.', type: 'underground', verified: true },
  { id: '30', lat: 53.4212, lng: 14.5425, title: 'Krzywoustego Shops', description: 'Deep commercial basements along shopping street.', type: 'underground', verified: true },
];

function App() {
  const [activeTab, setActiveTab] = useState<'map' | 'evacuator' | 'vision' | 'protocols' | 'checklist' | 'admin'>('map');
  const [lang, setLang] = useState<EvacuatorLanguage>(EvacuatorLanguage.PL);
  const [fontSize, setFontSize] = useState<FontSize>(FontSize.MEDIUM);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [markers, setMarkers] = useState<MarkerData[]>(ADMIN_MARKERS);
  const logoClickCountRef = useRef(0);

  useEffect(() => {
    const savedMarkers = localStorage.getItem('evacuate_user_markers');
    const userMarkers = savedMarkers ? JSON.parse(savedMarkers) : [];
    setMarkers([...ADMIN_MARKERS, ...userMarkers]);
    
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        null,
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const handleLogoClick = () => {
    logoClickCountRef.current += 1;
    // Fixed typo: logoClickCountCountRef -> logoClickCountRef
    if (logoClickCountRef.current === 5) { 
      setIsAdmin(!isAdmin); 
      logoClickCountRef.current = 0; 
      alert(isAdmin ? "ADMIN_LOGOUT" : "ADMIN_TERMINAL_ACTIVE ☢");
    }
    setTimeout(() => { logoClickCountRef.current = 0; }, 2000);
  };

  const isPl = lang === EvacuatorLanguage.PL;

  const tabLabels: Record<string, { pl: string, en: string }> = {
    map: { pl: 'MAPA_TAKT', en: 'TACTICAL_MAP' },
    evacuator: { pl: 'RATOWNIK_AI', en: 'AI_BOT' },
    vision: { pl: 'SKANER_WIZ', en: 'VISION_SCAN' },
    checklist: { pl: 'PLECAK', en: 'GO_BAG' },
    protocols: { pl: 'BIBLIOTEKA', en: 'LIBRARY' },
    admin: { pl: 'SZTAB', en: 'HQ' }
  };

  return (
    <div className={`h-screen flex flex-col bg-black text-white font-sans overflow-hidden ${fontSize}`}>
      
      {/* Top Bar */}
      <div className="bg-zinc-900 text-[9px] py-1 px-3 flex justify-between items-center border-b border-white/5 font-mono z-[100]">
         <div className="flex gap-4 items-center">
            <span className="text-red-600 font-black">{APP_VERSION}</span>
            <span className="text-zinc-500 uppercase">SZN_NODE: ACTIVE</span>
         </div>
         <div className="flex items-center gap-4">
            <div className="flex gap-2">
                <button onClick={() => setLang(EvacuatorLanguage.PL)} className={`px-1 rounded ${lang === EvacuatorLanguage.PL ? 'bg-white text-black' : 'text-zinc-500'}`}>PL</button>
                <button onClick={() => setLang(EvacuatorLanguage.EN)} className={`px-1 rounded ${lang === EvacuatorLanguage.EN ? 'bg-white text-black' : 'text-zinc-500'}`}>EN</button>
            </div>
         </div>
      </div>

      <NewsTicker />

      {/* Header */}
      <header className="px-2 py-1 flex justify-between items-center border-b bg-black border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <button onClick={handleLogoClick} className="bg-red-700/30 text-white font-black p-1.5 rounded-full text-[10px]">☢️</button>
        </div>

        <nav className="flex-1 flex gap-1 overflow-x-auto no-scrollbar items-center px-4">
            {Object.keys(tabLabels).map(tab => (
              (tab === 'admin' && !isAdmin) ? null :
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab as any)} 
                className={`py-1.5 px-3 rounded-full font-black text-[7px] uppercase transition-all border whitespace-nowrap ${activeTab === tab ? 'bg-white/10 text-white border-red-900/40 shadow-lg' : 'bg-transparent text-zinc-600 border-white/5'}`}
              >
                {isPl ? tabLabels[tab].pl : tabLabels[tab].en}
              </button>
            ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'map' && <SafePointMap markers={markers} setMarkers={setMarkers} userLocation={userLocation} mode={AppMode.DARK} isAdmin={isAdmin} isOnline={true} onReportMarker={() => {}} lang={lang} />}
        {activeTab === 'evacuator' && <EvacuatorBot userLocation={userLocation} isAdmin={isAdmin} onReportSystemError={() => {}} lang={lang} setLang={setLang} setGlobalFontSize={setFontSize} />}
        {activeTab === 'vision' && <VisionTool lang={lang} />}
        {activeTab === 'protocols' && <ProtocolLibrary lang={lang} />}
        {activeTab === 'checklist' && <SurvivalChecklist lang={lang} />}
        {activeTab === 'admin' && isAdmin && <AdminPanel markers={markers} setMarkers={setMarkers} lang={lang} hasApiKey={true} />}
      </main>
    </div>
  );
}

export default App;
