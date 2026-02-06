
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface PredictiveMonitorProps {
  title: string;
  data?: {
    metric: string;
    currentValue: number;
    predictedValue: number;
    confidence: number;
    history: { name: string; value: number }[];
    forecast: { name: string; value: number }[];
    riskLevel: 'low' | 'medium' | 'high';
  };
  isLoading: boolean;
  onClick?: (label: string, value: any) => void;
}

const PredictiveMonitor: React.FC<PredictiveMonitorProps> = ({ title, data, isLoading, onClick }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="h-4 w-40 shimmer rounded-full"></div>
          <div className="h-4 w-12 shimmer rounded-full"></div>
        </div>
        <div className="flex-1 w-full shimmer opacity-10 rounded-xl mb-4"></div>
        <div className="h-10 w-full shimmer rounded-lg"></div>
      </div>
    );
  }

  const combinedData = [
    ...(data?.history || []),
    ...(data?.forecast || [])
  ];

  const lastHistoryIndex = (data?.history?.length || 0) - 1;
  const splitPoint = data?.history?.[lastHistoryIndex]?.name;

  const riskColors = {
    low: 'text-emerald-500 bg-emerald-50 border-emerald-100',
    medium: 'text-amber-500 bg-amber-50 border-amber-100',
    high: 'text-rose-500 bg-rose-50 border-rose-100'
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col group hover:border-amber-400 transition-all">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-tighter flex items-center gap-2">
          <i className="fa-solid fa-crystal-ball text-amber-500"></i>
          {title}
        </h3>
        <span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase ${riskColors[data?.riskLevel || 'low']}`}>
          {data?.riskLevel} Risk Trajectory
        </span>
      </div>

      <div className="flex-1 min-h-[140px] mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={combinedData}>
            <defs>
              <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            {splitPoint && <ReferenceLine x={splitPoint} stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'top', value: 'Today', fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />}
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#64748b" 
              fill="transparent" 
              strokeWidth={2}
              dot={false}
              animationDuration={1000}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              data={data?.forecast}
              stroke="#f59e0b" 
              fill="url(#forecastGradient)" 
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={false}
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between">
        <div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Expected Result</p>
          <p className="text-lg font-black text-slate-900 tracking-tighter">
            {data?.predictedValue.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Confidence</p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-amber-600">{data?.confidence}%</span>
            <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500" style={{ width: `${data?.confidence}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveMonitor;
