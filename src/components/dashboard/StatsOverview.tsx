"use client";

import React from 'react';
import { StatCard } from '@/components/charts/StatCard';
import { Users, GraduationCap, PlayCircle, CircleDollarSign } from 'lucide-react';

interface StatsOverviewProps {
  stats?: {
    users: number;
    classes: number;
    lectures: number;
    revenue: string;
  };
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  stats = { users: 1240, classes: 48, lectures: 362, revenue: '12.4M CFA' },
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Utilisateurs" value={stats.users} delta={8.4} hint="vs mois dernier" icon={<Users className="w-5 h-5" />} />
      <StatCard label="Classes" value={stats.classes} delta={2.1} hint="actives" icon={<GraduationCap className="w-5 h-5" />} />
      <StatCard label="Leçons" value={stats.lectures} delta={-1.2} hint="publiées" icon={<PlayCircle className="w-5 h-5" />} />
      <StatCard label="Revenus" value={stats.revenue} delta={5.7} hint="30 derniers jours" icon={<CircleDollarSign className="w-5 h-5" />} />
    </div>
  );
};

