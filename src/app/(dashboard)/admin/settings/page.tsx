import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Paramètres" description="Configurez la plateforme et les préférences" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section title="Général" variant="card">
          <div className="space-y-3 text-sm text-gray-700">
            <div>Nom de la plateforme: <strong>Tous Statisticien</strong></div>
            <div>Mode sombre: <strong>activable</strong></div>
          </div>
        </Section>
        <Section title="Notifications" variant="card">
          <div className="space-y-3 text-sm text-gray-700">
            <div>Emails automatiques: <strong>activés</strong></div>
            <div>Rappels d'évaluations: <strong>activés</strong></div>
          </div>
        </Section>
      </div>
    </div>
  );
}
