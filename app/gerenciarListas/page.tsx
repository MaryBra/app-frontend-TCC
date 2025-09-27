"use client";

import { useState } from "react";
import { Bookmark, Heart, List } from "lucide-react";
import MenuLateral from "../components/MenuLateral";
import Link from "next/link";

export default function GerenciarListas() {
  const [listas, setListas] = useState([
    { id: 1, nome: "Favoritos", count: 10, icone: <Heart className="text-red-500" /> },
    { id: 2, nome: "Pesquisadores de Interesse", count: 32, icone: <List /> },
    { id: 3, nome: "Pesquisadores Área de Tecnologia", count: 15, icone: <List /> },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [novoNome, setNovoNome] = useState("");

  const adicionarLista = () => {
    if (novoNome.trim() === "") return;
    const novaLista = {
      id: listas.length + 1,
      nome: novoNome,
      count: 0,
      icone: <List />, // usa o ícone padrão
    };
    setListas([...listas, novaLista]);
    setNovoNome("");
    setShowModal(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <MenuLateral />

      <div className="flex-1 bg-gray-100 pr-36 pl-36 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#990000]">Gerenciar Listas</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
          >
            <Bookmark className="text-[#990000]" />
          </button>
        </div>

        {/* Listas */}
        <div className="flex flex-col gap-4">
          {listas.map((lista) => (
            <Link
              key={lista.id}
              href={`/lista/${lista.id}`}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                {lista.icone}
                <span className="font-medium">{lista.nome}</span>
              </div>
              <span className="font-semibold">{lista.count}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Criar Nova Lista</h2>
            <input
              type="text"
              placeholder="Nome da lista"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded border hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={adicionarLista}
                className="px-4 py-2 rounded bg-[#990000] text-white hover:bg-red-800"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
