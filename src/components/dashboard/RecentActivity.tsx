"use client";

import React from 'react';

interface ActivityItem {
  id: string;
  title: string;
  meta: string;
}

interface RecentActivityProps {
  items?: ActivityItem[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  items = [
    { id: '1', title: 'Nouvelle évaluation publiée', meta: 'il y a 2h' },
    { id: '2', title: '5 nouvelles soumissions', meta: 'il y a 4h' },
    { id: '3', title: '3 nouveaux étudiants inscrits', meta: 'hier' },
  ],
}) => {
  return (
    <div className="surface p-4 sm:p-5">
      <h3 className="text-sm font-semibold text-primary-navy mb-3">Activités récentes</h3>
      <ul className="space-y-3">
        {items.map((a) => (
          <li key={a.id} className="flex items-center justify-between">
            <div className="text-sm text-gray-700">{a.title}</div>
            <div className="text-xs text-gray-500">{a.meta}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

