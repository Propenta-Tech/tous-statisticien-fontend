"use client";

import React from 'react';
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface LineSeries {
  key: string;
  name: string;
  color?: string;
}

interface LineChartProps {
  data: Array<Record<string, any>>;
  xKey: string;
  series: LineSeries[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  xKey,
  series,
  height = 280,
  showGrid = true,
  showLegend = true,
}) => {
  return (
    <div className="surface p-4">
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <ReLineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            {showLegend && <Legend />}
            {series.map((s) => (
              <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color || '#fbbf24'} strokeWidth={2} dot={false} />
            ))}
          </ReLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
