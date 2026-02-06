
export type ComponentType = 
  | 'LineChart' 
  | 'BarChart' 
  | 'PieChart' 
  | 'AreaChart' 
  | 'MetricCard' 
  | 'DataTable' 
  | 'FilterPanel' 
  | 'DateRangePicker'
  | 'StatusPanel'
  | 'CorrelationHeatmap'
  | 'GeographicMap'
  | 'TimelineView'
  | 'InsightCard'
  | 'LineageGraph'
  | 'SimulationPanel'
  | 'PredictiveMonitor';

export interface SmartInsight {
  id: string;
  type: 'anomaly' | 'trend' | 'correlation' | 'outlier' | 'prediction' | 'opportunity';
  title: string;
  summary: string;
  impact: 'high' | 'medium' | 'low';
  suggestedAction?: string;
  evidenceComponentId?: string;
  confidence: number; // Required for Explainable Insight Layer
  reasoning: string;  // Required for Explainable Insight Layer
  method: string;     // e.g. "Linear Regression", "Anomaly Detection"
}

export interface Annotation {
  id: string;
  componentId?: string;
  userName: string;
  text: string;
  timestamp: string;
  resolved: boolean;
}

export interface Prediction {
  id: string;
  metric: string;
  currentValue: number;
  predictedValue: number;
  horizon: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface SimulationVariable {
  id: string;
  name: string;
  min: number;
  max: number;
  current: number;
  unit?: string;
}

export interface DashboardComponent {
  id: string;
  type: ComponentType;
  title: string;
  description?: string;
  gridConfig: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  props: any;
  dataSource?: {
    type: 'mock' | 'real' | 'file';
    sourceId?: string;
    query?: string;
  };
}

export interface DashboardLayout {
  id: string;
  name: string;
  components: DashboardComponent[];
  version: number;
  insights?: SmartInsight[];
  annotations?: Annotation[];
  simulations?: SimulationVariable[];
}

export interface TamboThreadMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  layout?: DashboardLayout;
  isActionable?: boolean;
}

export interface InteractionContext {
  componentId: string;
  elementLabel: string;
  elementValue: any;
  action: 'click' | 'filter' | 'drilldown' | 'simulate' | 'annotate';
}
