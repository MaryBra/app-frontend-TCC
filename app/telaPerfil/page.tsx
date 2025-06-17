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
  
  // Modal para ver meios de contato
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      
      <button
        className="bg-[#990000] text-white px-6 py-2 rounded hover:bg-red-700"
        onClick={() => setAberto(true)}
      >
        Ver meios de contato
      </button>

      
      {aberto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
            <h2 className="text-2xl font-semibold mb-4 text-center">Meios de Contato</h2>

            <div className="space-y-2">
              <p><strong>Telefone:</strong> {telefone}</p>
              <p><strong>Email:</strong> {email}</p>
            </div>

            <button
              className="mt-6 w-full bg-[#990000] text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={() => setAberto(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
