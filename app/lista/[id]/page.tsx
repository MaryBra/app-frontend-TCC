"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import MenuLateral from "../../components/MenuLateral";
import { Heart, Bookmark, Trash2, X } from "lucide-react";

interface Perfil {
  idUsuario: number;
  idEntidade: number;
  nome: string;
  area: string;
  tipo: string;
  tags: string[];
}

interface UsuarioDTO {
  id: number;
  nomePesquisador: string;
  sobrenome: string;
}

interface PerfilSalvoDTO {
  idUsuario: number;
  idEntidade: number;
  nomeCompleto: string;
  tipoPerfil: string;
  area: string;
}

export default function ListaPage() {
  const { id } = useParams();
  const router = useRouter();

  const isFavoritesList = id === 'favoritos';
  const listaId = isFavoritesList ? null : Number(id); 

  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [nomeLista, setNomeLista] = useState("Carregando...");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const token = localStorage.getItem("token");
    console.log(token);
    const id_usuario_logado = localStorage.getItem("usuarioId");
    console.log(id_usuario_logado)

    if (!token || !id_usuario_logado) {
      console.error("Usuário não logado. Redirecionando...");
      router.push("/login");
      return;
    }

    const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${token}` };

    const fetchFavoritos = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/favoritos/usuario/${id_usuario_logado}/favorito`,
          { method: "GET", headers }
        );
        if (!response.ok) throw new Error("Falha ao buscar favoritos");
        
        const seguidores = await response.json();
        console.log(seguidores)
        const perfisFormatados = seguidores
          .filter(item => item.pesquisador != null)
          .map(item => ({                      
            idEntidade: item.pesquisador.id,
            idUsuario: item.pesquisador.id + 9,
            nome: `${item.pesquisador.nomePesquisador} ${item.pesquisador.sobrenome || ''}`,
            area: "Pesquisador", 
            tipo: item.pesquisador.usuario.tipoUsuario.name,
            tags: [] 
          }));
        
        setPerfis(perfisFormatados);
        setNomeLista("Favoritos");
      } catch (err) {
        console.error("Erro ao buscar favoritos:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchListaCustomizada = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/listas/listarLista/${listaId}`,
          { method: "GET", headers }
        );
        if (!response.ok) throw new Error("Falha ao buscar lista");

        const listaData = await response.json();
        
        const perfisFormatados = (listaData.perfisSalvos || []).map((item: PerfilSalvoDTO) => ({
          idUsuario: item.idUsuario,
          idEntidade: item.idEntidade,
          nome: item.nomeCompleto,
          area: item.area,
          tipo: item.tipoPerfil,
          // tags: item.tags
        }));

        setPerfis(perfisFormatados);
        setNomeLista(listaData.nomeLista);
      } catch (err) {
        console.error("Erro ao buscar lista customizada:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isFavoritesList) {
      fetchFavoritos();
    } else {
      fetchListaCustomizada();
    }

  }, [id, isFavoritesList, listaId, router]);

  const removerPerfil = async (pessoa: Perfil) => {
      const token = localStorage.getItem("token");
      const id_usuario_logado = localStorage.getItem("usuarioId");
      if (!token || !id_usuario_logado) {
          router.push("/login");
          return;
      }

      let url: string;
      let method: string = "DELETE";

      if (isFavoritesList) {
          url = `http://localhost:8080/api/favoritos/excluirFavorito?usuarioId=${id_usuario_logado}&pesquisadorId=${pessoa.idEntidade}`;
      } else {
          url = `http://localhost:8080/api/listas/alterarLista/${listaId}/perfil/${pessoa.idUsuario}`;
      }

      try {
          const response = await fetch(url, {
              method: method,
              headers: { "Authorization": `Bearer ${token}` }
          });

          if (!response.ok) {
              throw new Error("Falha ao remover perfil da lista");
          }
          
          // Atualiza o estado: Filtra usando o ID ÚNICO (idUsuario)
          setPerfis((prev) => prev.filter((p) => p.idUsuario !== pessoa.idUsuario)); 
          
      } catch (err) {
          console.error("Erro ao remover perfil:", err);
      }
  };

  const handleProfileClick = (pessoa: Perfil) => {
    console.log("pessoa: ", pessoa)
    const tipo = pessoa.tipo.toLowerCase();
    console.log("Tipo:", tipo)

    if(tipo === "pesquisador"){
      router.push(`/pesquisadores/${pessoa.idUsuario}`);
    } else if (tipo === "empresa") {
        router.push(`/perfilEmpresa/${pessoa.idUsuario}`);
    } else {
        console.error("Tipo de perfil desconhecido para navegação:", tipo);
    }
  }

  const handleSalvarNome = async () => {
    const token = localStorage.getItem("token");
    const id_usuario_logado = localStorage.getItem("usuarioId");
    if (!token || !id_usuario_logado) {
      router.push("/login");
      return;
    }
    if (isFavoritesList) return; 

    try {
      const res = await fetch(
        `http://localhost:8080/api/listas/alterarLista/${listaId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ nomeLista: nomeLista }) // Enviando o DTO com a chave correta
        }
      );
      if (!res.ok) throw new Error("Falha ao renomear a lista");
      
      setShowModal(false); 
    } catch (err) {
      console.error(err);
    }
  };

  const excluirLista = async () => {
    const token = localStorage.getItem("token");
    const id_usuario_logado = localStorage.getItem("usuarioId");
    if (!token || !id_usuario_logado) {
      router.push("/login");
      return;
    }
    if (isFavoritesList) return; 

    if (confirm(`Tem certeza que deseja excluir a lista "${nomeLista}"?`)) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/listas/excluirLista/${listaId}`,
          {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
          }
        );
        if (!response.ok) throw new Error("Falha ao excluir a lista");
        
        router.push("/gerenciarListas"); 
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
     return (
        <div className="flex flex-col md:flex-row h-screen">
          <MenuLateral />
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xl">Carregando lista...</p>
          </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <MenuLateral />
      <div className="flex-1 bg-gray-100 pr-36 pl-36 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#990000]">{nomeLista}</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
              title="Editar lista"
            >
              {isFavoritesList ? (
                <Heart className="text-red-600" />
              ) : (
                <Bookmark className="text-[#990000]" />
              )}
            </button>
          </div>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {perfis.map((pessoa) => (
            <div
              key={pessoa.idUsuario}
              className="relative bg-white rounded-lg shadow p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleProfileClick(pessoa)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removerPerfil(pessoa);
                }}
                className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-red-100 transition"
                title="Remover da lista"
              >
                <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
              </button>
              <div className="w-20 h-20 bg-gray-200 rounded-full mb-3"></div>
              <h2 className="font-semibold text-gray-600">{pessoa.nome}</h2>
              <p className="text-sm text-gray-600">{pessoa.area}</p>
              {/* <div className="flex flex-wrap gap-2 justify-center my-2">
                {pessoa.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div> */}
              <button className="mt-auto w-full border border-[#990000] text-[#990000] py-1 rounded hover:bg-[#990000] hover:text-white transition"
              onClick={(e) => e.stopPropagation()}>
                Contato
              </button>
            </div>
          ))}
          {perfis.length === 0 && (
            <p className="text-gray-500 col-span-full">Nenhum perfil salvo nesta lista.</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center border-b px-4 py-3">
              <h2 className="text-lg font-bold text-[#990000]">Editar lista</h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-gray-500 hover:text-black" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium mb-2">Nome lista</label>
              <input
                type="text"
                value={nomeLista}
                onChange={(e) => setNomeLista(e.target.value)}
                readOnly={isFavoritesList}
                className={`w-full border px-3 py-2 rounded mb-4 ${isFavoritesList ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              <button
                onClick={excluirLista}
                disabled={isFavoritesList}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded transition mb-6 ${isFavoritesList 
                  ? 'bg-red-50 text-red-300 border border-red-100 cursor-not-allowed' 
                  : 'bg-red-100 text-red-600 border border-red-300 hover:bg-red-200'}`}
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
                  onClick={handleSalvarNome}
                  disabled={isFavoritesList}
                  className={`px-4 py-2 rounded text-white ${isFavoritesList 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-[#990000] hover:bg-red-800'}`}
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