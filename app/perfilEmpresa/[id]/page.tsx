import { Suspense } from 'react';
import CompanyProfile from './CompanyProfile';

export default function Empresa() {
  return (
    <div>
      <Suspense fallback={<p>Carregando...</p>}>
        <CompanyProfile />
      </Suspense>
    </div>
  );
}
