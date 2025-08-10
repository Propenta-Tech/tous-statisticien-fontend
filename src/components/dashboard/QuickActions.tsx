"use client";

import React from 'react';
import Link from 'next/link';
import { Plus, Upload, FilePlus, FolderPlus } from 'lucide-react';

interface QuickActionsProps {
  role?: 'ADMIN' | 'FORMATEUR' | 'STUDENT';
}

export const QuickActions: React.FC<QuickActionsProps> = ({ role = 'ADMIN' }) => {
  const actions = role === 'STUDENT'
    ? [
        { href: '/dashboard/student/classes', label: 'Voir mes classes', icon: <FolderPlus className="w-4 h-4" /> },
        { href: '/dashboard/student/evaluations', label: 'Évaluations', icon: <FilePlus className="w-4 h-4" /> },
      ]
    : [
        { href: '/dashboard/admin/classes', label: 'Créer une classe', icon: <Plus className="w-4 h-4" /> },
        { href: '/dashboard/admin/modules', label: 'Nouveau module', icon: <FolderPlus className="w-4 h-4" /> },
        { href: '/dashboard/admin/lectures', label: 'Ajouter une leçon', icon: <FilePlus className="w-4 h-4" /> },
        { href: '/dashboard/admin/resources', label: 'Importer fichier', icon: <Upload className="w-4 h-4" /> },
      ];

  return (
    <div className="surface p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-primary-navy">Actions rapides</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {actions.map((a) => (
          <Link key={a.href} href={a.href} className="px-3 py-2 rounded-lg border border-gray-200 hover:border-amber-300 hover:bg-amber-50 text-sm font-medium flex items-center gap-2">
            {a.icon}
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

