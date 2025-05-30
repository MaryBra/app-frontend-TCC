"use client";

import { useSearchParams } from "next/navigation";

export default function TelaPerfil() {
  const searchParams = useSearchParams();
  const tagsParam = searchParams.get("tags");

  const tags = tagsParam ? tagsParam.split(",") : [];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h1 className="text-4xl md:text-6xl font-bold text-[#990000] mb-6">
        Tela de Perfil
      </h1>
      <p className="text-xl text-center max-w-2xl mb-8">
        Bem-vindo! Aqui estão as tags que você selecionou:
      </p>

      <ul className="list-disc">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <li key={tag} className="text-lg">
              {tag}
            </li>
          ))
        ) : (
          <p className="text-lg">Nenhuma tag selecionada.</p>
        )}
      </ul>
    </div>
  );
}
