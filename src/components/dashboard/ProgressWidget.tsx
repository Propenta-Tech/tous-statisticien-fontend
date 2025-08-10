"use client";

import React from 'react';

interface ProgressWidgetProps {
  title?: string;
  progress?: number; // 0..100
  description?: string;
}

export const ProgressWidget: React.FC<ProgressWidgetProps> = ({
  title = 'Progression globale',
  progress = 64,
  description = 'Moyenne d\'achèvement des cours',
}) => {
  return (
    <div className="surface p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-primary-navy">{title}</h3>
        <span className="text-sm font-medium text-amber-600">{progress}%</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100">
        <div className="h-2 rounded-full bg-amber-400 shadow-glow" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-3 text-xs text-gray-500">{description}</p>
    </div>
  );
};

