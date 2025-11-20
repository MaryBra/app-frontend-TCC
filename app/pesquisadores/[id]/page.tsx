import { Suspense } from 'react';
import ProfileScreen from './ProfileScreen';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';

export default function TelaPerfil() {
  return (
    <div>
      <Suspense fallback={<LoadingSpinner/>}>
        <ProfileScreen/>
      </Suspense>
    </div>
  );
}
