
import React, { useMemo } from 'react';

interface LineageNode {
  id: string;
  label: string;
  type: 'source' | 'process' | 'output';
  status: 'success' | 'warning' | 'error';
  metadata?: string;
}

interface LineageEdge {
  from: string;
  to: string;
}

interface LineageGraphProps {
  title: string;
  data?: {
    nodes: LineageNode[];
    edges: LineageEdge[];
  };
  isLoading: boolean;
  onClick?: (label: string, value: any) => void;
}

const LineageGraph: React.FC<LineageGraphProps> = ({ title, data, isLoading, onClick }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 h-full flex flex-col">
        <div className="h-4 w-40 shimmer rounded-full mb-8"></div>
        <div className="flex-1 flex items-center justify-around">
          <div className="w-24 h-16 shimmer rounded-xl"></div>
          <div className="w-24 h-16 shimmer rounded-xl"></div>
          <div className="w-24 h-16 shimmer rounded-xl"></div>
        </div>
      </div>
    );
  }

  const nodes = data?.nodes || [];
  const edges = data?.edges || [];

  // Group nodes by type for columns
  const columns = useMemo(() => {
    return {
      source: nodes.filter(n => n.type === 'source'),
      process: nodes.filter(n => n.type === 'process'),
      output: nodes.filter(n => n.type === 'output'),
    };
  }, [nodes]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-emerald-500';
      case 'warning': return 'bg-amber-500';
      case 'error': return 'bg-rose-500';
      default: return 'bg-slate-300';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'source': return 'fa-database';
      case 'process': return 'fa-gears';
      case 'output': return 'fa-desktop';
      default: return 'fa-circle';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col group hover:border-blue-400 transition-all overflow-hidden relative">
      <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight flex items-center gap-2 mb-6">
        <i className="fa-solid fa-sitemap text-blue-600"></i>
        {title}
      </h3>

      <div className="flex-1 flex justify-between gap-4 items-center relative min-h-[180px]">
        {/* SVG layer for connectors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
            </marker>
          </defs>
          {/* Simple logic for connectors could be added here if node positions were tracked, 
              but for a declarative grid we rely on column alignment visuals */}
        </svg>

        {Object.entries(columns).map(([key, colNodes]) => (
          <div key={key} className="flex flex-col gap-4 z-10 flex-1 items-center">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{key}s</span>
            {colNodes.map(node => (
              <div 
                key={node.id}
                onClick={() => onClick?.(node.label, node.status)}
                className="w-full max-w-[140px] p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group/node"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(node.status)}`}></div>
                  <i className={`fa-solid ${getIcon(node.type)} text-[10px] text-slate-400 group-hover/node:text-blue-500`}></i>
                </div>
                <p className="text-[11px] font-bold text-slate-800 leading-tight truncate" title={node.label}>
                  {node.label}
                </p>
                {node.metadata && (
                  <p className="text-[8px] font-mono text-slate-400 mt-1 uppercase tracking-tighter">
                    {node.metadata}
                  </p>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-shield-halved text-emerald-500"></i>
          Verified Flow
        </div>
        <span>{nodes.length} Active Nodes</span>
      </div>
    </div>
  );
};

export default LineageGraph;
