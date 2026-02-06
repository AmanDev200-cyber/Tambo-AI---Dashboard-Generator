
import React, { useState } from 'react';
import { SimulationVariable } from '../../types';

interface ScenarioSimulatorProps {
  variables: SimulationVariable[];
  onUpdate: (vars: SimulationVariable[]) => void;
  onClose: () => void;
}

const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({ variables, onUpdate, onClose }) => {
  const [localVars, setLocalVars] = useState(variables);

  const handleChange = (id: string, value: number) => {
    const next = localVars.map(v => v.id === id ? { ...v, current: value } : v);
    setLocalVars(next);
    onUpdate(next);
  };

  return (
    <div className="fixed right-0 top-16 bottom-0 w-80 bg-white border-l border-slate-200 shadow-2xl z-30 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-slate-100 bg-purple-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-vial-circle-check text-purple-600"></i>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Scenario Engine</h3>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><i className="fa-solid fa-xmark"></i></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="bg-purple-100/30 p-3 rounded-xl border border-purple-100">
          <p className="text-[10px] font-bold text-purple-700 leading-tight">
            Adjusting parameters will trigger real-time recalculations across all active forecasts.
          </p>
        </div>

        {localVars.map((v) => (
          <div key={v.id} className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{v.name}</label>
              <span className="text-sm font-black text-purple-600">{v.current}{v.unit}</span>
            </div>
            <input 
              type="range" 
              min={v.min} 
              max={v.max} 
              step={(v.max - v.min) / 100}
              value={v.current}
              onChange={(e) => handleChange(v.id, parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-[8px] font-bold text-slate-400">
              <span>{v.min}{v.unit}</span>
              <span>{v.max}{v.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <button className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg">
          <i className="fa-solid fa-rotate-left"></i> Reset Projection
        </button>
      </div>
    </div>
  );
};

export default ScenarioSimulator;
