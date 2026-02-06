
import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface MetricCardProps {
  title: string;
  data?: {
    value: number;
    trend: number;
    suffix?: string;
    sparkline?: { value: number }[];
    forecast?: number;
    confidence?: number;
  };
  isLoading: boolean;
  onClick?: (label: string, value: any) => void;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, data, isLoading, onClick }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
          <div className="h-3 w-20 shimmer rounded-full"></div>
          <div className="h-4 w-12 shimmer rounded-full"></div>
        </div>
        <div className="flex items-end justify-between mt-auto">
          <div className="space-y-2">
            <div className="h-8 w-24 shimmer rounded-lg"></div>
            <div className="h-3 w-16 shimmer rounded-full"></div>
          </div>
          <div className="w-16 h-8 shimmer rounded-md opacity-50"></div>
        </div>
      </div>
    );
  }

  const isPositive = (data?.trend || 0) >= 0;

  return (
    <div 
      onClick={() => onClick?.(title, data?.value)}
      className={`bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-all h-full flex flex-col group relative overflow-hidden ${
        onClick ? 'cursor-pointer hover:border-blue-400 hover:shadow-lg active:scale-[0.99]' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</h3>
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {isPositive ? '+' : ''}{data?.trend}%
        </span>
      </div>

      <div className="flex items-end justify-between mt-auto">
        <div>
          <span className="text-3xl font-black text-slate-900 tracking-tighter">
            {data?.suffix === '$' ? '$' : ''}{data?.value.toLocaleString()}{data?.suffix === '%' ? '%' : ''}
          </span>
          {data?.forecast && (
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Forecast:</span>
              <span className="text-[10px] text-blue-600 font-black tracking-tight">
                {data?.suffix === '$' ? '$' : ''}{data?.forecast.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {data?.sparkline && (
          <div className="w-24 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.sparkline}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={isPositive ? '#10b981' : '#f43f5e'} 
                  strokeWidth={2} 
                  dot={false} 
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {data?.confidence && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
          <div 
            className="h-full bg-blue-500 transition-all duration-1000" 
            style={{ width: `${data.confidence}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
