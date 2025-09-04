import { Suspense } from 'react';
import ProfileScreen from './ProfileScreen';

export default function TelaPerfil() {
  return (
    <div>
      <Suspense fallback={<p>Carregando...</p>}>
        <ProfileScreen />
      </Suspense>
    </div>
  );
}
