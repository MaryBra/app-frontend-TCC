import { Suspense } from 'react';
import TagsSelector from './TagsSelector';

export default function SelecionandoTagsPage() {
  return (
    <div>
      <Suspense fallback={<p>Carregando...</p>}>
        <TagsSelector />
      </Suspense>
    </div>
  );
}