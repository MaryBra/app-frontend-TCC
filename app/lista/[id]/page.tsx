"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import MenuLateral from "../../components/MenuLateral";
import { Heart, Bookmark, Trash2, X } from "lucide-react";

// mock inicial de perfis
const mockPerfis = {
  1: [
    { id: 101, nome: "Maria Silva", area: "Análise de Sistemas", tags: ["Análise de Sistemas", "Suporte Técnico"] },
    { id: 102, nome: "João Pereira", area: "Banco de Dados", tags: ["DBA", "SQL"] },
  ],
  2: [{ id: 201, nome: "Carla Souza", area: "Redes de Computadores", tags: ["Redes", "Infraestrutura"] }],
  3: [],
};

export default function ListaPage() {
  const { id } = useParams(); // pega id da lista na rota
  const router = useRouter();
  const [perfis, setPerfis] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [nomeLista, setNomeLista] = useState(`Lista ${id}`);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id_usuario = localStorage.getItem("id_usuario");

    const handleSeguidores = async () => {
      if (!token) {
        console.error("Usuário não logado. Redirecionando...");
        router.push("/login");
        return;
      }

      try{
        const response = await fetch(
          `http://localhost:8080/api/seguidores/usuario/${id_usuario}/seguindo`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            }
          }
        )

        if (!response.ok) {
          throw new Error("Falha ao buscar seguidores");
        }

        const seguidores = await response.json();
        console.log("Dados da API:", seguidores);

        const perfisFormatados = seguidores
          .filter(item => item.pesquisador != null)
          .map(item => ({                      
            id: item.pesquisador.id,
            nome: `${item.pesquisador.nomePesquisador} ${item.pesquisador.sobrenome}`,
            area: "Pesquisador", 
            tags: []              
          }));

        setPerfis(perfisFormatados);
      }catch(err){
        console.error("Erro ao buscar seguidores:", err);
      }
    }

    handleSeguidores();
  }, [])

  // função para remover perfil
  const removerPerfil = (idPerfil: number) => {
    setPerfis((prev) => prev.filter((p) => p.id !== idPerfil));
  };

  // excluir lista (simulação: volta pra tela de gerenciar listas)
  const excluirLista = () => {
    alert(`Lista "${nomeLista}" excluída!`);
    router.push("/gerenciarListas");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <MenuLateral />

      <div className="flex-1 bg-gray-100 pr-36 pl-36 p-6">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#990000]">{nomeLista}</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
              title="Editar lista"
            >
              <Bookmark className="text-[#990000]" />
            </button>
            <button className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition">
              <Heart className="text-red-600" />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {perfis.map((pessoa) => (
            <div
              key={pessoa.id}
              className="relative bg-white rounded-lg shadow p-4 flex flex-col items-center text-center"
            >
              {/* Botão remover */}
              <button
                onClick={() => removerPerfil(pessoa.id)}
                className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-red-100 transition"
                title="Remover da lista"
              >
                <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
              </button>

              {/* Avatar */}
              <div className="w-20 h-20 bg-gray-200 rounded-full mb-3"></div>
              {/* Nome e área */}
              <h2 className="font-semibold">{pessoa.nome}</h2>
              <p className="text-sm text-gray-600">{pessoa.area}</p>
              {/* Tags */}
              <div className="flex flex-wrap gap-2 justify-center my-2">
                {pessoa.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {/* Botão contato */}
              <button className="mt-auto w-full border border-[#990000] text-[#990000] py-1 rounded hover:bg-[#990000] hover:text-white transition">
                Contato
              </button>
            </div>
          ))}

          {perfis.length === 0 && (
            <p className="text-gray-500 col-span-full">Nenhum perfil salvo nesta lista.</p>
          )}
        </div>
      </div>

      {/* Modal Editar Lista */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg w-96">
            {/* Cabeçalho modal */}
            <div className="flex justify-between items-center border-b px-4 py-3">
              <h2 className="text-lg font-bold text-[#990000]">Editar lista</h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-gray-500 hover:text-black" />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="p-6">
              <label className="block text-sm font-medium mb-2">Nome lista</label>
              <input
                type="text"
                value={nomeLista}
                onChange={(e) => setNomeLista(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-4"
              />

              <button
                onClick={excluirLista}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded bg-red-100 text-red-600 border border-red-300 hover:bg-red-200 transition mb-6"
              >
                <Trash2 className="w-4 h-4" />
                Excluir Lista
              </button>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded bg-gray-300 text-white hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded bg-[#990000] text-white hover:bg-red-800"
                >
                  Gravar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
