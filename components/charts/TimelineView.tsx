
import React from 'react';

interface TimelineEvent {
  time: string;
  event: string;
  status: 'success' | 'warning' | 'error' | 'info';
  description?: string;
}

interface TimelineViewProps {
  title: string;
  data?: TimelineEvent[];
  isLoading: boolean;
  onClick?: (label: string, value: any) => void;
}

const TimelineView: React.FC<TimelineViewProps> = ({ title, data = [], isLoading, onClick }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 h-full flex flex-col relative">
        <div className="h-4 w-40 shimmer rounded-full mb-8"></div>
        <div className="absolute left-[35px] top-[70px] bottom-10 w-0.5 bg-slate-100"></div>
        <div className="space-y-8 pl-4">
           {[1,2,3,4].map(i => (
             <div key={i} className="flex gap-4 items-start relative">
                <div className="w-6 h-6 rounded-full shimmer z-10"></div>
                <div className="flex-1 space-y-2">
                   <div className="flex justify-between">
                      <div className="h-2 w-10 shimmer rounded-full"></div>
                      <div className="h-3 w-12 shimmer rounded-full"></div>
                   </div>
                   <div className="h-3 w-2/3 shimmer rounded-full"></div>
                   <div className="h-2 w-full shimmer rounded-full opacity-50"></div>
                </div>
             </div>
           ))}
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return 'fa-circle-check text-emerald-500';
      case 'warning': return 'fa-triangle-exclamation text-amber-500';
      case 'error': return 'fa-circle-xmark text-rose-500';
      default: return 'fa-circle-info text-blue-500';
    }
  };

  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col group hover:border-blue-300 transition-all">
      <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-tight flex items-center gap-2">
        <div className="w-1.5 h-4 bg-slate-900 rounded-full"></div>
        {title}
      </h3>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6 relative">
        {/* Continuous Line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100"></div>

        {safeData.map((item, idx) => (
          <div 
            key={idx} 
            className="relative pl-8 animate-in slide-in-from-left-4 duration-500"
            style={{ animationDelay: `${idx * 100}ms` }}
            onClick={() => onClick?.(item.event, item.time)}
          >
            <div className="absolute left-0 top-1 w-6 h-6 bg-white rounded-full border border-slate-100 flex items-center justify-center z-10 shadow-sm">
              <i className={`fa-solid ${getStatusIcon(item.status)} text-sm`}></i>
            </div>
            
            <div className="flex flex-col cursor-pointer group/item">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{item.time}</span>
                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                  item.status === 'success' ? 'bg-emerald-50 text-emerald-600' : 
                  item.status === 'error' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {item.status}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-700 group-hover/item:text-blue-600 transition-colors">{item.event}</h4>
              {item.description && <p className="text-xs text-slate-500 leading-snug mt-1">{item.description}</p>}
            </div>
          </div>
        ))}

        {safeData.length === 0 && (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">
            No sequence data available
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineView;
