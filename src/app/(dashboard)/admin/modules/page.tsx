import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import Table from '@/components/ui/Table';
import { Eye, Edit, Trash2 } from 'lucide-react';

export default function AdminModulesPage() {
  const columns = [
    { key: 'title', title: 'Module', sortable: true },
    { key: 'className', title: 'Classe', sortable: true },
    { key: 'lectures', title: 'Leçons', sortable: true, align: 'right' },
    { key: 'updatedAt', title: 'Mis à jour', sortable: true },
  ];

  const data = [
    { id: 1, title: 'Bases de R', className: 'Statistiques 101', lectures: 12, updatedAt: new Date() },
    { id: 2, title: 'Python pour data', className: 'Probabilités', lectures: 9, updatedAt: new Date() },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Modules" description="Organisez les modules par classes" />

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
