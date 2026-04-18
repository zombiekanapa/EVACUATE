
import React, { useState, useEffect } from 'react';
import { MarkerData, EvacuatorLanguage, AdminMessage, MarkerReport, APP_VERSION } from '../types';

const ADMIN_MSG_STORAGE = 'safepoint_admin_messages_v1';
const REPORTS_STORAGE = 'safepoint_marker_reports_v1';
const USER_MARKERS_STORAGE = 'evacuate_user_markers';

const AdminPanel: React.FC<{ 
  markers: MarkerData[], 
  setMarkers: (m: MarkerData[]) => void, 
  lang: EvacuatorLanguage, 
  hasApiKey: boolean 
}> = ({ markers, setMarkers, lang, hasApiKey }) => {
  const [adminMessages, setAdminMessages] = useState<AdminMessage[]>([]);
  const [reports, setReports] = useState<MarkerReport[]>([]);
  const [activeTab, setActiveTab] = useState<'metrics' | 'sos' | 'reports' | 'submissions'>('metrics');
  const [showHelp, setShowHelp] = useState(false);
  
  // Editing state for submissions
  const [editingMarker, setEditingMarker] = useState<MarkerData | null>(null);

  const isPl = lang === EvacuatorLanguage.PL;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedMsg = localStorage.getItem(ADMIN_MSG_STORAGE);
    if (savedMsg) try { setAdminMessages(JSON.parse(savedMsg)); } catch (e) {}
    
    const savedReports = localStorage.getItem(REPORTS_STORAGE);
    if (savedReports) try { setReports(JSON.parse(savedReports)); } catch (e) { setReports([]); }
  };

  const persistUserMarkers = (updatedList: MarkerData[]) => {
    const adminIds = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'];
    const userProposed = updatedList.filter(m => !adminIds.includes(m.id));
    localStorage.setItem(USER_MARKERS_STORAGE, JSON.stringify(userProposed));
    setMarkers(updatedList);
  };

  const exportDataset = () => {
    const dataStr = JSON.stringify(markers, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `szczecin_safepoint_dataset_${Date.now()}.json`;
    a.click();
  };

  const updateReportStatus = (id: string, status: MarkerReport['status']) => {
    const updated = reports.map(r => r.id === id ? { ...r, status } : r);
    setReports(updated);
    localStorage.setItem(REPORTS_STORAGE, JSON.stringify(updated));
  };

  const deleteReport = (id: string) => {
    if (!confirm(isPl ? "Czy na pewno usunąć to zgłoszenie?" : "Delete this report?")) return;
    const updated = reports.filter(r => r.id !== id);
    setReports(updated);
    localStorage.setItem(REPORTS_STORAGE, JSON.stringify(updated));
  };

  const verifyMarker = (id: string) => {
    const updated = markers.map(m => m.id === id ? { ...m, verified: true, type: 'shelter' as const } : m);
    persistUserMarkers(updated);
    alert(isPl ? "Marker został zweryfikowany i dodany do sieci." : "Marker verified and added to the network.");
  };

  const rejectMarker = (id: string) => {
    if (!confirm(isPl ? "Odrzucić i usunąć tę propozycję?" : "Reject and remove this proposal?")) return;
    const updated = markers.filter(m => m.id !== id);
    persistUserMarkers(updated);
  };

  const saveMarkerEdit = () => {
    if (!editingMarker) return;
    const updated = markers.map(m => m.id === editingMarker.id ? editingMarker : m);
    persistUserMarkers(updated);
    setEditingMarker(null);
  };

  const submissions = markers.filter(m => m.type === 'user_proposed' || !m.verified);

  const helpText = isPl 
    ? "🎮 CENTRUM DOWODZENIA: Panel administratora do monitorowania metryk węzłów, logów SOS od bota AI oraz zgłoszeń obywatelskich. Zakładka SUBMISSIONS pozwala zarządzać nowymi schronami dodanymi przez użytkowników."
    : "🎮 COMMAND CENTER: Admin panel for monitoring node metrics, SOS logs, and civilian reports. SUBMISSIONS tab allows managing new shelters proposed by users.";

  return (
    <div className="p-6 h-full overflow-y-auto space-y-8 bg-black font-mono relative">
      
      {showHelp && (
        <div className="absolute inset-0 z-[100] bg-black/95 p-8 flex flex-col items-center justify-center text-center animate-fadeIn">
          <span className="text-4xl mb-4">❔</span>
          <p className="text-sm font-black text-white uppercase italic leading-relaxed mb-6">{helpText}</p>
          <button onClick={() => setShowHelp(false)} className="bg-red-700 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase">OK</button>
        </div>
      )}

      {/* Edit Marker Modal Overlay */}
      {editingMarker && (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4">
           <div className="bg-zinc-900 border-2 border-white/10 p-6 rounded-3xl w-full max-w-md space-y-4">
              <h3 className="text-white font-black uppercase italic text-sm border-b border-white/5 pb-2">EDIT_MARKER_METADATA</h3>
              <div className="space-y-3">
                 <div>
                    <label className="text-[8px] text-zinc-500 uppercase font-black block mb-1">Title</label>
                    <input 
                      type="text" 
                      value={editingMarker.title} 
                      onChange={e => setEditingMarker({...editingMarker, title: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-[12px] text-white"
                    />
                 </div>
                 <div>
                    <label className="text-[8px] text-zinc-500 uppercase font-black block mb-1">Description</label>
                    <textarea 
                      value={editingMarker.description} 
                      onChange={e => setEditingMarker({...editingMarker, description: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-[12px] text-white h-24 resize-none"
                    />
                 </div>
              </div>
              <div className="flex gap-2 pt-4">
                 <button onClick={() => setEditingMarker(null)} className="flex-1 bg-white/5 text-zinc-500 py-3 rounded-xl font-black text-[10px] uppercase">Cancel</button>
                 <button onClick={saveMarkerEdit} className="flex-1 bg-green-900 text-white py-3 rounded-xl font-black text-[10px] uppercase shadow-lg">Save Changes</button>
              </div>
           </div>
        </div>
      )}

      <div className="flex justify-between items-center border-b-2 border-yellow-500 pb-4">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">COMMAND_CENTER</h2>
            <span className="text-[6px] text-zinc-600 font-black uppercase tracking-widest">TACTICAL_OVERRIDE_ACTIVE</span>
          </div>
          <button onClick={() => setShowHelp(true)} className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-zinc-600 hover:text-white transition-all text-[10px]">❔</button>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 overflow-x-auto no-scrollbar max-w-[50%]">
            <button onClick={() => setActiveTab('metrics')} className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${activeTab === 'metrics' ? 'bg-yellow-600 text-black' : 'text-zinc-500'}`}>METRICS</button>
            <button onClick={() => setActiveTab('sos')} className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${activeTab === 'sos' ? 'bg-red-600 text-white' : 'text-zinc-500'}`}>SOS_LOG</button>
            <button onClick={() => setActiveTab('reports')} className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${activeTab === 'reports' ? 'bg-blue-600 text-white' : 'text-zinc-500'}`}>REPORTS ({reports.filter(r => r.status === 'PENDING').length})</button>
            <button onClick={() => setActiveTab('submissions')} className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${activeTab === 'submissions' ? 'bg-purple-600 text-white' : 'text-zinc-500'}`}>SUBMISSIONS ({submissions.length})</button>
        </div>
      </div>

      {activeTab === 'metrics' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
            <div className="bg-zinc-900 border border-white/5 p-6 rounded-3xl flex flex-col justify-between">
                <div>
                  <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">NODE_METRICS</h3>
                  <p className="text-white font-black text-4xl">{markers.length}</p>
                  <p className="text-[8px] text-zinc-600 uppercase font-black">ACTIVE_NODES</p>
                </div>
                <button onClick={exportDataset} className="mt-6 w-full bg-white/5 border border-white/10 text-white text-[8px] font-black py-2 rounded-xl uppercase hover:bg-yellow-600 hover:text-black transition-all">
                  DOWNLOAD_DATASET (JSON)
                </button>
            </div>
            <div className="bg-zinc-900 border border-white/5 p-6 rounded-3xl border-red-900/40 shadow-[0_0_20px_rgba(185,28,28,0.1)]">
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">DISTRESS_QUEUE</h3>
                <p className="text-red-500 font-black text-4xl">{adminMessages.filter(m => m.isDistress).length}</p>
                <p className="text-[8px] text-zinc-600 uppercase font-black">URGENT_SOS</p>
            </div>
            <div className="bg-zinc-900 border border-white/5 p-6 rounded-3xl">
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">API_GATEWAY</h3>
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${hasApiKey ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <p className="text-white font-black text-xl">GEMINI_3: {hasApiKey ? 'OK' : 'ERR'}</p>
                </div>
            </div>
        </div>
      )}

      {activeTab === 'sos' && (
        <div className="bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden animate-fadeIn">
            <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex justify-between items-center">
               <h3 className="text-[10px] font-black text-zinc-400 uppercase italic">SOS_BROADCAST_LOG</h3>
               <span className="text-[8px] text-red-600 font-black animate-pulse">LIVE_MONITORING</span>
            </div>
            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[8px] text-zinc-600 uppercase border-b border-white/5 bg-black">
                            <th className="px-6 py-4">TIME</th>
                            <th className="px-6 py-4">SENDER</th>
                            <th className="px-6 py-4">DATA_FEED</th>
                            <th className="px-6 py-4">LOCATION</th>
                        </tr>
                    </thead>
                    <tbody className="text-[10px] text-zinc-400 font-mono">
                        {adminMessages.filter(m => m.isDistress).map((m, i) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 bg-red-900/5">
                                <td className="px-6 py-4">{new Date(m.timestamp).toLocaleTimeString()}</td>
                                <td className="px-6 py-4"><span className="bg-red-900 text-white px-2 py-0.5 rounded text-[7px] font-black">{m.demographic}</span></td>
                                <td className="px-6 py-4">"{m.text}"</td>
                                <td className="px-6 py-4 text-blue-500">{m.location ? `${m.location.lat.toFixed(3)}, ${m.location.lng.toFixed(3)}` : 'UNKNOWN'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden animate-fadeIn">
            <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex justify-between items-center">
               <h3 className="text-[10px] font-black text-zinc-400 uppercase italic">CIVILIAN_MARKER_REGISTRY_AUDIT</h3>
               <button onClick={loadData} className="text-[8px] text-blue-500 font-black hover:text-white uppercase transition-all">⟳ REFRESH</button>
            </div>
            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[8px] text-zinc-600 uppercase border-b border-white/5 bg-black">
                            <th className="px-6 py-4">TIMESTAMP</th>
                            <th className="px-6 py-4">ID / TITLE</th>
                            <th className="px-6 py-4">ISSUE_LOG</th>
                            <th className="px-6 py-4">STATUS</th>
                            <th className="px-6 py-4">ACTION_CMD</th>
                        </tr>
                    </thead>
                    <tbody className="text-[10px] text-zinc-400 font-mono">
                        {reports.map((r, i) => (
                            <tr key={i} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${r.status === 'PENDING' ? 'bg-yellow-900/10' : ''}`}>
                                <td className="px-6 py-4 tabular-nums">
                                  {new Date(r.timestamp).toLocaleString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="font-black text-white">{r.markerTitle}</div>
                                  <div className="text-[7px] text-zinc-600 uppercase tracking-tighter">REF: {r.markerId}</div>
                                </td>
                                <td className="px-6 py-4 max-w-[200px] truncate">
                                  <span className="italic">"{r.reason}"</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-[4px] text-[7px] font-black uppercase tracking-widest ${
                                        r.status === 'PENDING' ? 'bg-yellow-600 text-black animate-pulse' : 
                                        r.status === 'REVIEWED' ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.3)]' : 'bg-green-600 text-white'
                                    }`}>{r.status}</span>
                                </td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button 
                                      onClick={() => updateReportStatus(r.id, 'REVIEWED')} 
                                      className={`px-3 py-1 rounded-lg text-[7px] font-black uppercase transition-all ${r.status === 'REVIEWED' ? 'bg-blue-900 text-white' : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-white'}`}
                                    >
                                      REVIEW
                                    </button>
                                    <button 
                                      onClick={() => updateReportStatus(r.id, 'ACTIONED')} 
                                      className={`px-3 py-1 rounded-lg text-[7px] font-black uppercase transition-all ${r.status === 'ACTIONED' ? 'bg-green-900 text-white' : 'bg-zinc-800 text-green-700 hover:bg-green-600 hover:text-white'}`}
                                    >
                                      ACTION
                                    </button>
                                    <button onClick={() => deleteReport(r.id)} className="px-3 py-1 text-zinc-800 hover:text-red-600 text-[10px]">✕</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {activeTab === 'submissions' && (
        <div className="bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden animate-fadeIn">
            <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex justify-between items-center">
               <h3 className="text-[10px] font-black text-zinc-400 uppercase italic">USER_PROPOSED_MARKERS_QUEUE</h3>
            </div>
            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[8px] text-zinc-600 uppercase border-b border-white/5 bg-black">
                            <th className="px-6 py-4">PROPOSED_TITLE</th>
                            <th className="px-6 py-4">DESCRIPTION</th>
                            <th className="px-6 py-4">GPS_COORDS</th>
                            <th className="px-6 py-4">TACTICAL_CMD</th>
                        </tr>
                    </thead>
                    <tbody className="text-[10px] text-zinc-400 font-mono">
                        {submissions.map((m, i) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-black text-white">{m.title}</td>
                                <td className="px-6 py-4 max-w-[200px] truncate italic">"{m.description}"</td>
                                <td className="px-6 py-4 text-blue-500">{m.lat.toFixed(4)}, {m.lng.toFixed(4)}</td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button 
                                      onClick={() => verifyMarker(m.id)} 
                                      className="px-3 py-1 rounded-lg text-[7px] font-black uppercase bg-green-900 text-white hover:bg-green-600"
                                    >
                                      VERIFY
                                    </button>
                                    <button 
                                      onClick={() => setEditingMarker(m)} 
                                      className="px-3 py-1 rounded-lg text-[7px] font-black uppercase bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                                    >
                                      EDIT
                                    </button>
                                    <button 
                                      onClick={() => rejectMarker(m.id)} 
                                      className="px-3 py-1 rounded-lg text-[7px] font-black uppercase bg-red-900 text-white hover:bg-red-600"
                                    >
                                      REJECT
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {submissions.length === 0 && (
                          <tr>
                            <td colSpan={4} className="p-16 text-center">
                              <div className="opacity-10 text-6xl mb-4">🛸</div>
                              <p className="opacity-20 uppercase tracking-[0.5em] italic font-black">NO_SUBMISSIONS_PENDING</p>
                            </td>
                          </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      )}
    </div>
  );
};
export default AdminPanel;
