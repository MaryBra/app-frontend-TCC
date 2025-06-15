"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function SelecionandoTags() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tagsQuery = searchParams.get("tags");

  const [tagsSelecionadas, setTagsSelecionadas] = useState([]);
  const [novaTag, setNovaTag] = useState("");

  // Quando a página carregar, pega as tags da URL
  useEffect(() => {
    if (tagsQuery) {
      const tagsArray = tagsQuery.split(",").map((tag) => tag.trim());
      setTagsSelecionadas(tagsArray);
    }
  }, [tagsQuery]);

  // Adicionar nova tag manualmente
  const handleAddTag = () => {
    const tagFormatada = novaTag.trim();
    if (tagFormatada !== "" && !tagsSelecionadas.includes(tagFormatada)) {
      setTagsSelecionadas([...tagsSelecionadas, tagFormatada]);
      setNovaTag("");
    }
  };

  // Remover uma tag
  const handleRemoveTag = (tagParaRemover) => {
    setTagsSelecionadas(tagsSelecionadas.filter((tag) => tag !== tagParaRemover));
  };

  // Quando clicar em Continuar: enviar as tags via query string para a próxima tela
  const handleContinuar = () => {
    const tagsString = encodeURIComponent(tagsSelecionadas.join(","));
    router.push(`/telaPerfil?tags=${tagsString}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#E9E9E9]">
      <h1 className="text-3xl font-bold mb-4">Escolha as tags que mais combinam com você!</h1>
      <h3 className="text-md text-center mb-6">
        Elas foram geradas automaticamente a partir das palavras-chave do seu currículo.
        Você pode adicionar ou remover como quiser.
      </h3>

      <div className="bg-white p-6 rounded-2xl w-full max-w-2xl">
        {/* Input para adicionar nova tag */}
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Adicionar nova tag"
            value={novaTag}
            onChange={(e) => setNovaTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
            className="flex-grow border rounded-l px-4 py-2"
          />
          <button
            onClick={handleAddTag}
            className="bg-[#990000] text-white px-4 rounded-r"
          >
            Adicionar
          </button>
        </div>

        {/* Exibir tags selecionadas */}
        <div className="flex flex-wrap gap-2">
          {tagsSelecionadas.map((tag, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-200 px-3 py-1 rounded-full"
            >
              <span>{tag}</span>
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-2 text-red-600 font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Botão para continuar */}
        <button
          onClick={handleContinuar}
          className="mt-6 bg-[#990000] text-white px-6 py-2 rounded"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
