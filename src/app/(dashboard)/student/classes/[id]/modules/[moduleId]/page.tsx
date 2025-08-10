import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import { LectureCard } from '@/components/specialized/LectureCard';

export default function StudentModulePage() {
  const lectures = [
    { id: 1, title: 'Qu’est-ce qu’une variable ?', type: 'VIDEO' as const, duration: '12:35' },
    { id: 2, title: 'PDF du cours', type: 'PDF' as const, size: '1.2MB' },
    { id: 3, title: 'Audio de révision', type: 'AUDIO' as const, duration: '08:10' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Module" description="Leçons et ressources" />

      <Section variant="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lectures.map((l) => (
            <LectureCard key={l.id} {...l} />
          ))}
        </div>
      </Section>
    </div>
  );
}
