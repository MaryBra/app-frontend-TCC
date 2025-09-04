import { Suspense } from 'react';
import CompanyEditForm from './CompanyEditForm';

export default function EditarPerfil() {
  return (
          <div>
            <Suspense fallback={<p>Carregando...</p>}>
              <CompanyEditForm />
            </Suspense>
          </div>
        );
}
