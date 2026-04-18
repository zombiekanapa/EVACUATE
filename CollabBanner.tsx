
import React from 'react';

const CollabBanner: React.FC = () => {
  return (
    <div className="space-y-12 pb-20 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 bg-zinc-900 p-8 rounded-[3rem] border-4 border-red-600 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="z-10 text-center md:text-left">
            <h2 className="text-5xl font-black italic tracking-tighter text-white uppercase mb-2">SUPPORT / JOIN!</h2>
            <p className="text-red-500 font-black tracking-[0.3em] text-sm uppercase">Szczecin SafePoint Network Project</p>
        </div>
        <div className="flex gap-4 z-10">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-xl border-2 border-red-600">🦅</div>
            <div className="w-20 h-20 bg-white rounded-2xl flex flex-col shadow-xl border-2 border-red-600 overflow-hidden">
                <div className="flex-1 bg-white"></div>
                <div className="flex-1 bg-red-600"></div>
            </div>
            <div className="w-20 h-20 bg-zinc-800 rounded-2xl flex items-center justify-center text-4xl shadow-xl border-2 border-red-600 text-white">🦁</div>
        </div>
      </div>

      <section className="bg-zinc-800 p-10 rounded-[4rem] border-2 border-yellow-600/30 shadow-2xl">
         <div className="text-center mb-10">
            <h3 className="text-3xl font-black text-yellow-500 uppercase tracking-tighter italic">GOT IDEAS? LOCAL COMMUNITY ADMINS WELCOME!</h3>
            <p className="text-zinc-400 text-xs mt-2 uppercase font-bold tracking-widest">A call to Private Citizens, NGOs, and Safety-Oriented Merchants</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/40 p-6 rounded-3xl border border-white/5 hover:border-yellow-600/50 transition-all group">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">🎒</div>
                <h4 className="text-white font-black text-sm mb-2 uppercase">RESCUE_MERCHANTS</h4>
                <p className="text-[10px] text-zinc-500 leading-relaxed mb-4">Sell emergency gear, bug-out bags, or powerbanks? Place your verified link here to help citizens prepare.</p>
                <button className="w-full bg-zinc-900 border border-yellow-600/40 text-yellow-500 py-2 rounded-xl font-black text-[9px] uppercase hover:bg-yellow-600 hover:text-black transition-all">RESERVE_SLOT</button>
            </div>
            
            <div className="bg-black/40 p-6 rounded-3xl border border-white/5 hover:border-red-600/50 transition-all group">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">🤝</div>
                <h4 className="text-white font-black text-sm mb-2 uppercase">NGO_PARTNERS</h4>
                <p className="text-[10px] text-zinc-500 leading-relaxed mb-4">Local charity or search/rescue group in Szczecin? We provide priority badges and real-time report feeds for verified partners.</p>
                <button className="w-full bg-red-900/20 border border-red-600/40 text-red-500 py-2 rounded-xl font-black text-[9px] uppercase hover:bg-red-600 hover:text-white transition-all">VERIFY_ORG</button>
            </div>

            <div className="bg-black/40 p-6 rounded-3xl border border-white/5 hover:border-blue-600/50 transition-all group">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">🏢</div>
                <h4 className="text-white font-black text-sm mb-2 uppercase">SPONSOR_LOGOS</h4>
                <p className="text-[10px] text-zinc-500 leading-relaxed mb-4">Support our server costs or the development of offline mesh-networks. High-visibility exposure on all city-center markers.</p>
                <button className="w-full bg-blue-900/20 border border-blue-600/40 text-blue-500 py-2 rounded-xl font-black text-[9px] uppercase hover:bg-blue-600 hover:text-white transition-all">VIEW_TIERS</button>
            </div>
         </div>
      </section>

      <div className="bg-red-700 text-white p-10 rounded-[4rem] text-center shadow-2xl border-4 border-black">
         <h4 className="text-2xl font-black uppercase tracking-widest mb-6 italic underline">OFFICIAL_CONTACT_HQ</h4>
         <div className="flex flex-col md:flex-row justify-center gap-6">
            <div className="bg-black/30 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                <span className="block text-[10px] font-black opacity-60 uppercase mb-2">ADMIN</span>
                <span className="text-xl font-mono tracking-widest">+48 513 943 126</span>
            </div>
            <div className="bg-black/30 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                <span className="block text-[10px] font-black opacity-60 uppercase mb-2">Secure_Email</span>
                <span className="text-sm font-mono tracking-widest">szymon.karpierz.szn@gmail.com</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CollabBanner;
