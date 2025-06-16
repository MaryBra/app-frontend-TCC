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
}
