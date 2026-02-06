
import React, { useState, useEffect } from 'react';

interface DataTableProps {
  title: string;
  data?: any[];
  isLoading: boolean;
  onClick?: (label: string, value: any) => void;
}

const DataTable: React.FC<DataTableProps> = ({ title, data = [], isLoading, onClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [showColumnPicker, setShowColumnPicker] = useState(false);

  const safeData = Array.isArray(data) ? data : [];
  const allColumns = safeData.length > 0 ? Object.keys(safeData[0]).filter(k => !k.startsWith('_')) : [];

  // Initialize visible columns when data arrives or changes schema
  useEffect(() => {
    if (allColumns.length > 0 && visibleColumns.length === 0) {
      setVisibleColumns(allColumns);
    }
  }, [allColumns.length]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 h-96 flex flex-col overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
           <div className="h-4 w-32 shimmer rounded-full"></div>
           <div className="h-8 w-48 shimmer rounded-xl"></div>
        </div>
        <div className="flex-1 p-5 space-y-4">
           <div className="flex gap-4">
             <div className="h-3 w-1/4 shimmer rounded-full"></div>
             <div className="h-3 w-1/4 shimmer rounded-full"></div>
             <div className="h-3 w-1/4 shimmer rounded-full"></div>
             <div className="h-3 w-1/4 shimmer rounded-full"></div>
           </div>
           {[1,2,3,4,5,6].map(i => (
             <div key={i} className="flex gap-4 border-t border-slate-50 pt-4">
               <div className="h-4 w-1/4 shimmer rounded-full opacity-60"></div>
               <div className="h-4 w-1/4 shimmer rounded-full opacity-60"></div>
               <div className="h-4 w-1/4 shimmer rounded-full opacity-60"></div>
               <div className="h-4 w-1/4 shimmer rounded-full opacity-60"></div>
             </div>
           ))}
        </div>
      </div>
    );
  }

  const toggleColumn = (col: string) => {
    setVisibleColumns(prev => 
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
  };

  const filteredData = safeData.filter(row => 
    Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full overflow-hidden flex flex-col group transition-all">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 relative">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">{title}</h3>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setShowColumnPicker(!showColumnPicker)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border transition-all flex items-center gap-2 ${
                showColumnPicker ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
              }`}
            >
              <i className="fa-solid fa-columns"></i> Columns
            </button>

            {showColumnPicker && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex justify-between items-center mb-3">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Toggle Visibility</h4>
                   <button onClick={() => setVisibleColumns(allColumns)} className="text-[8px] font-black text-blue-600 uppercase hover:underline">Reset</button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {allColumns.map(col => (
                    <label key={col} className="flex items-center gap-2 cursor-pointer group/col">
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox" 
                          checked={visibleColumns.includes(col)}
                          onChange={() => toggleColumn(col)}
                          className="peer hidden"
                        />
                        <div className="w-4 h-4 rounded border border-slate-300 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                          <i className="fa-solid fa-check text-white text-[8px] opacity-0 peer-checked:opacity-100"></i>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-slate-600 group-hover/col:text-slate-900 transition-colors truncate">{col}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input 
              type="text" 
              placeholder="Search dataset..." 
              className="pl-8 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 shadow-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {safeData.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest italic">No observations found</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white z-10">
              <tr>
                {visibleColumns.map(col => (
                  <th key={col} className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.map((row, idx) => (
                <tr 
                  key={idx} 
                  onClick={() => onClick?.(String(row[visibleColumns[0] || allColumns[0]]), row)}
                  className={`transition-all ${onClick ? 'cursor-pointer' : ''} ${
                    row._meta?.isAnomaly 
                      ? 'bg-rose-50/50 hover:bg-rose-100/50' 
                      : 'hover:bg-slate-50'
                  }`}
                  title={row._meta?.reason || ''}
                >
                  {visibleColumns.map(col => (
                    <td key={col} className="px-5 py-3.5 text-xs font-medium text-slate-600">
                      {row._meta?.isAnomaly && col === visibleColumns[0] && (
                        <i className="fa-solid fa-circle-exclamation text-rose-500 mr-2 text-[10px]"></i>
                      )}
                      {String(row[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="p-3 px-5 bg-slate-50/80 border-t border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-400 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span>Observed: {filteredData.length} records</span>
          {visibleColumns.length < allColumns.length && (
            <span className="text-slate-500 italic">Showing {visibleColumns.length} of {allColumns.length} columns</span>
          )}
          {safeData.some(r => r._meta?.isAnomaly) && (
            <span className="text-rose-500 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
              Anomalies Detected
            </span>
          )}
        </div>
        <div className="flex gap-1">
          <button className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded-md hover:text-blue-600"><i className="fa-solid fa-chevron-left text-[8px]"></i></button>
          <button className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded-md hover:text-blue-600"><i className="fa-solid fa-chevron-right text-[8px]"></i></button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
