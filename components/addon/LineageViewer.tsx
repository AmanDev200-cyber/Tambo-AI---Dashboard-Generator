
import React from 'react';

interface LineageNode {
  id: string;
  label: string;
  type: 'source' | 'transform' | 'output';
  status: 'active' | 'cached' | 'error';
}

const LineageViewer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const nodes: LineageNode[] = [
    { id: 's1', label: 'Postgres Production', type: 'source', status: 'active' },
    { id: 't1', label: 'Gemini OCR Layer', type: 'transform', status: 'cached' },
    { id: 't2', label: 'Anomaly Vectorizer', type: 'transform', status: 'active' },
    { id: 'o1', label: 'Intelligence Canvas', type: 'output', status: 'active' },
  ];

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl h-[500px] rounded-3xl shadow-2xl border border-white flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <i className="fa-solid fa-sitemap"></i>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 tracking-tight">Data Lineage & Traceability</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Verifiable Evidence Chain</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="flex-1 bg-slate-50 relative overflow-hidden flex items-center justify-center p-12">
          {/* Mock Graph Layout */}
          <div className="flex items-center gap-16 relative">
             {/* Source */}
             <div className="w-48 p-4 bg-white border-2 border-slate-200 rounded-2xl shadow-sm relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-[9px] font-black uppercase text-slate-400">Source</span>
                </div>
                <p className="text-sm font-black text-slate-800 leading-tight">Postgres PROD-01</p>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">LATENCY: 0.04ms</p>
             </div>

             <i className="fa-solid fa-chevron-right text-slate-300 text-xl"></i>

             {/* Transform */}
             <div className="w-48 p-4 bg-blue-600 border-2 border-blue-500 rounded-2xl shadow-xl relative z-10 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  <span className="text-[9px] font-black uppercase text-blue-200">Processing</span>
                </div>
                <p className="text-sm font-black leading-tight">Gemini Reasoning Engine</p>
                <p className="text-[10px] text-blue-100 mt-1 font-mono">TOKENS: 1,402</p>
             </div>

             <i className="fa-solid fa-chevron-right text-slate-300 text-xl"></i>

             {/* Output */}
             <div className="w-48 p-4 bg-white border-2 border-slate-200 rounded-2xl shadow-sm relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-[9px] font-black uppercase text-slate-400">Output</span>
                </div>
                <p className="text-sm font-black text-slate-800 leading-tight">Live Dashboard</p>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">STATE: STABLE</p>
             </div>

             {/* SVG Connector Lines Mock */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
               <path d="M 192,60 L 256,60" stroke="#CBD5E1" strokeWidth="2" fill="none" />
               <path d="M 448,60 L 512,60" stroke="#CBD5E1" strokeWidth="2" fill="none" />
             </svg>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-slate-100 flex justify-between items-center px-8">
           <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
               <span className="text-[10px] font-bold text-slate-500">Active</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-blue-500"></div>
               <span className="text-[10px] font-bold text-slate-500">Cached</span>
             </div>
           </div>
           <button className="text-[10px] font-black uppercase text-blue-600 hover:underline">Download Audit Trail (JSON)</button>
        </div>
      </div>
    </div>
  );
};

export default LineageViewer;
