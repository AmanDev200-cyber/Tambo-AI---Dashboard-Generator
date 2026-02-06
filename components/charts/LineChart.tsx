
import React from 'react';
import { LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface LineChartProps {
  title: string;
  data?: any[];
  isLoading: boolean;
  onClick?: (label: string, value: any) => void;
}

const LineChart: React.FC<LineChartProps> = ({ title, data = [], isLoading, onClick }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-4 bg-slate-200 rounded-full shimmer"></div>
          <div className="h-4 w-32 shimmer rounded-full"></div>
        </div>
        <div className="flex-1 w-full flex flex-col gap-4">
          <div className="flex-1 border-b border-l border-slate-100 relative overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-10">
              <path d="M 0 60 Q 50 20 100 80 T 200 40 T 300 90 T 400 30" fill="none" stroke="#64748b" strokeWidth="3" className="shimmer"/>
            </svg>
            <div className="absolute inset-0 flex flex-col justify-between py-4">
               {[1,2,3].map(i => <div key={i} className="w-full h-px bg-slate-50"></div>)}
            </div>
          </div>
          <div className="flex justify-between">
            {[1,2,3,4,5].map(i => <div key={i} className="h-2 w-8 shimmer rounded-full"></div>)}
          </div>
        </div>
      </div>
    );
  }

  const handleClick = (data: any) => {
    if (onClick && data && data.activePayload) {
      const payload = data.activePayload[0].payload;
      onClick(payload.name || payload.date || payload.timestamp, payload.value);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col group hover:border-blue-300 transition-all cursor-crosshair">
      <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-tight flex items-center gap-2">
        <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
        {title}
      </h3>
      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <ReLineChart data={data} onClick={handleClick}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: '600' }} />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              animationDuration={1500}
            />
            <Line 
              type="monotone" 
              dataKey="secondary" 
              stroke="#94a3b8" 
              strokeWidth={2} 
              strokeDasharray="5 5"
              dot={false}
            />
          </ReLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChart;
