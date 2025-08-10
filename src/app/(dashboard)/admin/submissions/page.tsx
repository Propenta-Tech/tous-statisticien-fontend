import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import Table from '@/components/ui/Table';
import { Eye, Edit, Trash2 } from 'lucide-react';

export default function AdminSubmissionsPage() {
  const columns = [
    { key: 'student', title: 'Étudiant', sortable: true },
    { key: 'evaluation', title: 'Évaluation', sortable: true },
    { key: 'score', title: 'Note', sortable: true, align: 'right' },
    { key: 'submittedAt', title: 'Soumise le', sortable: true },
    { key: 'status', title: 'Statut', sortable: true },
  ];

  const data = [
    { id: 1, student: 'Awa Diop', evaluation: 'Quiz 1', score: 18, submittedAt: new Date(), status: true },
    { id: 2, student: 'Moussa Traoré', evaluation: 'Projet A', score: 14, submittedAt: new Date(), status: false },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Soumissions" description="Corrigez et gérez les soumissions" />

      <Section variant="card">
        <Table
          columns={columns as any}
          data={data as any}
          searchable
          exportable
          actions={[
            { label: 'Voir', icon: Eye, onClick: (ids: (string|number)[]) => console.log('Voir', ids) },
            { label: 'Éditer', icon: Edit, onClick: (ids: (string|number)[]) => console.log('Éditer', ids) },
            { label: 'Supprimer', icon: Trash2, onClick: (ids: (string|number)[]) => console.log('Supprimer', ids), variant: 'danger' as any },
          ]}
        />
      </Section>
    </div>
  );
}
