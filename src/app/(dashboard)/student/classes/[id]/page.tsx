import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import { ModuleCard } from '@/components/specialized/ModuleCard';

export default function StudentClassDetailPage() {
  const modules = [
    { id: 1, title: 'Introduction', order: 1, lecturesCount: 5, evaluationsCount: 1 },
    { id: 2, title: 'Probabilités', order: 2, lecturesCount: 6, evaluationsCount: 2 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Classe" description="Parcourez les modules de cette classe" />

      <Section variant="card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m) => (
            <ModuleCard key={m.id} {...m} />
          ))}
        </div>
      </Section>
    </div>
  );
}
