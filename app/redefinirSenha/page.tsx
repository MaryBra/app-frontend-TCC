import { Suspense } from 'react';
import ResetPassword from './ResetPassword';

export default function Home() {
  return (
      <div>
        <Suspense fallback={<p>Carregando...</p>}>
          <ResetPassword />
        </Suspense>
      </div>
    );
}
