import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import Table from '@/components/ui/Table';
import { Eye } from 'lucide-react';

export default function StudentEvaluationsPage() {
  const columns = [
    { key: 'title', title: 'Titre', sortable: true },
    { key: 'type', title: 'Type', sortable: true },
    { key: 'deadline', title: 'Date limite', sortable: true },
    { key: 'status', title: 'Statut', sortable: true },
  ];

  const data = [
    { id: 1, title: 'Quiz 1', type: 'QUIZ', deadline: new Date(), status: 'active' },
    { id: 2, title: 'Projet A', type: 'PROJECT', deadline: new Date(), status: 'upcoming' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Évaluations" description="Vos évaluations en cours et à venir" />

      <Section variant="card">
        <Table columns={columns as any} data={data as any} />
      </Section>
    </div>
  );
}
