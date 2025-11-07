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
  User,
  Heart,
  Bookmark,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  // Estados para busca
  const [termoBusca, setTermoBusca] = useState("");
  const [resultadosBusca, setResultadosBusca] = useState([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [dados, setDados] = useState(null);
  const [nome, setNome] = useState(null);
  const searchRef = useRef(null);
  const swiperRef = useRef(null);

  // Simulação de usuário logado
  const usuario = {
    nome: nome,
    tipoPerfil: "pesquisador",
  };

  // Mock - Recomendações
  const [recomendacoes, setRecomendacoes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    
  }, []);

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
            "Authorization": `Bearer ${token}`
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
        console.error("Erro na busca");
        // Fallback para dados mockados em caso de erro
        const resultadosMock = recomendacoes.filter(
          (item) =>
            item.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
            item.area.toLowerCase().includes(termoBusca.toLowerCase()) ||
            (item.tags &&
              item.tags.some((tag) =>
                tag.toLowerCase().includes(termoBusca.toLowerCase())
              ))
        );
        setResultadosBusca(resultadosMock);
        setMostrarResultados(true);
      }
    } catch (error) {
      console.error("Erro ao buscar:", error);
      // Fallback para dados mockados
      const resultadosMock = recomendacoes.filter(
        (item) =>
          item.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
          item.area.toLowerCase().includes(termoBusca.toLowerCase()) ||
          (item.tags &&
            item.tags.some((tag) =>
              tag.toLowerCase().includes(termoBusca.toLowerCase())
            ))
      );
      setResultadosBusca(resultadosMock);
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

  useEffect(() => {
    const handleBuscarUsuario = async () =>{
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("userEmail");
      console.log(token)

      if (!token || !email) {
        console.error("Usuário não logado. Redirecionando...");
        router.push("/login"); // Exemplo: redireciona se não estiver logado
        return;
      }

      setCarregando(true);

      try {
        const response = await fetch(
          // FIX: Use a variável 'email' direto na URL
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

        handleDadosPesquisador(dadosUsuario.id);
        handleRecomendacao(dadosUsuario.id);
    } catch(err){
      console.error("Erro ao buscar perfil:", err);
    } finally {
        setCarregando(false); // Opcional
    }
  }

  const handleDadosPesquisador = async (id) => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Usuário não logado. Redirecionando...");
        router.push("/login");
        return;
      }

      setCarregando(true);

      try {
        const response = await fetch(
          // FIX: Use a variável 'email' direto na URL
          `http://localhost:8080/api/dadosPesquisador/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Falha ao buscar dados do pesquisador");
        }

        const dadosPesquisador = await response.json();

        // const jsonData = {
        // usuario: { id: parseInt(dadosPesquisador.pesquisador.usuario.id) },  // Troque por id do usuário logado se tiver auth
        // nomePesquisador: dadosPesquisador.pesquisador.nomePesquisador,
        // sobrenome: dadosPesquisador.pesquisador.sobrenome,
        // dataNascimento: null,
        // nomeCitacoesBibliograficas: dadosPesquisador.pesquisador.nomePesquisador + dadosPesquisador.pesquisador.sobrenome,
        // dataAtualizacao: dadosPesquisador.pesquisador.dataAtualizacao,
        // horaAtualizacao: "10:00:00",
        // nacionalidade: dadosPesquisador.pesquisador.nacionalidade,
        // paisNascimento: dadosPesquisador.pesquisador.paisNascimento,
        // lattesId: null
        // };

        // setDados(jsonData);

        localStorage.setItem("idTag", dadosPesquisador.pesquisador.id)
        console.log(dadosPesquisador)
        setNome(dadosPesquisador.pesquisador.nomePesquisador)
      } catch(err){
        console.error("Erro ao buscar perfil:", err);
      } finally {
          setCarregando(false); // Opcional
      }
    }

    const handleRecomendacao = async (id) =>{
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("userEmail");
      console.log(token)

      if (!token || !email) {
        console.error("Usuário não logado. Redirecionando...");
        router.push("/login"); // Exemplo: redireciona se não estiver logado
        return;
      }

      setCarregando(true);

      try {
        const response = await fetch(
          // FIX: Use a variável 'email' direto na URL
          `http://localhost:8080/api/recomendacoes`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const recomendacao = await response.json();

        setRecomendacoes(recomendacao)

        if (!response.ok) {
          throw new Error("Falha ao buscar dados do usuario");
        }

    } catch(err){
      console.error("Erro ao buscar perfil:", err);
    } finally {
        setCarregando(false); // Opcional
    }
  }

    handleBuscarUsuario();
  }, [router]);

  useEffect(() => {
    
  }, [router])

  const limparBusca = () => {
    setTermoBusca("");
    setMostrarResultados(false);
    setResultadosBusca([]);
  };

  const handleSelecionarResultado = (resultado) => {
    if (resultado.tipo === "pesquisador") {
      router.push(`/perfilPesquisador/${resultado.id}`);
    } else if (resultado.tipo === "empresa") {
      router.push(`/perfilEmpresa/${resultado.id}`);
    }
    setMostrarResultados(false);
    setTermoBusca("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleBuscar();
    }
  };

  // Funções para as setas do carrossel
  const goNext = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const goPrev = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  if (!nome) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p className="text-xl">Carregando dados do usuário...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Menu lateral fixo */}
      <MenuLateral />

      {/* Conteúdo principal */}
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
                className="flex-1 outline-none cursor-text"
              />
              {termoBusca && (
                <button
                  type="button"
                  onClick={limparBusca}
                  className="text-gray-500 hover:text-gray-700 ml-2 cursor-pointer transition-colors"
                >
                  <X size={16} />
                </button>
              )}
              <button
                type="button"
                onClick={handleBuscar}
                disabled={carregando}
                className="ml-2 bg-[#990000] text-white px-4 py-1 rounded-md hover:bg-red-700 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
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
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                      onClick={() => handleSelecionarResultado(resultado)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {resultado.nome}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {resultado.area}
                          </p>
                          {resultado.tags && resultado.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {resultado.tags.slice(0, 3).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                              {resultado.tags.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{resultado.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
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
                  <div className="p-4 text-center text-gray-500">
                    Nenhum resultado encontrado para "{termoBusca}"
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow-md">
              <img
                src="/images/user.png"
                alt="user"
                className="w-8 rounded-full mr-2 cursor-pointer"
                onClick={() =>
                  router.push(
                    usuario.tipoPerfil === "empresa"
                      ? "/perfilEmpresa"
                      : "/telaPerfil"
                  )
                }
              />
              <span className="mr-2 cursor-default">{usuario.nome}</span>
              <button
                className="bg-[#990000] text-white px-3 py-1 rounded-md shadow-md hover:bg-red-700 cursor-pointer transition-colors"
                onClick={() =>
                  router.push(
                    usuario.tipoPerfil === "empresa"
                      ? "/perfilEmpresa"
                      : "/telaPerfil"
                  )
                }
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
              Bem-vindo(a), <span className="text-black">{usuario.nome}</span>
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

        {/* Recomendações */}
        <section className="relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 cursor-default">
              Recomendações
            </h2>
            <button className="px-4 py-2 bg-white shadow-md rounded-lg hover:bg-gray-200 text-gray-700 cursor-pointer transition-colors">
              Ver mais
            </button>
          </div>

          {/* Carrossel com setas funcionais */}
          <div className="relative">
            <Swiper
              ref={swiperRef}
              spaceBetween={20}
              slidesPerView={4}
              modules={[Navigation, A11y]}
              className="pb-6"
              a11y={{
                prevSlideMessage: "Slide anterior",
                nextSlideMessage: "Próximo slide",
              }}
            >
              {recomendacoes.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center relative hover:shadow-lg transition-shadow cursor-default">
                    {/* Botões de ação */}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button className="p-1 rounded-full bg-gray-100 hover:bg-blue-100 transition-colors cursor-pointer">
                        <Bookmark className="w-5 h-5 text-gray-500 hover:text-blue-600" />
                      </button>
                      <button className="p-1 rounded-full bg-gray-100 hover:bg-red-100 transition-colors cursor-pointer">
                        <Heart className="w-5 h-5 text-gray-500 hover:text-red-600" />
                      </button>
                    </div>

                    <img
                      src="/images/user.png"
                      alt="user"
                      className="w-20 rounded-full mb-3 cursor-pointer"
                      onClick={() =>
                        router.push(`/perfilPesquisador/${item.id}`)
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
                          className="text-xs bg-gray-200 px-2 py-1 rounded-full border border-gray-300 text-gray-700 cursor-default"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="bg-gray-200 w-full h-0.5 my-3 cursor-default"></div>

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

            {/* Botões de navegação customizados e funcionais */}
            <button
              onClick={goPrev}
              className="absolute top-1/2 -left-6 z-10 bg-white text-gray-700 px-3 py-3 rounded-full shadow-md hover:bg-gray-50 hover:text-[#990000] cursor-pointer transition-all duration-200 transform -translate-y-1/2"
              aria-label="Slide anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goNext}
              className="absolute top-1/2 -right-6 z-10 bg-white text-gray-700 px-3 py-3 rounded-full shadow-md hover:bg-gray-50 hover:text-[#990000] cursor-pointer transition-all duration-200 transform -translate-y-1/2"
              aria-label="Próximo slide"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </section>

        {/* Seção de Tags Populares */}
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
                "Redes de Computadores",
                "Segurança da Informação",
                "Cloud Computing",
                "Mobile Development",
                "UX/UI Design",
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

      {/* Modal de contato */}
      {modalOpen && (
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
            <p className="mb-4 text-gray-600">
              Aqui você pode abrir o chat ou enviar mensagem para{" "}
              {selectedUser?.nome}.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </button>
              <button className="px-4 py-2 bg-[#990000] text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer">
                Enviar Mensagem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
