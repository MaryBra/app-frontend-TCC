"use client";

import { useState, useEffect } from "react";
import LayoutWrapper from "../components/LayoutWrapper";
import {
  Bookmark,
  Heart,
  List,
  Plus,
  Trash2,
  Edit3,
  Users,
} from "lucide-react";
import Link from "next/link";

interface Lista {
  id: number;
  nome: string;
  count: number;
  tipo: "favoritos" | "personalizada";
  descricao?: string;
  cor: string;
  itens: string[];
}

const renderIcon = (tipo: string, cor: string) => {
  if (tipo === "favoritos") {
    return <Heart className="text-red-500" />;
  }
  return <List style={{ color: cor }} />;
};

export default function GerenciarListas() {
  const [listas, setListas] = useState<Lista[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [corSelecionada, setCorSelecionada] = useState("#990000");
  const [listaEditando, setListaEditando] = useState<Lista | null>(null);

  const cores = [
    "#990000",
    "#dc2626",
    "#ea580c",
    "#d97706",
    "#059669",
    "#0891b2",
    "#3730a3",
    "#7c3aed",
  ];

  useEffect(() => {
    carregarListas();

    const handleFavoritosAtualizados = () => {
      carregarListas();
    };

    window.addEventListener("favoritosAtualizados", handleFavoritosAtualizados);

    return () => {
      window.removeEventListener(
        "favoritosAtualizados",
        handleFavoritosAtualizados
      );
    };
  }, []);

  const carregarListas = () => {
    const listasSalvas = localStorage.getItem("listasPersonalizadas");
    const curtidos = JSON.parse(localStorage.getItem("curtidos") || "[]");
    const salvos = JSON.parse(localStorage.getItem("salvos") || "[]");

    const listaFavoritos: Lista = {
      id: 1,
      nome: "Favoritos",
      count: curtidos.length,
      tipo: "favoritos",
      cor: "#dc2626",
      itens: curtidos,
    };

    if (listasSalvas) {
      const listasParse = JSON.parse(listasSalvas);
      setListas([listaFavoritos, ...listasParse]);
    } else {
      setListas([listaFavoritos]);
    }
  };

  const salvarListas = (novasListas: Lista[]) => {
    const listasPersonalizadas = novasListas.filter(
      (l) => l.tipo === "personalizada"
    );
    localStorage.setItem(
      "listasPersonalizadas",
      JSON.stringify(listasPersonalizadas)
    );
  };

  const adicionarLista = () => {
    if (novoNome.trim() === "") return;

    const novaLista: Lista = {
      id: Date.now(),
      nome: novoNome,
      count: 0,
      tipo: "personalizada",
      descricao: novaDescricao,
      cor: corSelecionada,
      itens: [],
    };

    const novasListas = [...listas, novaLista];
    setListas(novasListas);
    salvarListas(novasListas);
    setNovoNome("");
    setNovaDescricao("");
    setCorSelecionada("#990000");
    setShowModal(false);
  };

  const editarLista = () => {
    if (!listaEditando || novoNome.trim() === "") return;

    const novasListas = listas.map((lista) =>
      lista.id === listaEditando.id
        ? {
            ...lista,
            nome: novoNome,
            descricao: novaDescricao,
            cor: corSelecionada,
          }
        : lista
    );

    setListas(novasListas);
    salvarListas(novasListas);
    setListaEditando(null);
    setNovoNome("");
    setNovaDescricao("");
    setCorSelecionada("#990000");
    setShowModal(false);
  };

  const excluirLista = (id: number) => {
    const novasListas = listas.filter((lista) => lista.id !== id);
    setListas(novasListas);
    salvarListas(novasListas);
  };

  const abrirModalEdicao = (lista: Lista) => {
    setListaEditando(lista);
    setNovoNome(lista.nome);
    setNovaDescricao(lista.descricao || "");
    setCorSelecionada(lista.cor);
    setShowModal(true);
  };

  const fecharModal = () => {
    setShowModal(false);
    setListaEditando(null);
    setNovoNome("");
    setNovaDescricao("");
    setCorSelecionada("#990000");
  };

  const totalItens = listas.reduce((total, lista) => total + lista.count, 0);

  return (
    <LayoutWrapper>
      <div className="p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#990000] dark:text-red-400">
                Minhas Listas
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Organize pesquisadores e empresas em listas personalizadas
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#990000] text-white p-3 rounded-full shadow-lg hover:bg-red-800 transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden md:inline">Nova Lista</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <Bookmark className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {listas.length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Listas
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalItens}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Itens salvos
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listas.map((lista) => (
              <div
                key={lista.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div
                  className="h-2 w-full"
                  style={{ backgroundColor: lista.cor }}
                ></div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: lista.cor + "20" }}
                      >
                        {renderIcon(lista.tipo, lista.cor)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                          {lista.nome}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {lista.count} itens
                        </p>
                      </div>
                    </div>

                    {lista.tipo === "personalizada" && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => abrirModalEdicao(lista)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition cursor-pointer"
                          title="Editar lista"
                        >
                          <Edit3 className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => excluirLista(lista.id)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition cursor-pointer"
                          title="Excluir lista"
                        >
                          <Trash2 className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    )}
                  </div>

                  {lista.descricao && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {lista.descricao}
                    </p>
                  )}

                  <Link
                    href={`/lista/${lista.id}`}
                    className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Bookmark className="w-4 h-4" />
                    Ver Lista
                  </Link>
                </div>
              </div>
            ))}

            <button
              onClick={() => setShowModal(true)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-[#990000] dark:hover:border-red-400 p-6 flex flex-col items-center justify-center gap-3 cursor-pointer group"
            >
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-900 transition-colors">
                <Plus className="w-6 h-6 text-gray-500 group-hover:text-[#990000] dark:group-hover:text-red-400" />
              </div>
              <span className="font-semibold text-gray-700 dark:text-gray-300 group-hover:text-[#990000] dark:group-hover:text-red-400">
                Criar Nova Lista
              </span>
            </button>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
              <div className="flex justify-between items-center border-b dark:border-gray-700 px-6 py-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {listaEditando ? "Editar Lista" : "Criar Nova Lista"}
                </h2>
                <button
                  onClick={fecharModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nome da lista *
                  </label>
                  <input
                    type="text"
                    placeholder="Digite o nome da lista"
                    value={novoNome}
                    onChange={(e) => setNovoNome(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#990000]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descrição (opcional)
                  </label>
                  <textarea
                    placeholder="Descreva o propósito desta lista"
                    value={novaDescricao}
                    onChange={(e) => setNovaDescricao(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#990000] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cor da lista
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {cores.map((cor) => (
                      <button
                        key={cor}
                        onClick={() => setCorSelecionada(cor)}
                        className={`w-8 h-8 rounded-full border-2 ${
                          corSelecionada === cor
                            ? "border-gray-800 dark:border-white"
                            : "border-transparent"
                        } cursor-pointer`}
                        style={{ backgroundColor: cor }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t dark:border-gray-700 px-6 py-4">
                <button
                  onClick={fecharModal}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={listaEditando ? editarLista : adicionarLista}
                  disabled={!novoNome.trim()}
                  className="px-4 py-2 bg-[#990000] text-white rounded hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  {listaEditando ? "Salvar" : "Criar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutWrapper>
  );
}
