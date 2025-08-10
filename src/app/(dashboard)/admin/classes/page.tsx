import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import Table from '@/components/ui/Table';
import { Eye, Edit, Trash2 } from 'lucide-react';

export default function AdminClassesPage() {
  const columns = [
    { key: 'name', title: 'Classe', sortable: true },
    { key: 'level', title: 'Niveau', sortable: true },
    { key: 'students', title: 'Étudiants', sortable: true, align: 'right' },
    { key: 'modules', title: 'Modules', sortable: true, align: 'right' },
    { key: 'createdAt', title: 'Créé le', sortable: true },
  ];

  const data = [
    { id: 1, name: 'Statistiques 101', level: 'Débutant', students: 120, modules: 8, createdAt: new Date() },
    { id: 2, name: 'Probabilités', level: 'Intermédiaire', students: 85, modules: 6, createdAt: new Date() },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Classes" description="Gérez les classes et les affectations" />

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
