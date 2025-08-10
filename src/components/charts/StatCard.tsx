"use client";

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: number; // positive/negative percentage
  hint?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, delta, hint, icon, className }) => {
  const isPositive = typeof delta === 'number' ? delta >= 0 : undefined;
  return (
    <div className={`surface p-4 sm:p-5 ${className || ''}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
          <div className="mt-1 text-2xl font-bold text-primary-navy">{value}</div>
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 grid place-items-center shadow-glow">
            {icon}
          </div>
        )}
      </div>
      {(delta !== undefined || hint) && (
        <div className="mt-3 flex items-center justify-between">
          {delta !== undefined && (
            <div className={`inline-flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {Math.abs(delta)}%
            </div>
          )}
          {hint && <div className="text-xs text-gray-500">{hint}</div>}
        </div>
      )}
    </div>
  );
};

