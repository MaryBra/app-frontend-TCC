"use client";

import { useSearchParams } from "next/navigation";

export default function TelaPerfil() {
  const searchParams = useSearchParams();
  const tagsParam = searchParams.get("tags");

  const dados = [
    { ano: "2023", titulo: "Artigo Engenharia de dados" },
    { ano: "2024", titulo: "Artigo Infraestrutura de dados" },
    { ano: "2025", titulo: "Artigo Infraestrutura de dados" },
  ];

  const tags = tagsParam ? tagsParam.split(",") : [];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h1 className="text-4xl md:text-6xl font-bold text-[#990000] mb-6">
        Tela de Perfil
      </h1>
      <p className="text-xl text-center max-w-2xl mb-8">
        Bem-vindo! Aqui estão as tags que você selecionou:
      </p>

        <div className="w-[400px]">
          <h2 className="text-sm text-gray-700 mb-2">Linha do tempo - Destaques</h2>

            {/* Caixa com scroll */}
            <div className="relative border-l-2 border-gray-300 ml-4">
              {dados.map((item, idx) => (
                <div key={idx} className="mb-8 flex items-center">
                  <div className="absolute w-3 h-3 bg-red-700 rounded-full -left-1.5"></div>
                  
                  {/* Ano + Título */}
                  <div className="ml-6 flex items-center gap-2">
                    <p className="text-lg font-semibold text-black">{item.ano}</p>
                    <p className="text-sm text-gray-800">{item.titulo}</p>
                  </div>

                  {/* Botão */}
                  <button className="ml-auto bg-red-700 text-white text-sm px-4 py-1 rounded shadow hover:bg-red-800 transition">
                    Acessar
                  </button>
                </div>
              ))}
            </div>
        </div>

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
