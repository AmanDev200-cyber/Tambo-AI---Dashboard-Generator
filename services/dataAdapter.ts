
import { ComponentType, SimulationVariable } from "../types";

export class UniversalDataAdapter {
  static async fetchData(
    type: ComponentType, 
    context: string, 
    simulations?: SimulationVariable[],
    props?: any,
    realData?: any[]
  ): Promise<any> {
    await new Promise(r => setTimeout(r, 60)); 
    
    // If real data exists, try to use it
    if (realData && realData.length > 0) {
      return this.processRealData(type, realData, props);
    }

    // Fallback to mock data
    const ctx = context.toLowerCase();
    const getMultiplier = (name: string) => {
      if (!simulations) return 1;
      const sim = simulations.find(v => v.name.toLowerCase().includes(name.toLowerCase()));
      return sim ? sim.current / (sim.max / 2) : 1;
    };

    switch (type) {
      case 'MetricCard':
        return {
          value: Math.floor(Math.random() * 50000),
          trend: 12.5,
          suffix: ctx.includes('revenue') ? '$' : '',
          sparkline: Array.from({ length: 10 }, () => ({ value: Math.random() * 100 })),
          confidence: 94
        };
      case 'LineChart':
      case 'AreaChart':
        return Array.from({ length: 12 }, (_, i) => ({ name: `M${i+1}`, value: Math.random() * 1000 }));
      case 'BarChart':
        return ['A', 'B', 'C'].map(n => ({ name: n, value: Math.random() * 500 }));
      case 'DataTable':
        return Array.from({ length: 10 }, (_, i) => ({ id: i, item: `Sample ${i}`, value: Math.random() * 100 }));
      case 'PredictiveMonitor':
        const history = Array.from({ length: 10 }, (_, i) => ({ name: `Day ${i + 1}`, value: 1000 + Math.random() * 200 }));
        const lastVal = history[history.length - 1].value;
        const forecast = Array.from({ length: 5 }, (_, i) => ({ name: `Day ${i + 11}`, value: lastVal + (i + 1) * (50 + Math.random() * 50) }));
        return {
          metric: "Operational Revenue",
          currentValue: lastVal,
          predictedValue: forecast[forecast.length - 1].value,
          confidence: 88,
          history,
          forecast,
          riskLevel: Math.random() > 0.7 ? 'medium' : 'low'
        };
      case 'LineageGraph':
        return {
          nodes: [
            { id: 's1', label: 'Postgres Production', type: 'source', status: 'success', metadata: 'LATENCY: 0.1ms' },
            { id: 's2', label: 'S3 Raw Storage', type: 'source', status: 'success', metadata: 'SIZE: 1.2TB' },
            { id: 'p1', label: 'Gemini Logic Layer', type: 'process', status: 'success', metadata: 'TOKENS: 4k' },
            { id: 'p2', label: 'Anomaly Detector', type: 'process', status: 'warning', metadata: 'RECALL: 92%' },
            { id: 'o1', label: 'Main Dashboard', type: 'output', status: 'success', metadata: 'FPS: 60' }
          ],
          edges: [
            { from: 's1', to: 'p1' },
            { from: 's2', to: 'p1' },
            { from: 'p1', to: 'p2' },
            { from: 'p2', to: 'o1' }
          ]
        };
      default: return [];
    }
  }

  private static processRealData(type: ComponentType, data: any[], props: any): any {
    const fields = props?.requiredFields || [];
    const metricField = fields.find((f: string) => !isNaN(data[0]?.[f]));
    const dimensionField = fields.find((f: string) => typeof data[0]?.[f] === 'string') || Object.keys(data[0])[0];

    switch (type) {
      case 'MetricCard':
        const sum = data.reduce((acc, row) => acc + (parseFloat(row[metricField]) || 0), 0);
        return {
          value: sum,
          trend: 0,
          sparkline: data.slice(0, 10).map(row => ({ value: row[metricField] || 0 }))
        };
      case 'DataTable':
        return data.slice(0, 50); 
      case 'BarChart':
      case 'PieChart':
        const groups: Record<string, number> = {};
        data.forEach(row => {
          const key = row[dimensionField] || 'Other';
          groups[key] = (groups[key] || 0) + (parseFloat(row[metricField]) || 1);
        });
        return Object.entries(groups).map(([name, value]) => ({ name, value })).slice(0, 10);
      case 'LineChart':
      case 'AreaChart':
        return data.slice(0, 15).map((row, i) => ({
          name: row[dimensionField] || `Pt ${i}`,
          value: parseFloat(row[metricField]) || 0
        }));
      case 'PredictiveMonitor':
        const realHistory = data.slice(0, 10).map((row, i) => ({ name: row[dimensionField] || `D${i}`, value: parseFloat(row[metricField]) || 0 }));
        const realLastVal = realHistory[realHistory.length - 1]?.value || 0;
        const realForecast = Array.from({ length: 5 }, (_, i) => ({ name: `F${i + 1}`, value: realLastVal * (1 + (i + 1) * 0.05) }));
        return {
          metric: metricField || "Metric",
          currentValue: realLastVal,
          predictedValue: realForecast[realForecast.length - 1].value,
          confidence: 91,
          history: realHistory,
          forecast: realForecast,
          riskLevel: 'low'
        };
      case 'LineageGraph':
        return {
          nodes: [
            { id: 's1', label: 'Uploaded File', type: 'source', status: 'success', metadata: `SIZE: ${data.length} Rows` },
            { id: 'p1', label: 'Schema Inferrer', type: 'process', status: 'success', metadata: 'TYPE: Dynamic' },
            { id: 'p2', label: 'Data Aggregator', type: 'process', status: 'success', metadata: 'ENGINE: In-Browser' },
            { id: 'o1', label: 'Visual Output', type: 'output', status: 'success', metadata: 'STATE: Ready' }
          ],
          edges: [
            { from: 's1', to: 'p1' },
            { from: 'p1', to: 'p2' },
            { from: 'p2', to: 'o1' }
          ]
        };
      default:
        return data.slice(0, 10);
    }
  }
}
