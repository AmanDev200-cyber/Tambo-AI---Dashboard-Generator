
import React, { useEffect, useState } from 'react';
import { DashboardLayout, DashboardComponent, InteractionContext, SimulationVariable } from '../types';
import MetricCard from './charts/MetricCard';
import LineChart from './charts/LineChart';
import BarChart from './charts/BarChart';
import PieChart from './charts/PieChart';
import AreaChart from './charts/AreaChart';
import StatusPanel from './charts/StatusPanel';
import CorrelationHeatmap from './charts/CorrelationHeatmap';
import InsightCard from './charts/InsightCard';
import GeographicMap from './charts/GeographicMap';
import TimelineView from './charts/TimelineView';
import PredictiveMonitor from './charts/PredictiveMonitor';
import LineageGraph from './charts/LineageGraph';
import DataTable from './data/DataTable';
import FilterPanel from './data/FilterPanel';
import DateRangePicker from './data/DateRangePicker';
import { UniversalDataAdapter } from '../services/dataAdapter';

interface DashboardCanvasProps {
  layout: DashboardLayout;
  onInteraction: (ctx: InteractionContext) => void;
  simulations?: SimulationVariable[];
  sourceData?: any[];
}

const ComponentRenderer: React.FC<{
  comp: DashboardComponent;
  data: any;
  isLoading: boolean;
  onInteraction: (ctx: InteractionContext) => void;
}> = ({ comp, data, isLoading, onInteraction }) => {
  const handleComponentClick = (elementLabel: string, elementValue: any) => {
    const actionType = comp.type === 'FilterPanel' ? 'filter' : 
                      (comp.type === 'LineChart' || comp.type === 'BarChart' || comp.type === 'CorrelationHeatmap') ? 'drilldown' : 'click';

    onInteraction({
      componentId: comp.id,
      elementLabel,
      elementValue,
      action: actionType as 'click' | 'filter' | 'drilldown'
    });
  };

  const commonProps = {
    title: comp.title,
    data: data,
    isLoading: isLoading,
    onClick: handleComponentClick,
    ...comp.props,
    props: comp.props 
  };

  switch (comp.type) {
    case 'MetricCard': return <MetricCard {...commonProps} />;
    case 'LineChart': return <LineChart {...commonProps} />;
    case 'BarChart': return <BarChart {...commonProps} />;
    case 'PieChart': return <PieChart {...commonProps} />;
    case 'AreaChart': return <AreaChart {...commonProps} />;
    case 'StatusPanel': return <StatusPanel {...commonProps} />;
    case 'CorrelationHeatmap': return <CorrelationHeatmap {...commonProps} />;
    case 'InsightCard': return <InsightCard {...commonProps} />;
    case 'GeographicMap': return <GeographicMap {...commonProps} />;
    case 'TimelineView': return <TimelineView {...commonProps} />;
    case 'PredictiveMonitor': return <PredictiveMonitor {...commonProps} />;
    case 'LineageGraph': return <LineageGraph {...commonProps} />;
    case 'DataTable': return <DataTable {...commonProps} />;
    case 'FilterPanel': return <FilterPanel {...commonProps} />;
    case 'DateRangePicker': return <DateRangePicker {...commonProps} />;
    default: return (
      <div className="bg-white p-6 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400 h-full">
        <span className="text-xs uppercase tracking-widest font-bold">Unsupported: {comp.type}</span>
      </div>
    );
  }
};

const DashboardCanvas: React.FC<DashboardCanvasProps> = ({ layout, onInteraction, simulations, sourceData }) => {
  const [componentData, setComponentData] = useState<Record<string, any>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;
    if (!layout || !layout.components) return;

    const fetchAllData = async () => {
      for (const comp of layout.components) {
        if (isMounted) setLoadingMap(prev => ({ ...prev, [comp.id]: true }));
        
        try {
          const data = await UniversalDataAdapter.fetchData(comp.type, comp.title, simulations, comp.props, sourceData);
          if (isMounted) setComponentData(prev => ({ ...prev, [comp.id]: data }));
        } catch (error) {
          console.error(`Fetch error for ${comp.id}`, error);
        } finally {
          if (isMounted) setLoadingMap(prev => ({ ...prev, [comp.id]: false }));
        }
      }
    };

    fetchAllData();
    return () => { isMounted = false; };
  }, [layout, simulations, sourceData]);

  return (
    <div className="grid grid-cols-12 auto-rows-min gap-6 p-6 pb-20 max-w-[1600px] mx-auto">
      {layout.components.map((comp) => (
        <div 
          key={`${comp.id}-${layout.version}`}
          style={{ 
            gridColumn: `span ${comp.gridConfig.w}`, 
            gridRow: `span ${comp.gridConfig.h}` 
          }}
          className="min-h-[140px] transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 zoom-in-95"
        >
          <ComponentRenderer 
            comp={comp} 
            data={componentData[comp.id]} 
            isLoading={loadingMap[comp.id] || false} 
            onInteraction={onInteraction}
          />
        </div>
      ))}
    </div>
  );
};

export default DashboardCanvas;
