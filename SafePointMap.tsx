
import React, { useEffect, useRef, useState } from 'react';
import { MarkerData, AppMode, MapProvider, EvacuatorLanguage } from '../types';

declare var L: any;

interface SafePointMapProps {
  markers: MarkerData[];
  setMarkers: (m: MarkerData[]) => void;
  userLocation: { lat: number; lng: number } | null;
  mode: AppMode;
  onReportMarker: (id: string) => void;
  isOnline: boolean;
  isAdmin: boolean;
  lang: EvacuatorLanguage;
}

const SZCZECIN_CENTER: [number, number] = [53.4285, 14.5528];

const SafePointMap: React.FC<SafePointMapProps> = ({
  markers,
  userLocation,
  lang
}) => {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markerLayerRef = useRef<any>(null);
  const [provider, setProvider] = useState<MapProvider>(MapProvider.OSM);

  const isPl = lang === EvacuatorLanguage.PL;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    
    const map = L.map(containerRef.current, { 
      center: SZCZECIN_CENTER, 
      zoom: 14, 
      maxZoom: 19,
      zoomControl: false,
      attributionControl: false
    });
    mapRef.current = map;

    const clusters = L.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 50 });
    clusters.addTo(map);
    markerLayerRef.current = clusters;

    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerLayerRef.current) return;
    
    markerLayerRef.current.clearLayers();
    
    markers.forEach(m => {
      const isShelter = m.type === 'shelter';
      const icon = L.divIcon({
        className: 'custom-icon',
        html: `<div class="p-1 rounded border-2 ${m.verified ? 'bg-red-700 border-white' : 'bg-yellow-500 border-black'} text-[10px] font-black flex items-center justify-center w-6 h-6 animate-pulse">${m.verified ? '✅' : '☢'}</div>`,
        iconSize: [24, 24]
      });

      const popupContent = `
        <div class="bg-black text-white p-2 font-mono">
          <b class='uppercase text-[10px] text-red-500'>${m.title}</b><br/>
          <p class='text-[8px] mt-1 italic'>${m.description}</p>
          <div class='mt-1 text-[6px] uppercase font-black text-zinc-600'>TACTICAL_ID: ${m.id}</div>
        </div>
      `;

      L.marker([m.lat, m.lng], { icon }).bindPopup(popupContent).addTo(markerLayerRef.current);
    });
  }, [markers, lang]);

  useEffect(() => {
    if (!mapRef.current) return;
    const url = provider === MapProvider.CYCLOSM 
      ? 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png' 
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    L.tileLayer(url, { attribution: 'OSM', maxZoom: 19 }).addTo(mapRef.current);
  }, [provider]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-zinc-950">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
         <button 
           onClick={() => setProvider(provider === MapProvider.OSM ? MapProvider.CYCLOSM : MapProvider.OSM)} 
           className="p-3 rounded-xl border border-white/10 bg-black/60 text-white text-[7px] font-black uppercase shadow-2xl"
         >
           {provider === MapProvider.OSM ? 'OSM_VIEW' : 'TACTICAL_VIEW'}
         </button>
      </div>
      <div className="absolute bottom-4 left-4 z-[1000] bg-black/80 px-4 py-2 rounded-xl border border-white/10 text-[8px] font-black uppercase text-red-500">
        SZCZECIN_SECTOR: {markers.length} NODES_ACTIVE
      </div>
    </div>
  );
};

export default SafePointMap;
