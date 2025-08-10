"use client"
import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  href?: string;
}

const colorClasses = {
  primary: {
    bg: 'bg-primary-navy',
    text: 'text-white',
    icon: 'text-primary-navy',
    iconBg: 'bg-primary-navy/10',
  },
  success: {
    bg: 'bg-emerald-500',
    text: 'text-white',
    icon: 'text-emerald-500',
    iconBg: 'bg-emerald-500/10',
  },
  warning: {
    bg: 'bg-amber-400',
    text: 'text-white',
    icon: 'text-amber-400',
    iconBg: 'bg-amber-400/10',
  },
  danger: {
    bg: 'bg-red-500',
    text: 'text-white',
    icon: 'text-red-500',
    iconBg: 'bg-red-500/10',
  },
  info: {
    bg: 'bg-cyan-500',
    text: 'text-white',
    icon: 'text-cyan-500',
    iconBg: 'bg-cyan-500/10',
  },
};

const sizeClasses = {
  sm: {
    container: 'p-4',
    title: 'text-sm',
    value: 'text-xl',
    description: 'text-xs',
    icon: 'w-8 h-8',
  },
  md: {
    container: 'p-6',
    title: 'text-base',
    value: 'text-2xl',
    description: 'text-sm',
    icon: 'w-10 h-10',
  },
  lg: {
    container: 'p-8',
    title: 'text-lg',
    value: 'text-3xl',
    description: 'text-base',
    icon: 'w-12 h-12',
  },
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  color = 'primary',
  size = 'md',
  loading = false,
  className,
  onClick,
  href,
}) => {
  const colors = colorClasses[color];
  const sizes = sizeClasses[size];

  if (loading) {
    return (
      <div className={cn(
        "bg-white rounded-xl shadow-soft border border-gray-200",
        sizes.container,
        className
      )}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className={cn("rounded-full bg-gray-200", sizes.icon)}></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  const formatTrendValue = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue >= 1) {
      return `${value > 0 ? '+' : ''}${value.toFixed(1)}`;
    }
    return `${value > 0 ? '+' : ''}${(value * 100).toFixed(1)}%`;
  };

  const getTrendIcon = (isPositive: boolean) => {
    if (isPositive) {
      return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    }
    return <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  const CardContent = () => (
    <div className={cn(
      "bg-white rounded-xl shadow-soft border border-gray-200 transition-all duration-200",
      sizes.container,
      (onClick || href) && "cursor-pointer hover:shadow-lg hover:scale-105",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={cn("font-medium text-gray-600", sizes.title)}>
          {title}
        </h3>
        {icon && (
          <div className={cn(
            "flex items-center justify-center rounded-lg",
            colors.iconBg,
            sizes.icon
          )}>
            <div className={cn("flex items-center justify-center", colors.icon)}>
              {icon}
            </div>
          </div>
        )}
      </div>

      <div className="mb-2">
        <p className={cn("font-bold text-primary-navy", sizes.value)}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>

      {description && (
        <p className={cn("text-gray-500 mb-3", sizes.description)}>
          {description}
        </p>
      )}

      {trend && (
        <div className="flex items-center gap-2">
          {getTrendIcon(trend.isPositive)}
          <span className={cn(
            "font-medium",
            sizes.description,
            trend.isPositive ? "text-emerald-600" : "text-red-600"
          )}>
            {formatTrendValue(trend.value)}
          </span>
          <span className={cn("text-gray-500", sizes.description)}>
            {trend.period}
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        <CardContent />
      </a>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className="block w-full text-left">
        <CardContent />
      </button>
    );
  }

  return <CardContent />;
};
