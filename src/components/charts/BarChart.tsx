"use client";

import React from 'react';
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface BarSeries {
  key: string;
  name: string;
  color?: string;
}

interface BarChartProps {
  data: Array<Record<string, any>>;
  xKey: string;
  series: BarSeries[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  stacked?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  xKey,
  series,
  height = 280,
  showGrid = true,
  showLegend = true,
  stacked = false,
}) => {
  return (
    <div className="surface p-4">
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <ReBarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            {showLegend && <Legend />}
            {series.map((s, idx) => (
              <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color || '#1e293b'} stackId={stacked ? 'stack' : undefined} />
            ))}
          </ReBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
