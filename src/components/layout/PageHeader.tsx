"use client";

import React from 'react';
import { Breadcrumb } from './Breadcrumb';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-4 mb-3">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {actions}
      </div>
      {description && <p className="text-white/70 mb-3">{description}</p>}
      <Breadcrumb />
    </div>
  );
};

export {};
