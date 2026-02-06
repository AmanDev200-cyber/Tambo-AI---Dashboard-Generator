
import React from 'react';
import { AreaChart as ReAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface AreaChartProps {
  title: string;
  data?: any[];
  isLoading: boolean;
  isStacked?: boolean;
  onClick?: (label: string, value: any) => void;
}

const AreaChart: React.FC<AreaChartProps> = ({ title, data = [], isLoading, isStacked = true, onClick }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-4 bg-slate-200 rounded-full shimmer"></div>
          <div className="h-4 w-40 shimmer rounded-full"></div>
        </div>
        <div className="flex-1 w-full relative overflow-hidden flex flex-col justify-end">
          <div className="h-1/2 w-full shimmer opacity-20 relative">
             <div className="absolute bottom-0 w-full h-full bg-slate-200" style={{ clipPath: 'polygon(0% 100%, 0% 40%, 20% 60%, 40% 20%, 60% 70%, 80% 40%, 100% 60%, 100% 100%)' }}></div>
          </div>
          <div className="h-1/4 w-full shimmer opacity-40 relative -mt-4">
             <div className="absolute bottom-0 w-full h-full bg-slate-300" style={{ clipPath: 'polygon(0% 100%, 0% 80%, 25% 60%, 50% 90%, 75% 70%, 100% 85%, 100% 100%)' }}></div>
          </div>
          <div className="w-full h-px bg-slate-200 mt-2"></div>
        </div>
      </div>
    );
  }

  const handleClick = (data: any) => {
    if (onClick && data && data.activePayload) {
      const payload = data.activePayload[0].payload;
      onClick(payload.name, payload.value);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col group hover:border-blue-300 transition-all cursor-crosshair">
      <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-tight flex items-center gap-2">
        <div className="w-1.5 h-4 bg-emerald-600 rounded-full"></div>
        {title}
      </h3>
      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <ReAreaChart data={data} onClick={handleClick}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSecondary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: '600' }} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              fillOpacity={1} 
              fill="url(#colorValue)" 
              stackId={isStacked ? "1" : undefined}
              animationDuration={1500}
            />
            <Area 
              type="monotone" 
              dataKey="secondary" 
              stroke="#10b981" 
              fillOpacity={1} 
              fill="url(#colorSecondary)" 
              stackId={isStacked ? "1" : undefined}
              animationDuration={1500}
            />
          </ReAreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaChart;
