import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import Table from '@/components/ui/Table';
import { Eye, Edit, Trash2 } from 'lucide-react';

export default function AdminEvaluationsPage() {
  const columns = [
    { key: 'title', title: 'Évaluation', sortable: true },
    { key: 'className', title: 'Classe', sortable: true },
    { key: 'attempts', title: 'Soumissions', sortable: true, align: 'right' },
    { key: 'status', title: 'Statut', sortable: true },
    { key: 'deadline', title: 'Date limite', sortable: true },
  ];

  const data = [
    { id: 1, title: 'Quiz 1', className: 'Statistiques 101', attempts: 56, status: true, deadline: new Date() },
    { id: 2, title: 'Projet A', className: 'Probabilités', attempts: 21, status: false, deadline: new Date() },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Évaluations" description="Créez et gérez les évaluations" />

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
