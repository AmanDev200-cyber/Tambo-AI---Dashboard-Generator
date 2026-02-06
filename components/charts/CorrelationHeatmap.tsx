
import React from 'react';

interface CorrelationHeatmapProps {
  title: string;
  data?: any[];
  isLoading: boolean;
  onClick?: (label: string, value: any) => void;
}

const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({ title, data = [], isLoading, onClick }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-4 bg-slate-200 rounded-full shimmer"></div>
          <div className="h-4 w-40 shimmer rounded-full"></div>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-5 grid-rows-5 gap-1 h-full">
            <div className="h-full w-full"></div>
            {[1,2,3,4].map(i => <div key={i} className="h-full w-full shimmer rounded-sm opacity-20"></div>)}
            {[1,2,3,4].map(row => (
              <React.Fragment key={row}>
                <div className="h-full w-full shimmer rounded-sm opacity-20"></div>
                {[1,2,3,4].map(col => (
                  <div key={col} className="h-full w-full shimmer rounded-sm opacity-40"></div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const safeData = Array.isArray(data) ? data : [];
  const keys = safeData.length > 0 ? Object.keys(safeData[0]).filter(k => k !== 'name') : [];

  const getColor = (val: number) => {
    const opacity = Math.abs(val);
    if (val > 0) return `rgba(59, 130, 246, ${opacity})`;
    return `rgba(239, 68, 68, ${opacity})`;
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col group hover:border-blue-300 transition-all overflow-hidden">
      <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-tight flex items-center gap-2">
        <div className="w-1.5 h-4 bg-indigo-600 rounded-full"></div>
        {title}
      </h3>
      <div className="flex-1 overflow-auto">
        <div className="min-w-[400px]">
          <div className="grid" style={{ gridTemplateColumns: `repeat(${keys.length + 1}, 1fr)` }}>
            <div className="h-10"></div>
            {keys.map(k => (
              <div key={k} className="h-10 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase rotate-[-45deg]">{k}</div>
            ))}
            
            {safeData.map((row, i) => (
              <React.Fragment key={row.name || i}>
                <div className="h-10 flex items-center text-[10px] font-bold text-slate-500 uppercase">{row.name}</div>
                {keys.map(k => (
                  <div 
                    key={k} 
                    onClick={() => onClick?.(`${row.name} vs ${k}`, row[k])}
                    className="h-10 border border-white flex items-center justify-center text-[10px] font-bold text-white transition-all hover:scale-105 cursor-pointer rounded-sm"
                    style={{ backgroundColor: getColor(row[k]) }}
                  >
                    {row[k]}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorrelationHeatmap;
