
import React, { useState } from 'react';
import { analyzeTacticalImage, generateImage } from '../services/geminiService';
import { EvacuatorLanguage } from '../types';

const VisionTool: React.FC<{ lang: EvacuatorLanguage }> = ({ lang }) => {
  const [activeMode, setActiveMode] = useState<'analyze' | 'generate'>('analyze');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const isPl = lang === EvacuatorLanguage.PL;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      if (activeMode === 'analyze' && selectedImage) {
        const base64Data = selectedImage.split(',')[1];
        const mimeType = selectedImage.split(';')[0].split(':')[1];
        const result = await analyzeTacticalImage(base64Data, mimeType);
        setAnalysisResult(result);
      } else if (activeMode === 'generate') {
        const result = await generateImage(prompt, '1K');
        setResultImage(result);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-black border border-white/5 rounded-[2rem] p-6 font-mono h-full overflow-y-auto custom-scrollbar relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-black text-white italic uppercase flex items-center gap-2">
          <span className="text-red-500">👁️</span> {activeMode === 'analyze' ? (isPl ? 'SKANER_TAKTYCZNY' : 'TACTICAL_SCANNER') : (isPl ? 'GENERATOR_IKON' : 'ICON_GENERATOR')}
        </h3>
        <div className="flex bg-white/5 p-1 rounded-full border border-white/5">
           <button onClick={() => setActiveMode('analyze')} className={`px-4 py-1 rounded-full text-[8px] font-black uppercase transition-all ${activeMode === 'analyze' ? 'bg-white text-black' : 'text-zinc-500'}`}>{isPl ? 'Analizuj' : 'Analyze'}</button>
           <button onClick={() => setActiveMode('generate')} className={`px-4 py-1 rounded-full text-[8px] font-black uppercase transition-all ${activeMode === 'generate' ? 'bg-white text-black' : 'text-zinc-500'}`}>{isPl ? 'Generuj' : 'Generate'}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {activeMode === 'analyze' ? (
            <div className="border-2 border-dashed border-zinc-800 rounded-3xl p-6 text-center bg-zinc-900/50 relative h-64 flex flex-col items-center justify-center">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              {selectedImage ? (
                <img src={selectedImage} alt="Preview" className="h-full w-full object-cover rounded-2xl opacity-60" />
              ) : (
                <div className="text-zinc-600">
                  <p className="text-3xl mb-2">📸</p>
                  <p className="text-[10px] font-black uppercase tracking-widest">{isPl ? 'Wgraj zdjęcie otoczenia' : 'Upload surroundings photo'}</p>
                </div>
              )}
            </div>
          ) : (
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={isPl ? "Opisz ikonę schronu..." : "Describe shelter icon..."}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-3xl p-4 text-[10px] h-64 outline-none font-bold"
            />
          )}

          <button
            onClick={handleProcess}
            disabled={isProcessing || (!selectedImage && activeMode === 'analyze') || (!prompt && activeMode === 'generate')}
            className="w-full bg-red-700 hover:bg-red-600 text-white font-black py-4 rounded-2xl transition-all uppercase text-[10px] tracking-widest disabled:opacity-50"
          >
            {isProcessing ? (isPl ? 'PRZETWARZANIE...' : 'PROCESSING...') : `START_${activeMode.toUpperCase()}`}
          </button>
        </div>

        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-4 min-h-[300px] relative">
          {isProcessing && <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 animate-pulse text-white font-black uppercase">SCANNING_IMAGE...</div>}
          
          {analysisResult ? (
            <div className="animate-fadeIn">
              <div className="text-[8px] text-red-500 font-black mb-4 uppercase tracking-[0.2em] border-b border-red-500/20 pb-2">INTEL_REPORT_SZN</div>
              <div className="text-[10px] text-zinc-300 whitespace-pre-wrap leading-relaxed font-mono overflow-y-auto max-h-[400px]">
                {analysisResult}
              </div>
            </div>
          ) : resultImage ? (
             <img src={resultImage} alt="Generated" className="w-full h-auto rounded-xl shadow-2xl animate-fadeIn" />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-800 opacity-20">
               <span className="text-6xl">🛡️</span>
               <p className="text-[8px] font-black uppercase tracking-widest mt-4">{isPl ? 'OCZEKIWANIE_NA_DANE' : 'WAITING_FOR_DATA'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisionTool;
