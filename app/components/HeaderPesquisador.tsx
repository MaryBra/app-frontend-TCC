import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookmarkPlus, Heart, Pencil } from "lucide-react";

interface HeaderPesquisadorProps {
  nomePesquisador: string;
  sobrenome: string;
  ocupacao?: string | null;
  imagemPerfil: string | null;
  tags: string[];
  dataAtualizacao: string;
  horaAtualizacao: string;
  podeEditar: boolean;
  idPesquisador: number;
  onClickContato: () => void;
}

export function HeaderPesquisador({
  nomePesquisador,
  sobrenome,
  ocupacao,
  tags,
  dataAtualizacao,
  podeEditar,
  idPesquisador,
  onClickContato,
}: HeaderPesquisadorProps) {
  const [imagemPerfil, setImagemPerfil] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function carregarImagem() {
      try {
        const res = await fetch(
          `http://localhost:8080/api/pesquisadores/${idPesquisador}/imagem`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Erro ao buscar imagem");
        }

        const blob = await res.blob();
        const urlImagem = URL.createObjectURL(blob);
        setImagemPerfil(urlImagem);
      } catch (error) {
        console.error("Erro ao carregar imagem", error);
      }
    }

    carregarImagem();
  }, [idPesquisador]);

  return (
    <div className="bg-[#990000] text-white py-6 px-10 relative shadow-lg">
      {/* Botão de Edição */}

      {podeEditar ? (
        <Link
          href={`/telaEdicaoPesquisador`}
          className="absolute top-8 right-8 bg-white text-[#990000] p-2 rounded-full shadow hover:bg-gray-100 transition"
        >
          <Pencil size={30} />
        </Link>
      ) : (
        <div className="absolute top-8 right-8 flex gap-3">
          {/* Coração */}
          <button
            className="
        bg-white text-[#990000] p-2 rounded-full shadow
        hover:bg-gray-100 transition
      "
            title="Favoritar"
          >
            <Heart size={30} />
          </button>

          {/* Fitinha com + */}
          <button
            className="
        bg-white text-[#990000] p-2 rounded-full shadow
        hover:bg-gray-100 transition
      "
            title="Adicionar à lista"
          >
            <BookmarkPlus size={30} />
          </button>
        </div>
      )}

      {/* Container Responsivo */}
      <div className="flex flex-col lg:flex-row gap-8 lg:items-start items-center text-center lg:text-left">
        {/* Foto */}
        <div className="w-[220px] h-[220px] md:w-[260px] md:h-[260px] lg:w-[320px] lg:h-[320px] rounded-2xl overflow-hidden">
          <Image
            src={imagemPerfil || "/images/user.png"}
            alt="Foto do usuário"
            width={360}
            height={360}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Texto + botões fixos ao rodapé */}
        <div className="flex-1 flex flex-col min-h-[300px]">
          {/* Nome */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-1">
            {nomePesquisador} {sobrenome}
          </h1>

          {/* Cargo (com placeholder) */}
          <h2 className="text-xl md:text-2xl mt-0 mb-4 min-h-[28px] md:min-h-[32px]">
            {ocupacao?.trim() ? ocupacao : " "}
          </h2>

          {/* Tags */}
          <div className="flex flex-wrap gap-3 mb-4 justify-center lg:justify-start">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="bg-white text-black px-4 py-2 rounded-full text-sm shadow"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* ==== Botões fixados no rodapé do bloco ==== */}
          <div className="mt-auto flex gap-3 pt-4 justify-center lg:justify-start">
            <button
              onClick={onClickContato}
              className="
                px-6 py-2 rounded shadow 
                border border-white 
                text-white 
                bg-transparent
                hover:bg-white 
                hover:text-[#990000] 
                transition
              "
            >
              Contato
            </button>

            <Link
              href="/gerenciarListas"
              className="border border-white text-white px-4 py-1 rounded hover:bg-white hover:text-[#990000] transition flex items-center justify-center"
            >
              Gerenciar Listas
            </Link>
          </div>
        </div>
      </div>

      {/* Última atualização */}
      <p className="absolute right-10 bottom-4 text-sm text-white/90">
        Última atualização em {dataAtualizacao}
      </p>
    </div>
  );
}
