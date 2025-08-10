import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';

export default function StudentEvaluationDetailPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Détail de l'évaluation" description="Consultez les consignes et la date limite" />
      <Section variant="card">
        <div className="prose max-w-none">
          <p>Consignes de l'évaluation, durée, ressources autorisées et critères d'évaluation.</p>
        </div>
      </Section>
    </div>
  );
}
