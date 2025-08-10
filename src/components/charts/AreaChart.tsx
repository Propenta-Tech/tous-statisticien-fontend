"use client";

import React from 'react';
import {
  AreaChart as ReAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface AreaSeries {
  key: string;
  name: string;
  color?: string;
}

interface AreaChartProps {
  data: Array<Record<string, any>>;
  xKey: string;
  series: AreaSeries[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
}

export const AreaChart: React.FC<AreaChartProps> = ({
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
          <ReAreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            {showLegend && <Legend />}
            {series.map((s) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color || '#fbbf24'}
                fill={s.color || '#fbbf24'}
                fillOpacity={0.2}
                strokeWidth={2}
                activeDot={{ r: 4 }}
              />
            ))}
          </ReAreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
