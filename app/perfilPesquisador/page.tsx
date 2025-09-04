import { Suspense } from 'react';
import ResearcherProfile from './ResearcherProfile';

export default function Home() {
  return (
      <div>
        <Suspense fallback={<p>Carregando...</p>}>
          <ResearcherProfile />
        </Suspense>
      </div>
    );
}
