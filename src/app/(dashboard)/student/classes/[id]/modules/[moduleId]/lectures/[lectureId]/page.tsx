import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import { VideoPlayer } from '@/components/video/VideoPlayer';

export default function StudentLecturePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Lecture" description="Visionnez la vidéo et consultez les ressources" />
      <Section variant="card">
        <div className="aspect-video w-full bg-gray-100 grid place-items-center text-gray-500">
          <span>Lecteur vidéo (à intégrer)</span>
        </div>
      </Section>
    </div>
  );
}
