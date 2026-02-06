
import React from 'react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PieChartProps {
  title: string;
  data?: any[];
  isLoading: boolean;
  isDonut?: boolean;
  onClick?: (label: string, value: any) => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];

const PieChart: React.FC<PieChartProps> = ({ title, data = [], isLoading, isDonut = true, onClick }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 h-full flex flex-col items-center">
        <div className="w-full flex items-center gap-2 mb-4">
          <div className="w-1.5 h-4 bg-slate-200 rounded-full shimmer"></div>
          <div className="h-4 w-32 shimmer rounded-full"></div>
        </div>
        <div className="flex-1 w-full flex items-center justify-center relative">
          <div className="w-40 h-40 rounded-full shimmer border-[12px] border-white/20"></div>
          {isDonut && <div className="absolute w-20 h-20 bg-white rounded-full"></div>}
        </div>
        <div className="w-full flex justify-center gap-4 mt-4">
          {[1,2,3].map(i => (
            <div key={i} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full shimmer"></div>
              <div className="h-2 w-10 shimmer rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleClick = (entry: any) => {
    if (onClick && entry) {
      onClick(entry.name, entry.value);
    }
  };

  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col group hover:border-blue-300 transition-all cursor-crosshair">
      <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-tight flex items-center gap-2">
        <div className="w-1.5 h-4 bg-orange-500 rounded-full"></div>
        {title}
      </h3>
      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <RePieChart>
            <Pie
              data={safeData}
              cx="50%"
              cy="50%"
              innerRadius={isDonut ? 60 : 0}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              onClick={handleClick}
            >
              {safeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="cursor-pointer hover:opacity-80 transition-opacity" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
          </RePieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChart;
