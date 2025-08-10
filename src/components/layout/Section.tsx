"use client";

import React from 'react';

interface SectionProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  dense?: boolean;
  variant?: 'default' | 'card' | 'ghost' | 'glass';
}

export const Section: React.FC<SectionProps> = ({
  title,
  description,
  actions,
  children,
  className,
  dense = false,
  variant = 'default',
}) => {
  const containerClass =
    variant === 'card'
      ? 'card'
      : variant === 'glass'
      ? 'glass rounded-xl border border-white/20'
      : variant === 'ghost'
      ? ''
      : 'bg-white rounded-xl shadow-soft border border-gray-200';

  return (
    <section className={`${containerClass} ${dense ? 'p-4' : 'p-6'} ${className || ''}`}>
      {(title || description || actions) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="text-lg font-semibold text-primary-navy">{title}</h2>}
            {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      <div>{children}</div>
    </section>
  );
};

