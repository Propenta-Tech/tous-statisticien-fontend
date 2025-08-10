"use client";

import React from 'react';

interface NotificationPanelProps {
  count?: number;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ count = 3 }) => {
  return (
    <div className="surface p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-primary-navy">Notifications</h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">{count}</span>
      </div>
      <p className="text-xs text-gray-500 mt-2">Vous avez {count} notifications non lues</p>
    </div>
  );
};

