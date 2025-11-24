"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MenuLateral from "@/app/components/MenuLateral";
import { Search, User, Bookmark, Heart, X, ListPlus } from "lucide-react";

// --- 1. Define as Interfaces ---
interface Resultado {
  id: number;
  usuarioId: number;
  nome: string;
  tipo: "pesquisador" | "empresa";
  area: string;
  tags: string[];
}

// --- 2. Componente do Card de Resultado ---
const ResultadoCard = ({
  resultado,
  onBookmarkClick,
}: {
  resultado: Resultado;
  onBookmarkClick: (usuarioId: number) => void;
}) => {
  const router = useRouter();

  const [isFavorite, setIsFavorite] = useState(false);

  const nomeParts = resultado.nome.split(" ");
  const primeiroNome = nomeParts[0];
  const restoDoNome = nomeParts.slice(1).join(" ");

  const handleClick = () => {
    const path =
      resultado.tipo === "pesquisador"
        ? `/pesquisadores/${resultado.usuarioId}`
        : `/perfilEmpresa/${resultado.usuarioId}`;
    router.push(path);
  };

  const handleFavorito = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/favoritos/salvarFavorito`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ pesquisadorId: id }),
        }
      );

      if (response.status === 409 || response.status === 401) {
        return;
      }
      if (!response.ok) throw new Error(`Erro status: ${response.status}`);
      console.log("Seguidor salvo");
      setIsFavorite(true);
    } catch (err) {
      console.error("Erro ao seguir perfil:", err);
      setIsFavorite(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center relative hover:shadow-lg transition-shadow">
      <div className="absolute top-3 right-3 flex gap-2">
        <button className="p-1 rounded-full bg-gray-100 hover:bg-blue-100 transition-colors cursor-pointer">
          <Bookmark
            className="w-5 h-5 text-gray-500 hover:text-blue-600"
            onClick={() => onBookmarkClick(resultado.usuarioId)}
          />
        </button>
        {resultado.tipo === "pesquisador" && (
          <button
            className="p-1 rounded-full bg-gray-100 hover:bg-red-100 transition-colors cursor-pointer"
            onClick={() => handleFavorito(resultado.id)}
          >
            <Heart
              className={`w-5 h-5 transition-all duration-300 ease-in-out ${
                isFavorite
                  ? "text-red-600 fill-red-600 scale-110"
                  : "text-gray-500 hover:text-red-600 group-active:scale-90"
              }`}
            />
          </button>
        )}
      </div>

      <div
        onClick={handleClick}
        className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-3 cursor-pointer overflow-hidden"
      >
        <User size={40} className="text-gray-400" />
      </div>

      <h3
        onClick={handleClick}
        className="font-semibold text-gray-800 cursor-pointer"
      >
        {primeiroNome}
      </h3>
      <p
        onClick={handleClick}
        className="text-gray-500 text-sm mb-4 cursor-pointer"
      >
        {restoDoNome}
      </p>
      <div className="bg-gray-200 w-full h-0.5 my-1"></div>
      <button
        onClick={handleClick}
        className="text-[#990000] font-semibold hover:underline transition-colors cursor-pointer mt-3"
      >
        Contato
      </button>
    </div>
  );
};

// --- 3. Componente Principal da Página ---
export default function PaginaDeBusca() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const tipoParam = searchParams.get("tipo");

  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [carregandoResultados, setCarregandoResultados] = useState(true);

  // Estados para o cabeçalho (Usuário Logado)
  const [termoBusca, setTermoBusca] = useState(query || "");
  const [nome, setNome] = useState(null);
  const [imagemPerfil, setImagemPerfil] = useState("/images/user.png");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentUserType, setCurrentUserType] = useState("");

  const [filtroAtivo, setFiltroAtivo] = useState<
    "todos" | "pesquisador" | "empresa"
  >((tipoParam as "todos" | "pesquisador" | "empresa") || "todos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [modalOpen, setModalOpen] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(
    null
  );
  const [minhasListas, setMinhasListas] = useState([]);
  const [novoNomeLista, setNovoNomeLista] = useState("");

  // --- Função de Navegação para o Perfil Próprio ---
  const handleNavegarParaPerfil = () => {
    if (!currentUserId) return;

    if (currentUserType === "pesquisador") {
      router.push(`/pesquisadores/${currentUserId}`);
    } else {
      router.push(`/perfilEmpresa/${currentUserId}`);
    }
  };

  useEffect(() => {
    const handleBuscarUsuario = async () => {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");

      if (!token || !email) {
        router.push("/login");
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      try {
        // 1. Busca usuário base
        const response = await fetch(
          `http://localhost:8080/api/usuarios/listarUsuario/${email}`,
          { headers }
        );
        if (!response.ok) throw new Error("Falha ao buscar usuário");
        const dadosUsuario = await response.json();

        // Configura dados básicos para navegação
        setCurrentUserId(dadosUsuario.id);
        const tipo = dadosUsuario.tipoUsuario.name.toLowerCase();
        setCurrentUserType(tipo);

        // 2. Busca dados detalhados e imagem
        if (dadosUsuario.tipoUsuario.name === "PESQUISADOR") {
          const respPesq = await fetch(
            `http://localhost:8080/api/dadosPesquisador/${dadosUsuario.id}`,
            { headers }
          );
          if (respPesq.ok) {
            const dadosPesquisador = await respPesq.json();
            setNome(dadosPesquisador.pesquisador.nomePesquisador);

            // Busca Imagem Pesquisador
            try {
              const imgRes = await fetch(
                `http://localhost:8080/api/pesquisadores/${dadosPesquisador.pesquisador.id}/imagem`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              if (imgRes.ok) {
                const blob = await imgRes.blob();
                if (blob.size > 0) setImagemPerfil(URL.createObjectURL(blob));
              }
            } catch (e) {
              console.log("Erro imagem pesq", e);
            }
          }
        } else {
          const respEmp = await fetch(
            `http://localhost:8080/api/empresas/listarEmpresa/${dadosUsuario.id}`,
            { headers }
          );
          if (respEmp.ok) {
            const dadosEmpresa = await respEmp.json();
            setNome(dadosEmpresa.nomeRegistro);

            // Busca Imagem Empresa (se tiver ID da empresa)
            if (dadosEmpresa.id) {
              try {
                const imgRes = await fetch(
                  `http://localhost:8080/api/empresas/${dadosEmpresa.id}/imagem`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );
                if (imgRes.ok) {
                  const blob = await imgRes.blob();
                  if (blob.size > 0) setImagemPerfil(URL.createObjectURL(blob));
                }
              } catch (e) {
                console.log("Erro imagem emp", e);
              }
            }
          }
        }
      } catch (err) {
        console.error("Erro ao buscar perfil do usuário:", err);
      }
    };

    handleBuscarUsuario();
  }, [router]);

  // --- BUSCAR TODOS OS PESQUISADORES QUANDO TERMO ESTIVER VAZIO ---
  const buscarTodosPesquisadores = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        "http://localhost:8080/api/pesquisadores/listarPesquisadores",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const todosPesquisadores = await response.json();

        // Converter para o formato de Resultado
        const resultadosFormatados = todosPesquisadores.map(
          (pesquisador: any) => ({
            id: pesquisador.id,
            usuarioId: pesquisador.usuario?.id || pesquisador.id,
            nome: `${pesquisador.nomePesquisador || ""} ${
              pesquisador.sobrenome || ""
            }`.trim(),
            tipo: "pesquisador" as const,
            area: pesquisador.ocupacao || "Pesquisador",
            tags: pesquisador.tags?.listaTags || [],
          })
        );

        setResultados(resultadosFormatados);
      }
    } catch (error) {
      console.error("Erro ao buscar todos os pesquisadores:", error);
    }
  };

  // --- BUSCAR TODAS AS EMPRESAS QUANDO TERMO ESTIVER VAZIO ---
  const buscarTodasEmpresas = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        "http://localhost:8080/api/empresas/listarEmpresas",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const todasEmpresas = await response.json();

        // Converter para o formato de Resultado
        const resultadosFormatados = todasEmpresas.map((empresa: any) => ({
          id: empresa.id,
          usuarioId: empresa.id,
          nome: empresa.nomeComercial || empresa.nomeRegistro || "Empresa",
          tipo: "empresa" as const,
          area: empresa.setor || "Empresa",
          tags: [],
        }));

        setResultados(resultadosFormatados);
      }
    } catch (error) {
      console.error("Erro ao buscar todas as empresas:", error);
    }
  };

  // --- BUSCAR TODOS OS USUÁRIOS (PESQUISADORES E EMPRESAS) ---
  const buscarTodosUsuarios = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // Buscar pesquisadores e empresas em paralelo
      const [resPesquisadores, resEmpresas] = await Promise.all([
        fetch("http://localhost:8080/api/pesquisadores/listarPesquisadores", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("http://localhost:8080/api/empresas/listarEmpresas", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const todosPesquisadores = resPesquisadores.ok
        ? await resPesquisadores.json()
        : [];
      const todasEmpresas = resEmpresas.ok ? await resEmpresas.json() : [];

      // Converter pesquisadores
      const pesquisadoresFormatados = todosPesquisadores.map(
        (pesquisador: any) => ({
          id: pesquisador.id,
          usuarioId: pesquisador.usuario?.id || pesquisador.id,
          nome: `${pesquisador.nomePesquisador || ""} ${
            pesquisador.sobrenome || ""
          }`.trim(),
          tipo: "pesquisador" as const,
          area: pesquisador.ocupacao || "Pesquisador",
          tags: pesquisador.tags?.listaTags || [],
        })
      );

      // Converter empresas
      const empresasFormatadas = todasEmpresas.map((empresa: any) => ({
        id: empresa.id,
        usuarioId: empresa.id,
        nome: empresa.nomeComercial || empresa.nomeRegistro || "Empresa",
        tipo: "empresa" as const,
        area: empresa.setor || "Empresa",
        tags: [],
      }));

      // Combinar resultados
      setResultados([...pesquisadoresFormatados, ...empresasFormatadas]);
    } catch (error) {
      console.error("Erro ao buscar todos os usuários:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchResultados = async () => {
      setCarregandoResultados(true);
      try {
        // Se o termo de busca estiver vazio, buscar todos os usuários
        if (!query || query.trim() === "") {
          if (filtroAtivo === "pesquisador") {
            await buscarTodosPesquisadores();
          } else if (filtroAtivo === "empresa") {
            await buscarTodasEmpresas();
          } else {
            await buscarTodosUsuarios();
          }
        } else {
          // Busca normal com termo
          const response = await fetch(
            "http://localhost:8080/api/pesquisa/buscar",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ termo: query, tipo: "todos" }),
            }
          );
          if (response.ok) {
            const dados = await response.json();
            setResultados(dados);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar:", error);
        // Em caso de erro, tentar buscar todos os usuários
        await buscarTodosUsuarios();
      } finally {
        setCarregandoResultados(false);
      }
    };

    fetchResultados();
  }, [query, filtroAtivo, router]);

  const handleFilterChange = (filtro: "todos" | "pesquisador" | "empresa") => {
    setFiltroAtivo(filtro);
    setCurrentPage(1);
  };

  const handleBookmarkClick = async (usuarioId: number) => {
    setSelectedProfileId(usuarioId);
    setLoadingModal(true);
    setModalOpen(true);
    setNovoNomeLista("");
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8080/api/listas/listarListas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setMinhasListas(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingModal(false);
    }
  };

  const handleAddToList = async (listaId: number) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:8080/api/listas/salvarLista/${listaId}/perfil/${selectedProfileId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        alert("Perfil salvo na lista!");
        setModalOpen(false);
      } else if (res.status === 409) {
        alert("Este perfil já está salvo nesta lista.");
      } else {
        throw new Error("Falha ao adicionar perfil");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar perfil.");
    }
  };

  const handleCreateAndAddToList = async () => {
    if (!novoNomeLista.trim()) return;

    const token = localStorage.getItem("token");
    try {
      const resCreate = await fetch(
        "http://localhost:8080/api/listas/salvarLista",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nomeLista: novoNomeLista }),
        }
      );
      if (!resCreate.ok) throw new Error("Falha ao criar lista");

      const novaLista = await resCreate.json();
      await handleAddToList(novaLista.id);
      setNovoNomeLista("");
    } catch (err) {
      console.error(err);
      alert("Erro ao criar nova lista.");
    }
  };

  const handleNovaBusca = () => {
    if (termoBusca.trim()) {
      router.push(
        `/pesquisa?q=${encodeURIComponent(
          termoBusca.trim()
        )}&tipo=${filtroAtivo}`
      );
    } else {
      // Se a busca estiver vazia, manter na mesma página mas atualizar o filtro
      router.push(`/pesquisa?q=&tipo=${filtroAtivo}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleNovaBusca();
  };

  const resultadosFiltrados = resultados.filter((resultado) => {
    if (filtroAtivo === "todos") return true;
    return resultado.tipo === filtroAtivo;
  });

  const totalPages = Math.ceil(resultadosFiltrados.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = resultadosFiltrados.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // Determinar o título da página baseado no filtro e na busca
  const getTituloPagina = () => {
    if (!query || query.trim() === "") {
      if (filtroAtivo === "pesquisador") return "Todos os Pesquisadores";
      if (filtroAtivo === "empresa") return "Todas as Empresas";
      return "Todos os Usuários";
    } else {
      return `Resultados da busca para "${query}"`;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <MenuLateral />

      <main className="flex-1 ml-20 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-6">
          <div className="relative w-1/2">
            <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow-md w-full">
              <Search className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Buscar por recrutador, pesquisa, tags..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 text-gray-600 outline-none cursor-text"
              />
              {termoBusca && (
                <button
                  type="button"
                  onClick={() => setTermoBusca("")}
                  className="text-gray-500 hover:text-gray-700 ml-2 cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
              <button
                type="button"
                onClick={handleNovaBusca}
                className="ml-2 bg-[#990000] text-white px-4 py-1 rounded-md hover:bg-red-700"
              >
                Buscar
              </button>
            </div>
          </div>

          {/* Botão de Perfil Atualizado */}
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow-md">
              <img
                src={imagemPerfil}
                alt="user"
                className="w-8 h-8 rounded-full mr-2 cursor-pointer object-cover"
                onClick={handleNavegarParaPerfil}
              />
              <span className="mr-2 text-gray-600 cursor-default">
                {nome || "Carregando..."}
              </span>
              <button
                className="bg-[#990000] text-white px-3 py-1 rounded-md shadow-md hover:bg-red-700 cursor-pointer transition-colors"
                onClick={handleNavegarParaPerfil}
              >
                Ver Perfil
              </button>
            </div>
          </div>
        </header>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {getTituloPagina()}
          </h1>
          {(!query || query.trim() === "") && (
            <p className="text-gray-600 mt-2">
              {resultadosFiltrados.length}{" "}
              {filtroAtivo === "pesquisador"
                ? "pesquisadores"
                : filtroAtivo === "empresa"
                ? "empresas"
                : "usuários"}{" "}
              encontrados
            </p>
          )}
        </div>

        <div className="flex border-b border-gray-300 mb-6">
          <button
            onClick={() => handleFilterChange("todos")}
            className={
              filtroAtivo === "todos"
                ? "py-2 px-4 text-red-700 border-b-2 border-red-700 font-semibold"
                : "py-2 px-4 text-gray-500 hover:text-gray-800"
            }
          >
            Todos
          </button>
          <button
            onClick={() => handleFilterChange("empresa")}
            className={
              filtroAtivo === "empresa"
                ? "py-2 px-4 text-red-700 border-b-2 border-red-700 font-semibold"
                : "py-2 px-4 text-gray-500 hover:text-gray-800"
            }
          >
            Empresas
          </button>
          <button
            onClick={() => handleFilterChange("pesquisador")}
            className={
              filtroAtivo === "pesquisador"
                ? "py-2 px-4 text-red-700 border-b-2 border-red-700 font-semibold"
                : "py-2 px-4 text-gray-500 hover:text-gray-800"
            }
          >
            Pesquisadores
          </button>
        </div>

        <div className="max-w-full">
          {carregandoResultados && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
            </div>
          )}
          {!carregandoResultados && resultadosFiltrados.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-1">
                Nenhum resultado encontrado.
              </p>
              <p className="text-gray-400 text-sm">
                Tente alterar os filtros ou termos de busca.
              </p>
            </div>
          )}
          {!carregandoResultados && resultadosFiltrados.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentItems.map((resultado) => (
                <ResultadoCard
                  key={`${resultado.tipo}-${resultado.id}`}
                  resultado={resultado}
                  onBookmarkClick={(usuarioId) =>
                    handleBookmarkClick(usuarioId)
                  }
                />
              ))}
            </div>
          )}
        </div>

        {!carregandoResultados && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white rounded-md shadow disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-gray-700">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white rounded-md shadow disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        )}
      </main>

      {/* Modal (mantido igual) */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[#990000]">Salvar em...</h2>
              <button onClick={() => setModalOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            {loadingModal ? (
              <p>Carregando listas...</p>
            ) : (
              <>
                <div className="flex flex-col gap-2 text-gray-600 max-h-40 overflow-y-auto mb-4">
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
                    <p className="text-sm text-gray-500">
                      Nenhuma lista customizada encontrada.
                    </p>
                  )}
                </div>
                <div className="border-t pt-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Criar nova lista..."
                    value={novoNomeLista}
                    onChange={(e) => setNovoNomeLista(e.target.value)}
                    className="flex-1 w-full border text-gray-600 px-3 py-2 rounded"
                  />
                  <button
                    onClick={handleCreateAndAddToList}
                    className="p-2 rounded bg-[#990000] text-white"
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
