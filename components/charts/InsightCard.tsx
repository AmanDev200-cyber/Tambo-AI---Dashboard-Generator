
import React from 'react';

interface InsightCardProps {
  title: string;
  data?: {
    summary: string;
    impact: 'high' | 'medium' | 'low';
    suggestedAction?: string;
    segments?: string[];
  };
  isLoading: boolean;
  onClick?: (label: string, value: any) => void;
}

const InsightCard: React.FC<InsightCardProps> = ({ title, data, isLoading, onClick }) => {
  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl border-2 border-slate-100 h-full flex flex-col bg-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 shimmer rounded-lg"></div>
             <div className="h-4 w-24 shimmer rounded-full"></div>
          </div>
          <div className="h-4 w-16 shimmer rounded-full"></div>
        </div>
        <div className="space-y-3 mb-8">
           <div className="h-4 w-full shimmer rounded-full"></div>
           <div className="h-4 w-full shimmer rounded-full"></div>
           <div className="h-4 w-2/3 shimmer rounded-full"></div>
        </div>
        <div className="flex gap-2 mb-8">
           <div className="h-6 w-16 shimmer rounded-md"></div>
           <div className="h-6 w-16 shimmer rounded-md"></div>
        </div>
        <div className="mt-auto pt-4 border-t border-slate-50">
           <div className="h-2 w-24 shimmer rounded-full mb-2"></div>
           <div className="h-10 w-full shimmer rounded-xl"></div>
        </div>
      </div>
    );
  }

  const impactColors = {
    high: 'border-rose-200 bg-rose-50/30 text-rose-700',
    medium: 'border-amber-200 bg-amber-50/30 text-amber-700',
    low: 'border-blue-200 bg-blue-50/30 text-blue-700'
  };

  return (
    <div className={`p-6 rounded-2xl border-2 shadow-sm h-full flex flex-col transition-all hover:shadow-md ${impactColors[data?.impact || 'low']}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
            <i className="fa-solid fa-wand-magic-sparkles text-sm"></i>
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest">{title}</h3>
        </div>
        <div className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${data?.impact === 'high' ? 'bg-rose-500 text-white' : 'bg-white/50 border border-current'}`}>
          {data?.impact} Priority
        </div>
      </div>
      
      <p className="text-sm font-bold leading-relaxed mb-6">
        {data?.summary}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {data?.segments?.map(seg => (
          <button 
            key={seg}
            onClick={() => onClick?.(`Segment: ${seg}`, seg)}
            className="px-2 py-1 bg-white/50 hover:bg-white rounded-md text-[10px] font-black uppercase tracking-tighter border border-current border-opacity-20 transition-all"
          >
            Explore {seg}
          </button>
        ))}
      </div>

      {data?.suggestedAction && (
        <div className="mt-auto pt-4 border-t border-current border-opacity-10 group/action cursor-pointer" onClick={() => onClick?.("Action Triggered", data.suggestedAction)}>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Strategy Recommendation</p>
          <div className="flex items-center gap-2 p-3 bg-white/80 rounded-xl border border-white group-hover/action:border-blue-400 transition-all">
             <i className="fa-solid fa-circle-play text-blue-500"></i>
             <p className="text-xs font-black text-slate-800">{data.suggestedAction}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightCard;
