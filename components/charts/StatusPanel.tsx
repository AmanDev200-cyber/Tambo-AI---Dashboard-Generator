
import React from 'react';

interface StatusPanelProps {
  title: string;
  data?: {
    status: 'online' | 'offline' | 'warning' | 'idle';
    uptime?: string;
    load?: number;
    lastChecked?: string;
  };
  isLoading: boolean;
  onClick?: (label: string, value: any) => void;
}

const StatusPanel: React.FC<StatusPanelProps> = ({ title, data, isLoading, onClick }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="h-4 w-24 shimmer rounded-full"></div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shimmer"></div>
            <div className="h-3 w-12 shimmer rounded-full"></div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="h-2 w-10 shimmer rounded-full"></div>
            <div className="h-4 w-16 shimmer rounded-full"></div>
          </div>
          <div className="space-y-1">
            <div className="h-2 w-16 shimmer rounded-full"></div>
            <div className="h-4 w-8 shimmer rounded-full"></div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
          <div className="w-3 h-3 shimmer rounded-full"></div>
          <div className="h-2 w-32 shimmer rounded-full"></div>
        </div>
      </div>
    );
  }

  const getStatusColor = () => {
    switch (data?.status) {
      case 'online': return 'bg-emerald-500';
      case 'warning': return 'bg-amber-500';
      case 'offline': return 'bg-rose-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div 
      onClick={() => onClick?.(title, data?.status)}
      className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col justify-between transition-all ${
        onClick ? 'cursor-pointer hover:border-blue-400' : ''
      }`}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">{title}</h3>
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor()} animate-pulse`}></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{data?.status || 'Unknown'}</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Uptime</p>
          <p className="text-sm font-bold text-slate-700">{data?.uptime || '99.9%'}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Load</p>
          <p className="text-sm font-bold text-slate-700">{data?.load || 0}%</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-50 text-[10px] text-slate-400 flex items-center gap-2">
        <i className="fa-solid fa-clock-rotate-left"></i>
        Last sync: {data?.lastChecked || new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default StatusPanel;
