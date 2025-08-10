"use client"
import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { cn } from '@/lib/utils';

interface PieChartData {
  name: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  data: PieChartData[];
  title?: string;
  description?: string;
  height?: number;
  width?: number;
  radius?: number;
  colors?: string[];
  showLegend?: boolean;
  showTooltip?: boolean;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  startAngle?: number;
  endAngle?: number;
}

const defaultColors = [
  '#1e293b', // primary-navy
  '#fbbf24', // amber-400
  '#10b981', // emerald-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#06b6d4', // cyan-500
  '#f97316', // orange-500
  '#84cc16', // lime-500
];

export const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  description,
  height = 300,
  width,
  radius = 100,
  colors = defaultColors,
  showLegend = true,
  showTooltip = true,
  className,
  emptyMessage = "Aucune donnée disponible",
  loading = false,
  startAngle = 0,
  endAngle = 360,
}) => {
  if (loading) {
    return (
      <div className={cn("flex items-center justify-center", className)} style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-navy mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={cn("flex items-center justify-center", className)} style={{ height }}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const chartData = data.map((item, index) => ({
    ...item,
    color: item.color || colors[index % colors.length],
    percentage: total > 0 ? ((item.value / total) * 100).toFixed(1) : '0',
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-primary-navy">{data.name}</p>
          <p className="text-sm text-gray-600">
            Valeur: <span className="font-medium">{data.value}</span>
          </p>
          <p className="text-sm text-gray-600">
            Pourcentage: <span className="font-medium">{data.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    if (!showLegend || !payload) return null;
    
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-700">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={cn("w-full", className)}>
      {(title || description) && (
        <div className="mb-4 text-center">
          {title && <h3 className="text-lg font-semibold text-primary-navy mb-1">{title}</h3>}
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </div>
      )}
      
      <ResponsiveContainer width={width || "100%"} height={height}>
        <RechartsPieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            radius={radius}
            startAngle={startAngle}
            endAngle={endAngle}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          {showLegend && <Legend content={<CustomLegend />} />}
        </RechartsPieChart>
      </ResponsiveContainer>
      
      {!showLegend && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Total: <span className="font-semibold text-primary-navy">{total}</span>
          </p>
        </div>
      )}
    </div>
  );
};
