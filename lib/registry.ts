
import { ComponentType } from '../types';

export interface RegisteredComponent {
  name: ComponentType;
  description: string;
  dataRequirements: string;
  defaultGridSize: { w: number; h: number };
}

export const ComponentRegistry: RegisteredComponent[] = [
  {
    name: 'MetricCard',
    description: 'Summarizes a single metric value, often with a trend indicator. Best for high-level KPIs.',
    dataRequirements: 'Single object with { value: number, trend: number, suffix: string }',
    defaultGridSize: { w: 3, h: 2 }
  },
  {
    name: 'LineChart',
    description: 'Displays trends over time. Best for continuous data series showing change.',
    dataRequirements: 'Array of objects with { name: string, value: number, secondary?: number }',
    defaultGridSize: { w: 6, h: 4 }
  },
  {
    name: 'BarChart',
    description: 'Presents categorical comparisons. Best for ranking or distribution across groups.',
    dataRequirements: 'Array of objects with { name: string, value: number }',
    defaultGridSize: { w: 6, h: 4 }
  },
  {
    name: 'PieChart',
    description: 'Shows part-to-whole relationships. Best for simple compositions (max 8 slices).',
    dataRequirements: 'Array of objects with { name: string, value: number }',
    defaultGridSize: { w: 4, h: 4 }
  },
  {
    name: 'AreaChart',
    description: 'Shows cumulative totals over time. Best for volume trends and stacked comparisons.',
    dataRequirements: 'Array of objects with { name: string, value: number, secondary?: number }',
    defaultGridSize: { w: 8, h: 4 }
  },
  {
    name: 'DataTable',
    description: 'Displays granular raw data. Best for detailed exploration and export.',
    dataRequirements: 'Array of flat objects.',
    defaultGridSize: { w: 12, h: 6 }
  },
  {
    name: 'FilterPanel',
    description: 'Allows interactive slicing and dicing of data by category.',
    dataRequirements: 'None (Self-contained for mock)',
    defaultGridSize: { w: 4, h: 4 }
  },
  {
    name: 'DateRangePicker',
    description: 'Allows temporal filtering of the entire dashboard.',
    dataRequirements: 'Object with { start: ISOString, end: ISOString }',
    defaultGridSize: { w: 4, h: 3 }
  }
];
