import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import Table from '@/components/ui/Table';
import { Eye, Edit, Trash2 } from 'lucide-react';

export default function AdminResourcesPage() {
  const columns = [
    { key: 'name', title: 'Ressource', sortable: true },
    { key: 'type', title: 'Type', sortable: true },
    { key: 'size', title: 'Taille', sortable: true },
    { key: 'uploadedAt', title: 'Importé le', sortable: true },
  ];

  const data = [
    { id: 1, name: 'dataset.csv', type: 'CSV', size: '2.4MB', uploadedAt: new Date() },
    { id: 2, name: 'intro.pdf', type: 'PDF', size: '1.1MB', uploadedAt: new Date() },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Ressources" description="Gérez les documents et médias" />

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
