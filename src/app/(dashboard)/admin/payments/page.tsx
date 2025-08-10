import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import Table from '@/components/ui/Table';
import { Eye, Download } from 'lucide-react';

export default function AdminPaymentsPage() {
  const columns = [
    { key: 'reference', title: 'Référence', sortable: true },
    { key: 'user', title: 'Utilisateur', sortable: true },
    { key: 'amount', title: 'Montant', sortable: true, align: 'right' },
    { key: 'status', title: 'Statut', sortable: true },
    { key: 'date', title: 'Date', sortable: true },
  ];

  const data = [
    { id: 1, reference: 'PAY-2024-001', user: 'Awa Diop', amount: 50000, status: true, date: new Date() },
    { id: 2, reference: 'PAY-2024-002', user: 'Moussa Traoré', amount: 35000, status: true, date: new Date() },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Paiements" description="Suivez les transactions et exportez les rapports" />

      <Section variant="card">
        <Table
          columns={columns as any}
          data={data as any}
          exportable
          actions={[
            { key: 'details', label: 'Détails', icon: Eye, onClick: (ids: (string|number)[]) => console.log('Détails', ids) },
            { key: 'receipt', label: 'Reçu', icon: Download, onClick: (ids: (string|number)[]) => console.log('Reçu', ids) },
          ]}
        />
      </Section>
    </div>
  );
}
