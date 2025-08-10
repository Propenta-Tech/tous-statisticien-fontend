import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import Table from '@/components/ui/Table';
import { Eye, Edit, Trash2 } from 'lucide-react';

export default function AdminUsersPage() {
  const columns = [
    { key: 'name', title: 'Nom', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    { key: 'role', title: 'Rôle', sortable: true },
    { key: 'status', title: 'Statut', sortable: true },
    { key: 'createdAt', title: 'Créé le', sortable: true },
  ];

  const data = [
    { id: 1, name: 'Awa Diop', email: 'awa@example.com', role: 'ADMIN', status: true, createdAt: new Date() },
    { id: 2, name: 'Moussa Traoré', email: 'moussa@example.com', role: 'FORMATEUR', status: true, createdAt: new Date() },
    { id: 3, name: 'Fatou Ndiaye', email: 'fatou@example.com', role: 'STUDENT', status: false, createdAt: new Date() },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Utilisateurs" description="Gérez les comptes et permissions" />

      <Section variant="card">
        <Table
          columns={columns as any}
          data={data as any}
          exportable
          actions={[
            { key: 'view', label: 'Voir', icon: Eye, onClick: (ids: (string|number)[]) => console.log('Voir', ids) },
            { key: 'edit', label: 'Éditer', icon: Edit, onClick: (ids: (string|number)[]) => console.log('Éditer', ids) },
            { key: 'delete', label: 'Supprimer', icon: Trash2, onClick: (ids: (string|number)[]) => console.log('Supprimer', ids) },
          ]}
        />
      </Section>
    </div>
  );
}
