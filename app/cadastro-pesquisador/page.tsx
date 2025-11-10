import { Suspense } from 'react';
import ResearcherRegistration from './ResearcherRegistration';

export default function Home() {
  return (
      <div>
        <Suspense fallback={<p>Carregando...</p>}>
          <ResearcherRegistration />
        </Suspense>
      </div>
    );
}
