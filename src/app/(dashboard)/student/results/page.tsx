import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import Table from '@/components/ui/Table';

export default function StudentResultsPage() {
  const columns = [
    { key: 'title', title: 'Évaluation', sortable: true },
    { key: 'score', title: 'Note', sortable: true, align: 'right' },
    { key: 'max', title: 'Max', sortable: true, align: 'right' },
    { key: 'date', title: 'Date', sortable: true },
  ];

  const data = [
    { id: 1, title: 'Quiz 1', score: 18, max: 20, date: new Date() },
    { id: 2, title: 'Projet A', score: 16, max: 20, date: new Date() },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Mes résultats" description="Historique de vos notes" />
      <Section variant="card">
        <Table columns={columns as any} data={data as any} />
      </Section>
    </div>
  );
}
