"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SelecionandoTags() {
  const router = useRouter();

  const [tagsSelecionadas, setTagsSelecionadas] = useState([]);

  const tagsDisponiveis = [
    "Inteligência Artificial",
    "Desenvolvimento Web",
    "Banco de Dados",
    "Análise de Dados",
    "Redes de Computadores",
    "Segurança da Informação",
  ];

  const handleCheckboxChange = (tag) => {
    if (tagsSelecionadas.includes(tag)) {
      setTagsSelecionadas(tagsSelecionadas.filter((t) => t !== tag));
    } else {
      setTagsSelecionadas([...tagsSelecionadas, tag]);
    }
  };

const handleContinuar = () => {
    const tagsQuery = tagsSelecionadas.join(",");
    router.push(`/telaPerfil?tags=${encodeURIComponent(tagsQuery)}`);
};

  

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h1 className="text-3xl md:text-5xl font-bold text-[#990000] mb-6">
        Selecione suas Tags
      </h1>

      <div className="flex flex-col gap-4 mb-8">
        {tagsDisponiveis.map((tag) => (
          <label key={tag} className="flex items-center gap-2">
            <input
              type="checkbox"
              value={tag}
              checked={tagsSelecionadas.includes(tag)}
              onChange={() => handleCheckboxChange(tag)}
              className="w-5 h-5 accent-[#990000]"
            />
            <span className="text-lg">{tag}</span>
          </label>
        ))}
      </div>

      <button
        onClick={handleContinuar}
        className="bg-[#990000] text-white px-8 py-3 rounded hover:bg-[#b30000] transition"
      >
        Continuar
      </button>
    </div>
  );
}
