import { Suspense } from 'react';
import VerifyEmail from './VerifyEmail';

export default function Home() {
  return (
      <div>
        <Suspense fallback={<p>Carregando...</p>}>
          <VerifyEmail/>
        </Suspense>
      </div>
    );
}




