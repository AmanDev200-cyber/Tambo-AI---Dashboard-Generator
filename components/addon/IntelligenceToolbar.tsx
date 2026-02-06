
import React, { useState, useEffect } from 'react';

interface IntelligenceToolbarProps {
  onToggleFeature: (feature: string) => void;
  activeFeatures: string[];
  onVoiceCommand?: (text: string) => void;
}

const IntelligenceToolbar: React.FC<IntelligenceToolbarProps> = ({ onToggleFeature, activeFeatures, onVoiceCommand }) => {
  const [isListening, setIsListening] = useState(false);
  
  const features = [
    { id: 'simulation', icon: 'fa-vial-circle-check', label: 'Simulator', color: 'text-purple-500' },
    { id: 'lineage', icon: 'fa-sitemap', label: 'Lineage', color: 'text-blue-500' },
    { id: 'collaboration', icon: 'fa-users-viewfinder', label: 'Collab', color: 'text-emerald-500' },
    { id: 'predictive', icon: 'fa-crystal-ball', label: 'Predictions', color: 'text-amber-500' },
    { id: 'reporting', icon: 'fa-file-invoice', label: 'Report', color: 'text-rose-500' },
  ];

  const handleVoiceToggle = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (onVoiceCommand) onVoiceCommand(transcript);
    };
    recognition.start();
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/80 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-2xl p-1.5 flex items-center gap-1">
      <div className="px-3 border-r border-slate-100">
        <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Add-ons</span>
      </div>
      {features.map((f) => (
        <button
          key={f.id}
          onClick={() => onToggleFeature(f.id)}
          className={`group relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
            activeFeatures.includes(f.id) 
              ? 'bg-slate-900 text-white' 
              : 'hover:bg-slate-50 text-slate-600'
          }`}
        >
          <i className={`fa-solid ${f.icon} ${activeFeatures.includes(f.id) ? 'text-white' : f.color}`}></i>
          <span className="text-[10px] font-bold uppercase tracking-widest">{f.label}</span>
          
          <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-slate-900 text-white text-[9px] font-bold uppercase py-1 px-2 rounded pointer-events-none whitespace-nowrap">
            Launch {f.label} Module
          </div>
        </button>
      ))}
      <div className="w-px h-6 bg-slate-100 mx-1"></div>
      <button 
        onClick={handleVoiceToggle}
        className={`w-10 h-10 flex items-center justify-center transition-all rounded-xl ${
          isListening ? 'bg-rose-500 text-white scale-110 shadow-lg' : 'text-slate-400 hover:text-blue-600'
        }`}
      >
        <i className={`fa-solid ${isListening ? 'fa-microphone' : 'fa-microphone-lines'} ${isListening ? 'animate-pulse' : ''}`}></i>
      </button>
    </div>
  );
};

export default IntelligenceToolbar;
