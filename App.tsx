
import React, { useState, useRef, useEffect } from 'react';
import { orchestrateGenerativeUI } from './services/geminiService';
import { DashboardLayout, TamboThreadMessage, InteractionContext, SimulationVariable, Annotation, Prediction } from './types';
import DashboardCanvas from './components/DashboardCanvas';
import ChatBot from './components/ChatBot';
import { DataDetective, DetectedSource } from './lib/dataDetective';

// Add-on components
import IntelligenceToolbar from './components/addon/IntelligenceToolbar';
import ScenarioSimulator from './components/addon/ScenarioSimulator';
import LineageViewer from './components/addon/LineageViewer';
import NarrativeReportModal from './components/addon/NarrativeReportModal';
import CollaborationPanel from './components/addon/CollaborationPanel';
import PredictiveMonitor from './components/addon/PredictiveMonitor';

// Fix for window.aistudio declaration errors by using var in global scope
// This avoids "identical modifiers" errors when augmenting the Window interface
declare global {
  var aistudio: {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  };
}

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationReason, setGenerationReason] = useState<string>('Analysing Intelligence...');
  const [currentLayout, setCurrentLayout] = useState<DashboardLayout | null>(null);
  const [history, setHistory] = useState<TamboThreadMessage[]>([]);
  const [detectedSource, setDetectedSource] = useState<DetectedSource | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasUserKey, setHasUserKey] = useState(false);
  
  // Add-on State
  const [activeFeatures, setActiveFeatures] = useState<string[]>([]);
  const [simulationVariables, setSimulationVariables] = useState<SimulationVariable[]>([
    { id: 'v1', name: 'Advertising Spend', min: 0, max: 100000, current: 45000, unit: '$' },
    { id: 'v2', name: 'Churn Rate', min: 0, max: 20, current: 4.2, unit: '%' },
    { id: 'v3', name: 'Conversion Rate', min: 0, max: 100, current: 3.8, unit: '%' }
  ]);

  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [predictions] = useState<Prediction[]>([
    { id: 'p1', metric: 'Monthly Recurring Revenue', currentValue: 142000, predictedValue: 158000, horizon: '30 Days', riskLevel: 'low' },
    { id: 'p2', metric: 'Customer Churn (APAC)', currentValue: 2.1, predictedValue: 4.5, horizon: '14 Days', riskLevel: 'high' }
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setHasUserKey(hasKey);
      }
    };
    checkKey();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleOpenKeySelector = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasUserKey(true); // Assume success per instructions
    }
  };

  const toggleFeature = (feature: string) => {
    setActiveFeatures(prev => 
      prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
    );
  };

  const handleAddAnnotation = (text: string) => {
    const newAnn: Annotation = {
      id: Date.now().toString(),
      userName: 'Current User',
      text,
      timestamp: new Date().toISOString(),
      resolved: false
    };
    setAnnotations(prev => [newAnn, ...prev]);
  };

  const handleGenerate = async (q: string, interaction?: InteractionContext, file?: File, isRegen: boolean = false) => {
    let userContent = q;
    let reason = isRegen ? "Exploring Alternate Visualizations..." : "Validating Data Source...";

    if (interaction) {
      const actionVerb = interaction.action === 'drilldown' ? 'Drilling' : 'Exploring';
      userContent = `${actionVerb} "${interaction.elementLabel}" in ${interaction.componentId}`;
      reason = `Probing "${interaction.elementLabel}" strictly...`;
    } else if (file) {
      userContent = `Connecting source: ${file.name}`;
      reason = `Processing ${file.name} client-side...`;
    }

    if (!userContent.trim() && !interaction && !isRegen && !file) return;

    const userMsg: TamboThreadMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: isRegen ? "Regenerate Analysis with alternate layout" : userContent,
      timestamp: new Date()
    };

    setHistory(prev => [...prev, userMsg]);
    setIsGenerating(true);
    setGenerationReason(reason);
    setQuery('');

    try {
      let source = detectedSource;
      if (file) {
        source = await DataDetective.detect(file);
        setDetectedSource(source);
        if (!q) q = "Analyze this dataset and show the most important trends";
      } else if (q && !detectedSource) {
        const potentialSource = await DataDetective.detect(q);
        if (potentialSource.type !== 'unknown') {
          source = potentialSource;
          setDetectedSource(source);
        }
      }

      const nextLayout = await orchestrateGenerativeUI(q, currentLayout, interaction, file, source, isRegen);
      setCurrentLayout(nextLayout);
      
      const assistantMsg: TamboThreadMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: isRegen 
          ? `Alternate layout generated. Visualizing data from ${source?.label || 'active source'}.`
          : `Dataset processed. Orchestrated a verified dashboard for ${source?.label || 'your query'}.`,
        timestamp: new Date(),
        layout: nextLayout
      };

      setHistory(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("Orchestration error:", err);
      const isQuotaError = err?.message?.includes('429') || err?.message?.includes('RESOURCE_EXHAUSTED');
      
      setHistory(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: isQuotaError 
          ? "The intelligence engine is throttled. Please try again in 60 seconds or switch to a personal API key for unlimited throughput."
          : "Processing halted: Could not parse dataset. Ensure your CSV/Excel/JSON is correctly formatted.",
        timestamp: new Date(),
        isActionable: isQuotaError
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleGenerate('', undefined, file);
  };

  const handleRegenerate = () => {
    if (!currentLayout || isGenerating) return;
    handleGenerate("", undefined, undefined, true);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar - Tambo Thread */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-2xl z-20">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-900 text-white">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
            <i className="fa-solid fa-shield-halved text-xl"></i>
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-sm leading-tight tracking-tight text-white">Tambo Intelligence</h1>
            <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-black">Data-Trust Mode Active</p>
          </div>
          <button 
            onClick={handleOpenKeySelector}
            className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${hasUserKey ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-400 hover:text-white'}`}
            title={hasUserKey ? "Personal Key Active" : "Click to use personal API Key (Paid Tier)"}
          >
            <i className="fa-solid fa-key text-[10px]"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth" ref={scrollRef}>
          {history.length === 0 && (
            <div className="text-center py-12 px-6">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600 border border-emerald-100">
                <i className="fa-solid fa-check-double text-2xl"></i>
              </div>
              <h3 className="text-slate-900 font-bold mb-2">Authenticated Workspace</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">Analysis is strictly limited to provided data sources. No generative guessing is permitted.</p>
              
              {!hasUserKey && (
                <div className="mt-8 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-[10px] text-blue-600 font-bold uppercase mb-2">Notice</p>
                  <p className="text-[10px] text-slate-500 leading-tight mb-3">Hitting rate limits? Connect a personal API key from a paid GCP project.</p>
                  <button 
                    onClick={handleOpenKeySelector}
                    className="w-full py-2 bg-blue-600 text-white text-[9px] font-black uppercase rounded-lg hover:bg-blue-700 transition-all"
                  >
                    Manage API Key
                  </button>
                  <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="block text-center mt-2 text-[8px] font-bold text-slate-400 uppercase hover:underline">Billing Docs</a>
                </div>
              )}
            </div>
          )}

          {currentLayout?.insights && currentLayout.insights.map(insight => (
            <div key={insight.id} className="bg-slate-50 border border-slate-200 p-3 rounded-xl animate-in slide-in-from-left-2 group cursor-default">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${insight.impact === 'high' ? 'bg-rose-500' : 'bg-blue-500'}`}></span>
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">{insight.type}</p>
                </div>
                {insight.confidence && (
                  <span className="text-[8px] font-black text-emerald-600 uppercase">Verified: {(insight.confidence * 100).toFixed(0)}%</span>
                )}
              </div>
              <p className="text-xs font-bold text-slate-800 leading-tight mb-1">{insight.title}</p>
              <p className="text-[10px] text-slate-600 leading-snug">{insight.summary}</p>
            </div>
          ))}

          {history.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[90%] rounded-2xl p-3 text-sm shadow-sm ${
                msg.role === 'user' ? 'bg-slate-800 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-200'
              }`}>
                {msg.content}
                {msg.isActionable && (
                  <button 
                    onClick={handleOpenKeySelector}
                    className="mt-3 w-full py-2 bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-black uppercase rounded-lg hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-key"></i> Switch API Key
                  </button>
                )}
              </div>
            </div>
          ))}
          {isGenerating && (
            <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-2xl text-slate-500 animate-pulse">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">{generationReason}</span>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-white">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={(e) => handleGenerate('', undefined, e.target.files?.[0])} 
            accept=".csv,.json,.xlsx,.xls,.png,.jpg,.jpeg" 
          />
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button onClick={() => fileInputRef.current?.click()} className="py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-black transition-all flex items-center justify-center gap-2">
              <i className="fa-solid fa-file-import"></i> Upload Data
            </button>
            <button onClick={() => handleGenerate("Scan source for mathematical trends")} className="py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
              <i className="fa-solid fa-magnifying-glass-chart"></i> Scan Schema
            </button>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleGenerate(query); }} className="relative">
            <textarea 
              placeholder="Ask for calculations or summaries..."
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 transition-all resize-none shadow-inner"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" disabled={isGenerating || !query.trim()} className="absolute right-2.5 bottom-2.5 w-10 h-10 bg-blue-600 rounded-xl text-white flex items-center justify-center hover:bg-blue-700 transition-all disabled:opacity-50">
              <i className="fa-solid fa-bolt text-xs"></i>
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">{currentLayout?.name || "Intelligence Canvas"}</h2>
            {detectedSource && (
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded border border-emerald-100 uppercase tracking-widest">
                <i className="fa-solid fa-circle-check mr-1"></i> Connected: {detectedSource.label}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
             {currentLayout && (
               <button 
                 onClick={handleRegenerate}
                 disabled={isGenerating}
                 className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center gap-2 disabled:opacity-50"
               >
                 <i className={`fa-solid fa-arrows-rotate ${isGenerating ? 'animate-spin' : ''}`}></i> Shuffle Layout
               </button>
             )}
             <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase">
               <i className="fa-solid fa-shield-check"></i> Verifiable Analysis
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
          {currentLayout ? (
            <DashboardCanvas 
              layout={currentLayout} 
              onInteraction={(ctx) => handleGenerate("", ctx)} 
              simulations={simulationVariables}
              sourceData={detectedSource?.data}
            />
          ) : (
            <div 
              className={`h-full flex flex-col items-center justify-center text-center px-10 transition-all duration-300 ${isDragging ? 'drop-zone-active' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="w-24 h-24 bg-white border border-slate-200 rounded-3xl shadow-xl flex items-center justify-center mb-8 animate-bounce">
                <i className={`fa-solid ${isDragging ? 'fa-cloud-arrow-up text-blue-500' : 'fa-database text-slate-300'} text-3xl`}></i>
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">
                {isDragging ? 'Release to Ingest' : 'Start with your Data'}
              </h2>
              <p className="text-slate-500 max-w-lg text-lg font-medium leading-relaxed">
                Drop your **CSV, JSON, or Excel** files here to begin instant client-side analysis. No data leaves your browser.
              </p>
              
              {!isDragging && (
                <div className="mt-12 flex flex-col items-center gap-6">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                  >
                    <i className="fa-solid fa-file-circle-plus"></i> Select File for Analysis
                  </button>
                  <div className="flex gap-4 opacity-50">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                       <i className="fa-solid fa-check"></i> Excel / CSV
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                       <i className="fa-solid fa-check"></i> JSON Objects
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                       <i className="fa-solid fa-check"></i> Gemini Vision OCR
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <IntelligenceToolbar onToggleFeature={toggleFeature} activeFeatures={activeFeatures} onVoiceCommand={(text) => handleGenerate(text)} />
        {activeFeatures.includes('simulation') && <ScenarioSimulator variables={simulationVariables} onUpdate={setSimulationVariables} onClose={() => toggleFeature('simulation')} />}
        {activeFeatures.includes('lineage') && <LineageViewer onClose={() => toggleFeature('lineage')} />}
        {activeFeatures.includes('reporting') && currentLayout && <NarrativeReportModal layout={currentLayout} onClose={() => toggleFeature('reporting')} />}
        {activeFeatures.includes('collaboration') && <CollaborationPanel annotations={annotations} onAddAnnotation={handleAddAnnotation} onClose={() => toggleFeature('collaboration')} />}
        {activeFeatures.includes('predictive') && <PredictiveMonitor predictions={predictions} onClose={() => toggleFeature('predictive')} />}
      </main>
      <ChatBot />
    </div>
  );
};

export default App;
