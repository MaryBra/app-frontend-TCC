import { Suspense } from 'react';
import CompanyRegistration from './CompanyRegistration';

export default function Inicio() {
  return (
        <div>
          <Suspense fallback={<p>Carregando...</p>}>
            <CompanyRegistration />
          </Suspense>
        </div>
      );
}
