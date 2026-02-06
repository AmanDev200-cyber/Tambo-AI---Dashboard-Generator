
import { ComponentType } from './types';

// Define metadata for all available component types to ensure type safety in the dashboard orchestration.
export const COMPONENT_METADATA: Record<ComponentType, { description: string, icon: string }> = {
  LineChart: { 
    description: "Trends over time. Best for continuous data series.", 
    icon: "fa-chart-line" 
  },
  BarChart: { 
    description: "Categorical comparisons. Best for ranking or distribution.", 
    icon: "fa-chart-bar" 
  },
  PieChart: { 
    description: "Part-to-whole relationships. Best for simple compositions.", 
    icon: "fa-chart-pie" 
  },
  AreaChart: { 
    description: "Cumulative totals over time. Best for volume trends.", 
    icon: "fa-chart-area" 
  },
  MetricCard: { 
    description: "High-level KPIs. Best for summary snapshots.", 
    icon: "fa-hashtag" 
  },
  DataTable: { 
    description: "Granular data viewing. Best for detailed exploration.", 
    icon: "fa-table" 
  },
  FilterPanel: { 
    description: "Interactive data slicing. Best for exploratory dashboards.", 
    icon: "fa-filter" 
  },
  DateRangePicker: { 
    description: "Temporal filtering. Essential for time-series analysis.", 
    icon: "fa-calendar-days" 
  },
  StatusPanel: { 
    description: "Real-time status tracking. Best for monitoring health and state.", 
    icon: "fa-signal" 
  },
  CorrelationHeatmap: { 
    description: "Statistical relationships. Best for identifying clusters and dependencies.", 
    icon: "fa-border-all" 
  },
  GeographicMap: { 
    description: "Spatial distribution. Best for location-based analysis.", 
    icon: "fa-map-location-dot" 
  },
  TimelineView: { 
    description: "Sequential events. Best for process tracking and audit trails.", 
    icon: "fa-timeline" 
  },
  InsightCard: { 
    description: "AI-generated narrative. Best for summarizing complex findings.", 
    icon: "fa-lightbulb" 
  },
  // Added missing component metadata for LineageGraph
  LineageGraph: { 
    description: "Data provenance and flow visualization. Best for tracking data origins.", 
    icon: "fa-sitemap" 
  },
  // Added missing component metadata for SimulationPanel
  SimulationPanel: { 
    description: "Scenario modeling and what-if analysis controls.", 
    icon: "fa-vial-circle-check" 
  },
  // Added missing component metadata for PredictiveMonitor to fix TypeScript Record error
  PredictiveMonitor: {
    description: "Real-time trajectory tracking and anomaly forecasting.",
    icon: "fa-crystal-ball"
  }
};

export const GRID_COLUMNS = 12;
