
import React from 'react';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface BarChartProps {
  title: string;
  data?: any[];
  isLoading: boolean;
  onClick?: (label: string, value: any) => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const BarChart: React.FC<BarChartProps> = ({ title, data = [], isLoading, onClick }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-4 bg-slate-200 rounded-full shimmer"></div>
          <div className="h-4 w-32 shimmer rounded-full"></div>
        </div>
        <div className="flex-1 w-full flex items-end justify-between gap-4 px-4 border-b border-slate-100 pb-2">
          <div className="flex-1 h-3/4 shimmer rounded-t-md opacity-40"></div>
          <div className="flex-1 h-1/2 shimmer rounded-t-md opacity-60"></div>
          <div className="flex-1 h-full shimmer rounded-t-md opacity-40"></div>
          <div className="flex-1 h-2/3 shimmer rounded-t-md opacity-60"></div>
          <div className="flex-1 h-1/3 shimmer rounded-t-md opacity-40"></div>
        </div>
        <div className="flex justify-between mt-2">
          {[1,2,3,4,5].map(i => <div key={i} className="h-2 w-10 shimmer rounded-full"></div>)}
        </div>
      </div>
    );
  }

  const handleBarClick = (entry: any) => {
    if (onClick && entry) {
      onClick(entry.name, entry.value);
    }
  };

  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col group hover:border-blue-300 transition-all">
      <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-tight flex items-center gap-2">
        <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
        {title}
      </h3>
      <div className="flex-1 w-full min-h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <ReBarChart data={safeData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
            <Tooltip 
              cursor={{fill: '#f8fafc'}} 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={24} onClick={handleBarClick}>
              {safeData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  className="cursor-pointer hover:opacity-70 transition-opacity" 
                />
              ))}
            </Bar>
          </ReBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChart;
