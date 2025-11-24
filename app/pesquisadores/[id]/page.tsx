import { Suspense } from 'react';
import ProfileScreen from './ProfileScreen';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';

export default function TelaPerfil() {
  return (
    <div>
      <Suspense fallback={
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <LoadingSpinner></LoadingSpinner>
          </div>
        </main>
      }>
        <ProfileScreen/>
      </Suspense>
    </div>
  );
}
