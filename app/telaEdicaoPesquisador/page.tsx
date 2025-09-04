import { Suspense } from 'react';
import EditProfileForm from './EditProfileForm';

export default function EditProfilePage() {
  return (
    <div>
      {/* Suspense mostra um fallback enquanto o componente dinâmico carrega */}
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Carregando editor...</div>}>
        <EditProfileForm />
      </Suspense>
    </div>
  );
}