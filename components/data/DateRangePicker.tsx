
import React, { useState } from 'react';

interface DateRangePickerProps {
  title: string;
  data?: {
    start: string;
    end: string;
  };
  isLoading: boolean;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ title, data, isLoading }) => {
  const [range, setRange] = useState({
    start: data?.start || new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
    end: data?.end || new Date().toISOString().split('T')[0],
  });

  const presets = [
    { label: 'Today', days: 0 },
    { label: 'Yesterday', days: 1 },
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 },
  ];

  const handlePreset = (days: number) => {
    const end = new Date().toISOString().split('T')[0];
    const start = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];
    setRange({ start, end });
  };

  if (isLoading) return <div className="bg-white p-6 rounded-xl border border-slate-200 h-full animate-pulse" />;

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <i className="fa-solid fa-calendar-days text-blue-500"></i>
        <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">{title}</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Start Date</label>
          <input 
            type="date" 
            value={range.start}
            onChange={(e) => setRange({ ...range, start: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">End Date</label>
          <input 
            type="date" 
            value={range.end}
            onChange={(e) => setRange({ ...range, end: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-auto">
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => handlePreset(p.days)}
            className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors border border-transparent hover:border-blue-100"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DateRangePicker;
