import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import Table from '@/components/ui/Table';
import { Eye, Edit, Trash2 } from 'lucide-react';

export default function AdminLecturesPage() {
  const columns = [
    { key: 'title', title: 'Leçon', sortable: true },
    { key: 'module', title: 'Module', sortable: true },
    { key: 'duration', title: 'Durée', sortable: true },
    { key: 'published', title: 'Publiée', sortable: true },
    { key: 'updatedAt', title: 'Mis à jour', sortable: true },
  ];

  const data = [
    { id: 1, title: 'Intro aux variables', module: 'Bases de R', duration: '12:35', published: true, updatedAt: new Date() },
    { id: 2, title: 'Boucles et conditions', module: 'Python pour data', duration: '18:20', published: false, updatedAt: new Date() },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Leçons" description="Gérez les contenus vidéo et documents" />

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
