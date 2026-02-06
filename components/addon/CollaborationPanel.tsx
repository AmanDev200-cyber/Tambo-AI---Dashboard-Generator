
import React, { useState } from 'react';
import { Annotation } from '../../types';

interface CollaborationPanelProps {
  annotations: Annotation[];
  onAddAnnotation: (text: string) => void;
  onClose: () => void;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({ annotations, onAddAnnotation, onClose }) => {
  const [text, setText] = useState('');

  return (
    <div className="fixed right-0 top-16 bottom-0 w-80 bg-white border-l border-slate-200 shadow-2xl z-30 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-slate-100 bg-emerald-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-users-viewfinder text-emerald-600"></i>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Collaboration</h3>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><i className="fa-solid fa-xmark"></i></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {annotations.length === 0 && (
          <div className="text-center py-10">
            <i className="fa-solid fa-comments text-slate-200 text-3xl mb-3"></i>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No annotations yet</p>
          </div>
        )}
        
        {annotations.map((ann) => (
          <div key={ann.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">{ann.userName}</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase">{new Date(ann.timestamp).toLocaleTimeString()}</span>
            </div>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">{ann.text}</p>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-100 bg-white">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share an insight with the team..."
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 h-24 resize-none mb-3"
        />
        <button 
          onClick={() => { if(text.trim()) { onAddAnnotation(text); setText(''); } }}
          className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          <i className="fa-solid fa-paper-plane"></i> Post Comment
        </button>
      </div>
    </div>
  );
};

export default CollaborationPanel;
