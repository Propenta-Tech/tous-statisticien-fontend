"use client"
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressItem {
  label: string;
  value: number;
  maxValue: number;
  color?: string;
  description?: string;
  icon?: React.ReactNode;
}

interface ProgressChartProps {
  data: ProgressItem[];
  title?: string;
  description?: string;
  height?: number;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  showPercentages?: boolean;
  showValues?: boolean;
  animate?: boolean;
  size?: 'sm' | 'md' | 'lg';
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

export const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  title,
  description,
  height,
  className,
  emptyMessage = "Aucune donnée disponible",
  loading = false,
  showPercentages = true,
  showValues = true,
  animate = true,
  size = 'md',
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  const sizeClasses = {
    sm: {
      container: 'space-y-3',
      progress: 'h-2',
      label: 'text-sm',
      value: 'text-xs',
    },
    md: {
      container: 'space-y-4',
      progress: 'h-3',
      label: 'text-base',
      value: 'text-sm',
    },
    lg: {
      container: 'space-y-5',
      progress: 'h-4',
      label: 'text-lg',
      value: 'text-base',
    },
  };

  const getProgressColor = (percentage: number, customColor?: string) => {
    if (customColor) return customColor;
    
    if (percentage >= 80) return '#10b981'; // emerald-500
    if (percentage >= 60) return '#fbbf24'; // amber-400
    if (percentage >= 40) return '#f97316'; // orange-500
    return '#ef4444'; // red-500
  };

  return (
    <div className={cn("w-full", className)}>
      {(title || description) && (
        <div className="mb-6">
          {title && <h3 className="text-lg font-semibold text-primary-navy mb-2">{title}</h3>}
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </div>
      )}
      
      <div className={sizeClasses[size].container}>
        {data.map((item, index) => {
          const percentage = item.maxValue > 0 ? (item.value / item.maxValue) * 100 : 0;
          const color = getProgressColor(percentage, item.color);
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.icon && <span className="text-gray-500">{item.icon}</span>}
                  <span className={cn("font-medium text-gray-700", sizeClasses[size].label)}>
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {showValues && (
                    <span className={cn("text-gray-600", sizeClasses[size].value)}>
                      {item.value} / {item.maxValue}
                    </span>
                  )}
                  {showPercentages && (
                    <span className={cn("font-semibold", sizeClasses[size].value)} style={{ color }}>
                      {percentage.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
              
              <div className="relative">
                <div className={cn(
                  "w-full bg-gray-200 rounded-full overflow-hidden",
                  sizeClasses[size].progress
                )}>
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-1000 ease-out",
                      animate ? "animate-pulse" : ""
                    )}
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
              
              {item.description && (
                <p className="text-xs text-gray-500">{item.description}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
