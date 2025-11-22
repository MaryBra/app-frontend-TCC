"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookmarkPlus, Heart, Pencil, X, ListPlus } from "lucide-react";
import { useRouter } from "next/navigation";

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
  usuarioId: number;
  onClickContato: () => void;
}

interface ListaCustomizada {
    id: number;
    nomeLista: string;
}

export function HeaderPesquisador({
  nomePesquisador,
  sobrenome,
  ocupacao,
  tags,
  dataAtualizacao,
  podeEditar,
  idPesquisador,
  usuarioId,
  onClickContato,
}: HeaderPesquisadorProps) {
  const router = useRouter();
  const [imagemPerfil, setImagemPerfil] = useState<string | null>(null);
  
  const [isFavorito, setIsFavorito] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [minhasListas, setMinhasListas] = useState<ListaCustomizada[]>([]);
  const [novoNomeLista, setNovoNomeLista] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const idUsuarioLogado = localStorage.getItem("usuarioId");

    if (!token) return;

    async function carregarImagem() {
      try {
        // Usa idPesquisador para imagem (Correto)
        const res = await fetch(
          `http://localhost:8080/api/pesquisadores/${idPesquisador}/imagem`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const blob = await res.blob();
          setImagemPerfil(URL.createObjectURL(blob));
        }
      } catch (error) {
        console.error("Erro imagem:", error);
      }
    }

    async function checarFavorito() {
        if (!idUsuarioLogado) return;
        try {
            const res = await fetch(`http://localhost:8080/api/favoritos/usuario/${idUsuarioLogado}/favorito`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const favoritos = await res.json();
                // Usa idPesquisador para verificar favorito (Correto)
                const jaSegue = favoritos.some((fav: any) => fav.pesquisador?.id === Number(idPesquisador));
                setIsFavorito(jaSegue);
            }
        } catch (error) {
            console.error("Erro ao checar favoritos", error);
        }
    }

    if (idPesquisador) {
        carregarImagem();
        checarFavorito();
    }
  }, [idPesquisador]);


  const handleToggleFavorito = async () => {
    const token = localStorage.getItem("token");
    const idUsuarioLogado = localStorage.getItem("usuarioId");

    if (!token || !idUsuarioLogado) {
        router.push("/login");
        return;
    }

    try {
        if (isFavorito) {
            // Usa idPesquisador para remover favorito (Correto)
            const res = await fetch(
                `http://localhost:8080/api/favoritos/excluirFavorito?usuarioId=${idUsuarioLogado}&pesquisadorId=${idPesquisador}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            if (res.ok) setIsFavorito(false);
        } else {
            // Usa idPesquisador para adicionar favorito (Correto)
            const res = await fetch(`http://localhost:8080/api/favoritos/salvarFavorito`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ pesquisadorId: idPesquisador })
            });
            
            if (res.ok || res.status === 409) setIsFavorito(true);
        }
    } catch (error) {
        console.error("Erro ao favoritar:", error);
    }
  };

  const handleOpenListModal = async () => {
    setModalOpen(true);
    setLoadingModal(true);
    const token = localStorage.getItem("token");
    
    try {
        const res = await fetch("http://localhost:8080/api/listas/listarListas", {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            setMinhasListas(data.map((l: any) => ({ id: l.id, nomeLista: l.nomeLista })));
        }
    } catch (error) {
        console.error("Erro ao buscar listas", error);
    } finally {
        setLoadingModal(false);
    }
  };

  const handleAddToList = async (listaId: number) => {
    const token = localStorage.getItem("token");
    try {
        // 👇 CORREÇÃO AQUI: Usando 'usuarioId' em vez de 'idPesquisador'
        const res = await fetch(
            `http://localhost:8080/api/listas/salvarLista/${listaId}/perfil/${usuarioId}`, 
            {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        if (res.ok) {
            alert("Perfil salvo na lista!");
            setModalOpen(false);
        } else if (res.status === 409) {
            alert("Este perfil já está nesta lista.");
        }
    } catch (error) {
        console.error(error);
    }
  };

  const handleCreateAndAdd = async () => {
    if (!novoNomeLista.trim()) return;
    const token = localStorage.getItem("token");
    try {
        const resCreate = await fetch("http://localhost:8080/api/listas/salvarLista", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ nomeLista: novoNomeLista })
        });
        
        if (resCreate.ok) {
            const novaLista = await resCreate.json();
            await handleAddToList(novaLista.id);
            setNovoNomeLista("");
        }
    } catch (error) {
        console.error(error);
    }
  };


  return (
    <div className="bg-[#990000] text-white py-6 px-10 relative shadow-lg">
      
      {podeEditar ? (
        <Link
          href={`/telaEdicaoPesquisador`}
          className="absolute top-8 right-8 bg-white text-[#990000] p-2 rounded-full shadow hover:bg-gray-100 transition"
        >
          <Pencil size={30} />
        </Link>
      ) : (
        <div className="absolute top-8 right-8 flex gap-3">
          <button
            className={`p-2 rounded-full shadow transition ${
                isFavorito 
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-white text-[#990000] hover:bg-gray-100"
            }`}
            title={isFavorito ? "Remover dos favoritos" : "Favoritar"}
            onClick={handleToggleFavorito}
          >
            <Heart size={30} fill={isFavorito ? "currentColor" : "none"} />
          </button>

          <button
            className="bg-white text-[#990000] p-2 rounded-full shadow hover:bg-gray-100 transition"
            title="Adicionar à lista"
            onClick={handleOpenListModal}
          >
            <BookmarkPlus size={30} />
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 lg:items-start items-center text-center lg:text-left">
      <div className="w-[220px] h-[220px] md:w-[260px] md:h-[260px] lg:w-[320px] lg:h-[320px] rounded-2xl overflow-hidden bg-white/20">
        <Image
          src={imagemPerfil || "/images/user.png"}
          alt="Foto do pesquisador"
          width={360}
          height={360}
          className="object-cover w-full h-full"
            priority
        />
      </div>

        <div className="flex-1 flex flex-col min-h-[300px]">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-1">
            {nomePesquisador} {sobrenome}
          </h1>

          <h2 className="text-xl md:text-2xl mt-0 mb-4 min-h-[28px] md:min-h-[32px] text-white/90">
            {ocupacao?.trim() ? ocupacao : " "}
          </h2>

          <div className="flex flex-wrap gap-3 mb-4 justify-center lg:justify-start">
            {tags.map((tag, i) => (
              <span key={i} className="bg-white text-black px-4 py-2 rounded-full text-sm shadow font-medium">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-auto flex gap-3 pt-4 justify-center lg:justify-start">
            <button
              onClick={onClickContato}
              className="px-6 py-2 rounded shadow border border-white text-white bg-transparent hover:bg-white hover:text-[#990000] transition font-semibold"
            >
              Contato
            </button>

            {podeEditar && (
              <Link
                href="/gerenciarListas"
                className="border border-white text-white px-4 py-1 rounded hover:bg-white hover:text-[#990000] transition flex items-center justify-center font-semibold shadow"
              >
                Gerenciar Listas
              </Link>
            )}
          </div>
        </div>
      </div>

      <p className="absolute right-10 bottom-4 text-xs md:text-sm text-white/80">
        Última atualização em {dataAtualizacao}
      </p>

      {/* --- MODAL SALVAR EM LISTA --- */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 text-black">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-[#990000]">Salvar em...</h2>
                    <button onClick={() => setModalOpen(false)}>
                        <X className="w-5 h-5 text-gray-500 hover:text-black" />
                    </button>
                </div>
                
                {loadingModal ? (
                    <p>Carregando listas...</p>
                ) : (
                    <>
                        <div className="flex flex-col gap-2 max-h-40 overflow-y-auto mb-4">
                            {minhasListas.map((lista) => (
                                <button
                                    key={lista.id}
                                    onClick={() => handleAddToList(lista.id)}
                                    className="w-full text-left p-2 rounded hover:bg-gray-100"
                                >
                                    {lista.nomeLista}
                                </button>
                            ))}
                            {minhasListas.length === 0 && (
                                <p className="text-sm text-gray-500">Nenhuma lista customizada encontrada.</p>
                            )}
                        </div>

                        <div className="border-t pt-4 flex gap-2">
                            <input
                                type="text"
                                placeholder="Criar nova lista..."
                                value={novoNomeLista}
                                onChange={(e) => setNovoNomeLista(e.target.value)}
                                className="flex-1 w-full border px-3 py-2 rounded"
                            />
                            <button
                                onClick={handleCreateAndAdd}
                                className="p-2 rounded bg-[#990000] text-white hover:bg-red-800"
                                title="Criar e adicionar"
                            >
                                <ListPlus size={20} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
      )}
    </div>
  );
}