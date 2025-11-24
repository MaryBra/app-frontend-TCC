"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import MenuLateral from "../components/MenuLateral";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/a11y";
import {
  Search,
  Heart,
  Bookmark,
  X,
  ChevronLeft,
  ChevronRight,
  ListPlus,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { TokenPayload } from "../types/auth.types";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function Home() {
  const router = useRouter();

  // Estados para busca
  const [termoBusca, setTermoBusca] = useState("");
  const [resultadosBusca, setResultadosBusca] = useState([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [carregando, setCarregando] = useState(false);

  // Estados do Usuário Logado
  const [nome, setNome] = useState(null);
  const [imagemPerfil, setImagemPerfil] = useState("/images/user.png");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserType, setCurrentUserType] = useState("");

  const searchRef = useRef(null);
  const swiperRef = useRef(null);

  // Mock - Recomendações
  const [recomendacoes, setRecomendacoes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(
    null
  );
  const [minhasListas, setMinhasListas] = useState([]);
  const [novoNomeLista, setNovoNomeLista] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // --- LÓGICA DE NAVEGAÇÃO DO PERFIL ---
  const handleNavegarParaPerfil = () => {
    if (!currentUserId) return;

    if (currentUserType === "pesquisador") {
      router.push(`/pesquisadores/${currentUserId}`);
    } else {
      router.push(`/perfilEmpresa/${currentUserId}`);
    }
  };

  const handleBuscaCompleta = () => {
    if (termoBusca.trim()) {
      router.push(`/pesquisa?q=${encodeURIComponent(termoBusca.trim())}`);
    }
  };

  // Fechar resultados ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setMostrarResultados(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Função de busca
  const handleBuscar = async (e) => {
    if (e) e.preventDefault();

    if (!termoBusca.trim()) {
      setMostrarResultados(false);
      setResultadosBusca([]);
      return;
    }

    setCarregando(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:8080/api/pesquisa/buscar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            termo: termoBusca,
            tipo: "todos",
          }),
        }
      );

      if (response.ok) {
        const dados = await response.json();
        setResultadosBusca(dados);
        setMostrarResultados(true);
      } else {
        setResultadosBusca([]);
        setMostrarResultados(true);
      }
    } catch (error) {
      console.error("Erro ao buscar:", error);
      setResultadosBusca([]);
      setMostrarResultados(true);
    } finally {
      setCarregando(false);
    }
  };

  // Busca em tempo real com debounce
  useEffect(() => {
    if (termoBusca.length >= 2) {
      const timeoutId = setTimeout(() => {
        handleBuscar();
      }, 300);
      return () => clearTimeout(timeoutId);
    } else if (termoBusca.length === 0) {
      setMostrarResultados(false);
      setResultadosBusca([]);
    }
  }, [termoBusca]);

  // --- CARREGAMENTO DE DADOS DO USUÁRIO ---
  useEffect(() => {
    const handleBuscarUsuario = async () => {
      const token = localStorage.getItem("token");

      const tokenContent = jwtDecode<TokenPayload>(token || "");
      const email = tokenContent.sub;

      console.log(token);
      if (!token || !email) {
        router.push("/login");
        return;
      }

      setCarregando(true);

      try {
        const response = await fetch(
          `http://localhost:8080/api/usuarios/listarUsuario/${email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Falha ao buscar dados do usuario");
        }

        const dadosUsuario = await response.json();

        const tipo = dadosUsuario.tipoUsuario.name.toLowerCase();
        setCurrentUserId(dadosUsuario.id);
        setCurrentUserType(tipo);

        if (tipo === "pesquisador") {
          await handleDadosPesquisador(dadosUsuario.id);
        } else {
          await handleDadosEmpresa(dadosUsuario.id);
        }

        localStorage.setItem("tipo_usuario", tipo);
        localStorage.setItem("usuarioId", dadosUsuario.id);

        await handleRecomendacao(dadosUsuario.id);
      } catch (err) {
        console.error("Erro ao buscar perfil:", err);
      } finally {
        setCarregando(false);
      }
    };

    const handleDadosPesquisador = async (id) => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `http://localhost:8080/api/dadosPesquisador/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const dadosPesquisador = await response.json();
          localStorage.setItem("idTag", dadosPesquisador.pesquisador.id);
          setNome(dadosPesquisador.pesquisador.nomePesquisador);

          try {
            const imgResponse = await fetch(
              `http://localhost:8080/api/pesquisadores/${dadosPesquisador.pesquisador.id}/imagem`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            if (imgResponse.ok) {
              const blob = await imgResponse.blob();
              if (blob.size > 0) {
                const urlImagem = URL.createObjectURL(blob);
                setImagemPerfil(urlImagem);
              }
            }
          } catch (imgError) {
            console.error("Erro imagem:", imgError);
          }
        }
      } catch (err) {
        console.error("Erro dados pesquisador:", err);
      }
    };

    const handleDadosEmpresa = async (id) => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `http://localhost:8080/api/empresas/listarEmpresa/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const dadosEmpresa = await response.json();
          setNome(dadosEmpresa.nomeRegistro);

          try {
            if (dadosEmpresa.id) {
              const imgResponse = await fetch(
                `http://localhost:8080/api/empresas/${dadosEmpresa.id}/imagem`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              if (imgResponse.ok) {
                const blob = await imgResponse.blob();
                if (blob.size > 0) {
                  const urlImagem = URL.createObjectURL(blob);
                  setImagemPerfil(urlImagem);
                }
              }
            }
          } catch (e) {
            console.log("Sem imagem empresa ou erro");
          }
        }
      } catch (err) {
        console.error("Erro dados empresa:", err);
      }
    };

    const handleRecomendacao = async (id) => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `http://localhost:8080/api/recomendacoes`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const recomendacao = await response.json();
          const recomendacoesFormatadas = recomendacao.map((item) => ({
            id: item.id,
            usuarioId: item.usuario.id,
            nome: item.nomePesquisador,
            area: item.sobrenome,
            tags: item.tags || [],
            email: item.email || "projetolaverse@gmail.com",
          }));
          setRecomendacoes(recomendacoesFormatadas);
        }
      } catch (err) {
        console.error("Erro recomendacao:", err);
      }
    };

    handleBuscarUsuario();
  }, [router]);

  const handleFavorito = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Usuário não logado. Redirecionando...");
      router.push("/login");
      return;
    }

    setCarregando(true);

    try {
      const response = await fetch(
        `http://localhost:8080/api/favoritos/salvarFavorito`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            pesquisadorId: id,
          }),
        }
      );

      if (response.status === 409) {
        console.warn("Perfil já está nos favoritos. Não adicionado.");
        alert("Este perfil já está salvo como favorito.");

        setRecomendacoes((listaAtual) =>
          listaAtual.filter((perfil) => perfil.id !== id)
        );
        return;
      }

      if (!response.ok) {
        throw new Error(`Falha ao salvar seguidor. Status: ${response.status}`);
      }

      const novoSeguidor = await response.json();
      console.log("Seguidor salvo:", novoSeguidor);

      setRecomendacoes((listaAtual) =>
        listaAtual.filter((perfil) => perfil.id !== id)
      );
    } catch (err) {
      console.error("Erro ao seguir perfil:", err);
    } finally {
      setCarregando(false);
    }
  };

  const handleBookmarkClick = async (profileId: number) => {
    setSelectedProfileId(profileId);
    setLoadingModal(true);
    setModalOpen(true);
    setSelectedUser(null);
    setNovoNomeLista("");

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:8080/api/listas/listarListas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMinhasListas(data);
      }
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
      if (!res.ok) throw new Error("Falha ao adicionar perfil");
      alert("Perfil salvo na lista!");
      setModalOpen(false);
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
  const limparBusca = () => {
    setTermoBusca("");
    setMostrarResultados(false);
    setResultadosBusca([]);
  };
  const handleSelecionarResultado = (resultado) => {
    if (resultado.tipo === "pesquisador") {
      router.push(`/pesquisadores/${resultado.usuarioId}`);
    } else if (resultado.tipo === "empresa") {
      router.push(`/perfilEmpresa/${resultado.usuarioId}`);
    }
    setMostrarResultados(false);
    setTermoBusca("");
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleBuscaCompleta();
  };
  const goNext = () => {
    swiperRef.current?.swiper.slideNext();
  };
  const goPrev = () => {
    swiperRef.current?.swiper.slidePrev();
  };

  // NOVA FUNÇÃO: Redirecionar para página de pesquisa com todos os pesquisadores
  const handleVerMaisPesquisadores = () => {
    router.push("/pesquisa?q=&tipo=pesquisador");
  };

  if (carregando) {
    return (
      <div className="flex h-screen bg-gray-100">
        <MenuLateral />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <LoadingSpinner></LoadingSpinner>
          </div>
        </main>
      </div>
    );
  }

  if (!nome) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p className="text-xl">Carregando dados do usuário...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <MenuLateral />

      <div className="flex-1 ml-20 p-6 overflow-y-auto pl-20 pr-20">
        {/* Barra Superior */}
        <header className="flex justify-between items-center mb-6">
          <div className="relative w-1/2" ref={searchRef}>
            <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow-md w-full">
              <Search className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Buscar por recrutador, pesquisa, tags..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 outline-none cursor-text text-gray-800"
              />
              {termoBusca && (
                <button
                  type="button"
                  onClick={limparBusca}
                  className="text-gray-500 hover:text-gray-700 ml-2 cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
              <button
                type="button"
                onClick={handleBuscaCompleta}
                disabled={carregando}
                className="ml-2 bg-[#990000] text-white px-4 py-1 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {carregando ? "..." : "Buscar"}
              </button>
            </div>

            {/* Dropdown de resultados */}
            {mostrarResultados && (
              <div className="absolute top-full left-0 right-0 bg-white mt-1 rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
                {resultadosBusca.length > 0 ? (
                  resultadosBusca.map((resultado) => (
                    <div
                      key={`${resultado.tipo}-${resultado.id}`}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                      onClick={() => handleSelecionarResultado(resultado)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {resultado.nome}
                          </h3>
                          <p className="text-sm text-gray-700 mt-1">
                            {resultado.area}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            resultado.tipo === "pesquisador"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {resultado.tipo === "pesquisador"
                            ? "Pesquisador"
                            : "Empresa"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-700">
                    Nenhum resultado encontrado
                  </div>
                )}
              </div>
            )}
          </div>

          {/* PERFIL DO USUÁRIO NO HEADER */}
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow-md">
              <img
                src={imagemPerfil}
                alt="user"
                className="w-8 h-8 rounded-full mr-2 cursor-pointer object-cover"
                onClick={handleNavegarParaPerfil}
              />
              <span className="mr-2 cursor-default text-gray-700">{nome}</span>
              <button
                className="bg-[#990000] text-white px-3 py-1 rounded-md shadow-md hover:bg-red-700 cursor-pointer transition-colors"
                onClick={handleNavegarParaPerfil}
              >
                Ver Perfil
              </button>
            </div>
          </div>
        </header>

        {/* Card de Boas-vindas */}
        <div className="bg-white rounded-xl shadow-md p-6 flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-[#990000]">
              Bem-vindo(a), <span className="text-black">{nome}</span>
            </h1>
            <p className="text-bold text-[#990000] font-semibold text-lg">
              Encontre pesquisadores e empresas por tags e áreas de interesse
            </p>
          </div>
          <img
            src="/images/boasvindas.png"
            alt="Boas vindas"
            className="w-68 mr-20 cursor-default"
          />
        </div>

        {/* Resto da Home (Recomendações, Tags, Modais) mantido igual... */}
        <section className="relative">
          {/* ... Código do Swiper e Recomendações ... */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 cursor-default">
              Recomendações
            </h2>
            <button
              onClick={handleVerMaisPesquisadores}
              className="px-4 py-2 bg-white shadow-md rounded-lg hover:bg-gray-200 text-gray-700 cursor-pointer transition-colors"
            >
              Ver mais
            </button>
          </div>

          <div className="relative">
            <Swiper
              ref={swiperRef}
              spaceBetween={20}
              slidesPerView={4}
              modules={[Navigation, A11y]}
              className="pb-6"
            >
              {recomendacoes.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center relative hover:shadow-lg transition-shadow">
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button className="p-1 rounded-full bg-gray-100 hover:bg-blue-100 transition-colors cursor-pointer">
                        <Bookmark
                          className="w-5 h-5 text-gray-500 hover:text-blue-600"
                          onClick={() => handleBookmarkClick(item.usuarioId)}
                        />
                      </button>
                      <button className="p-1 rounded-full bg-gray-100 hover:bg-red-100 transition-colors cursor-pointer">
                        <Heart
                          className="w-5 h-5 text-gray-500 hover:text-red-600"
                          onClick={() => handleFavorito(item.id)}
                        />
                      </button>
                    </div>
                    <img
                      src="/images/user.png"
                      alt="user"
                      className="w-20 rounded-full mb-3 cursor-pointer"
                      onClick={() =>
                        router.push(`/pesquisadores/${item.usuarioId}`)
                      }
                    />
                    <h3 className="font-semibold text-gray-800 cursor-default">
                      {item.nome}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 cursor-default">
                      {item.area}
                    </p>
                    <div className="flex gap-2 mt-2 flex-wrap justify-center cursor-default">
                      {item.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-200 px-2 py-1 rounded-full border border-gray-300 text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="bg-gray-200 w-full h-0.5 my-3"></div>
                    <button
                      className="text-[#990000] font-semibold hover:underline transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedUser(item);
                        setModalOpen(true);
                      }}
                    >
                      Contato
                    </button>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <button
              onClick={goPrev}
              className="absolute top-1/2 -left-6 z-10 bg-white text-gray-700 px-3 py-3 rounded-full shadow-md hover:bg-gray-50 hover:text-[#990000] transform -translate-y-1/2"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goNext}
              className="absolute top-1/2 -right-6 z-10 bg-white text-gray-700 px-3 py-3 rounded-full shadow-md hover:bg-gray-50 hover:text-[#990000] transform -translate-y-1/2"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </section>

        <section className="mt-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 cursor-default">
              Tags Populares
            </h2>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 cursor-default">
            <div className="flex flex-wrap gap-3">
              {[
                "Desenvolvimento de Software",
                "Banco de Dados",
                "Inteligência Artificial",
                "Ciência de Dados",
                "Redes",
                "Segurança",
                "Cloud",
                "Mobile",
                "UX/UI",
                "DevOps",
              ].map((tag, index) => (
                <button
                  key={index}
                  onClick={() => setTermoBusca(tag)}
                  className="px-4 py-2 bg-gray-100 hover:bg-[#990000] hover:text-white text-gray-700 rounded-full transition-colors text-sm font-medium cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Modais (Contato e Bookmarks) */}
      {modalOpen && selectedUser && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 cursor-pointer"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-[#990000] mb-4">
              Contato com {selectedUser?.nome}
            </h2>
            <p className="mb-4 text-gray-700">
              Entre em contato através do email:{" "}
              <span className="font-semibold">
                {selectedUser.email || "projetolaverse@gmail.com"}
              </span>
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg"
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </button>
              <button className="px-4 py-2 bg-[#990000] text-white rounded-lg">
                Enviar Mensagem
              </button>
            </div>
          </div>
        </div>
      )}

      {modalOpen && !selectedUser && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[#990000]">Salvar em...</h2>
              <button onClick={() => setModalOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            {loadingModal ? (
              <p>Carregando...</p>
            ) : (
              <>
                <div className="flex flex-col text-gray-600 gap-2 max-h-40 overflow-y-auto mb-4">
                  {minhasListas.map((lista) => (
                    <button
                      key={lista.id}
                      onClick={() => handleAddToList(lista.id)}
                      className="w-full text-left p-2 rounded hover:bg-gray-100"
                    >
                      {lista.nomeLista}
                    </button>
                  ))}
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
