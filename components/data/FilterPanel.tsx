
import React, { useState } from 'react';

interface FilterPanelProps {
  title: string;
  data?: any[];
  isLoading: boolean;
  onClick?: (label: string, value: any) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ title, isLoading, onClick }) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const categories = [
    { label: 'Platform', options: ['Web', 'iOS', 'Android', 'Mobile Web'] },
    { label: 'Region', options: ['North America', 'Europe', 'Asia Pacific', 'LATAM'] },
    { label: 'Status', options: ['Completed', 'Pending', 'Failed', 'Cancelled'] }
  ];

  const toggleFilter = (opt: string) => {
    const nextFilters = activeFilters.includes(opt) 
      ? activeFilters.filter(f => f !== opt) 
      : [...activeFilters, opt];
    
    setActiveFilters(nextFilters);
    
    // Notify orchestrator of the filter change
    if (onClick) {
      onClick(opt, nextFilters);
    }
  };

  if (isLoading) return <div className="bg-white p-6 rounded-xl border border-slate-200 h-full animate-pulse" />;

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-filter text-blue-500"></i>
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">{title}</h3>
        </div>
        <button 
          onClick={() => {
            setActiveFilters([]);
            onClick?.('All', []);
          }}
          className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-4 overflow-y-auto pr-2">
        {categories.map((cat) => (
          <div key={cat.label}>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">{cat.label}</h4>
            <div className="flex flex-wrap gap-2">
              {cat.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => toggleFilter(opt)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all border ${
                    activeFilters.includes(opt)
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-auto pt-4 border-t border-slate-100">
        <p className="text-[10px] text-slate-400 italic">
          {activeFilters.length === 0 
            ? 'No active filters' 
            : `Showing data for ${activeFilters.join(', ')}`}
        </p>
      </div>
    </div>
  );
};

export default FilterPanel;
