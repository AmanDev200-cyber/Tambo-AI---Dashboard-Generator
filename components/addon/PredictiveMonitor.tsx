
import React from 'react';
import { Prediction } from '../../types';

interface PredictiveMonitorProps {
  predictions: Prediction[];
  onClose: () => void;
}

const PredictiveMonitor: React.FC<PredictiveMonitorProps> = ({ predictions, onClose }) => {
  return (
    <div className="fixed right-0 top-16 bottom-0 w-80 bg-white border-l border-slate-200 shadow-2xl z-30 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-slate-100 bg-amber-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-crystal-ball text-amber-600"></i>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Predictive Engine</h3>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><i className="fa-solid fa-xmark"></i></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-amber-100/30 p-3 rounded-xl border border-amber-100 mb-2">
          <p className="text-[10px] font-bold text-amber-700 leading-tight flex items-center gap-2">
            <i className="fa-solid fa-shield-halved"></i>
            Active Trajectory Guard: 92% Confidence
          </p>
        </div>

        {predictions.map((p) => (
          <div key={p.id} className="p-4 border border-slate-100 rounded-2xl bg-white shadow-sm hover:border-amber-200 transition-all">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{p.metric}</span>
              <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${
                p.riskLevel === 'high' ? 'bg-rose-500 text-white' : 
                p.riskLevel === 'medium' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
              }`}>
                {p.riskLevel} Risk
              </span>
            </div>

            <div className="flex items-end gap-3">
              <span className="text-lg font-black text-slate-800">{p.currentValue.toLocaleString()}</span>
              <i className="fa-solid fa-right-long text-slate-300 mb-1"></i>
              <span className="text-lg font-black text-amber-600">{p.predictedValue.toLocaleString()}</span>
            </div>
            
            <p className="text-[9px] font-bold text-slate-400 uppercase mt-2">Projection Horizon: {p.horizon}</p>
            
            <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-amber-400" style={{ width: '75%' }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <button className="w-full py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
           <i className="fa-solid fa-bell"></i> Configure Smart Alerts
        </button>
      </div>
    </div>
  );
};

export default PredictiveMonitor;
