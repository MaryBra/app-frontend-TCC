import { Suspense } from 'react';
import EditProfileForm from './EditProfileForm';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function EditProfilePage() {
  return (
    <div>
      <Suspense fallback={
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <LoadingSpinner></LoadingSpinner>
          </div>
        </main>
        }>
        <EditProfileForm />
      </Suspense>
    </div>
  );
}