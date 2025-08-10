import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import { ClassCard } from '@/components/specialized/ClassCard';

export default function StudentClassesPage() {
  const classes = [
    { id: 1, name: 'Statistiques 101', level: 'Débutant', modulesCount: 8, studentsCount: 120 },
    { id: 2, name: 'Probabilités', level: 'Intermédiaire', modulesCount: 6, studentsCount: 85 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Mes classes" description="Vos classes et parcours" />

      <Section variant="card">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((c) => (
            <ClassCard key={c.id} {...c} />
          ))}
        </div>
      </Section>
    </div>
  );
}
