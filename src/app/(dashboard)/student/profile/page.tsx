import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import { ProfileForm } from '@/components/forms/ProfileForm';

export default function StudentProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Mon profil" description="Mettez à jour vos informations personnelles" />
      <Section variant="card">
        <ProfileForm />
      </Section>
    </div>
  );
}
