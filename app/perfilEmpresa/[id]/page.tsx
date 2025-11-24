import { Suspense } from 'react';
import CompanyProfile from './CompanyProfile';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';

export default function Empresa() {
  return (
    <div>
      <Suspense fallback={
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <LoadingSpinner></LoadingSpinner>
          </div>
        </main>
        }>
        <CompanyProfile />
      </Suspense>
    </div>
  );
}
