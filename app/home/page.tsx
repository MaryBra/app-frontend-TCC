"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import LayoutWrapper from "../components/LayoutWrapper";
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
import { useUser } from "../contexts/UserContext";

interface Recomendacao {
  id: number;
  nome: string;
  area: string;
  tags?: string[];
}

interface ResultadoBusca {
  id: number;
  nome: string;
  tipo: string;
  area: string;
  tags?: string[];
}

export default function Home() {
  const router = useRouter();
  const { userData, loading: userLoading, refreshUserData } = useUser();

  // 🔥 ADICIONE ESTE USEEFFECT
  useEffect(() => {
    // Garantir que o tema seja aplicado corretamente
    const html = document.documentElement;
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      html.classList.add("dark");
      html.style.colorScheme = "dark";
      document.body.style.backgroundColor = "#111827";
    } else {
      html.classList.remove("dark");
      html.style.colorScheme = "light";
      document.body.style.backgroundColor = "#ffffff";
    }
  }, []);

  const [termoBusca, setTermoBusca] = useState("");
  const [resultadosBusca, setResultadosBusca] = useState<ResultadoBusca[]>([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [carregandoBusca, setCarregandoBusca] = useState(false);
  const [nomeExibicao, setNomeExibicao] = useState("Usuário");
  const searchRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<any>(null);

  const [recomendacoes, setRecomendacoes] = useState<Recomendacao[]>([
    {
      id: 1,
      nome: "Dr. Carlos Silva",
      area: "Inteligência Artificial",
      tags: ["AI", "Machine Learning", "Deep Learning"],
    },
    {
      id: 2,
      nome: "Dra. Maria Santos",
      area: "Ciência de Dados",
      tags: ["Data Science", "Python", "Big Data"],
    },
    {
      id: 3,
      nome: "Dr. João Pereira",
      area: "Segurança da Informação",
      tags: ["Cybersecurity", "Networking", "Firewall"],
    },
    {
      id: 4,
      nome: "Dra. Ana Oliveira",
      area: "Desenvolvimento Web",
      tags: ["React", "Node.js", "JavaScript"],
    },
    {
      id: 5,
      nome: "Dr. Pedro Costa",
      area: "Mobile Development",
      tags: ["Flutter", "Dart", "iOS"],
    },
    {
      id: 6,
      nome: "Dra. Julia Rodrigues",
      area: "Cloud Computing",
      tags: ["AWS", "Azure", "DevOps"],
    },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Recomendacao | null>(null);

  // Garantir que o tema seja aplicado corretamente
  useEffect(() => {
    const html = document.documentElement;
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark" && !html.classList.contains("dark")) {
      html.classList.add("dark");
      html.style.colorScheme = "dark";
    } else if (savedTheme === "light" && html.classList.contains("dark")) {
      html.classList.remove("dark");
      html.style.colorScheme = "light";
    }
  }, []);

  useEffect(() => {
    if (userData) {
      let nomeParaExibir =
        userData.pesquisador?.nomeCompleto ||
        userData.nome ||
        userData.login ||
        "Usuário";

      setNomeExibicao(nomeParaExibir);
    } else {
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData);
        const nomeFallback =
          parsedData.pesquisador?.nomeCompleto ||
          parsedData.nome ||
          parsedData.login ||
          "Usuário";
        setNomeExibicao(nomeFallback);
      } else {
        const email = localStorage.getItem("email");
        setNomeExibicao(email || "Usuário");
      }
    }
  }, [userData]);

  useEffect(() => {
    refreshUserData();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setMostrarResultados(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleBuscar = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!termoBusca.trim()) {
      setMostrarResultados(false);
      setResultadosBusca([]);
      return;
    }

    setCarregandoBusca(true);
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
        console.error("Erro na busca");
        const resultadosMock = recomendacoes
          .filter(
            (item) =>
              item.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
              item.area.toLowerCase().includes(termoBusca.toLowerCase()) ||
              (item.tags &&
                item.tags.some((tag) =>
                  tag.toLowerCase().includes(termoBusca.toLowerCase())
                ))
          )
          .map((item) => ({
            id: item.id,
            nome: item.nome,
            tipo: "pesquisador",
            area: item.area,
            tags: item.tags,
          }));
        setResultadosBusca(resultadosMock);
        setMostrarResultados(true);
      }
    } catch (error) {
      console.error("Erro ao buscar:", error);
      const resultadosMock = recomendacoes
        .filter(
          (item) =>
            item.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
            item.area.toLowerCase().includes(termoBusca.toLowerCase()) ||
            (item.tags &&
              item.tags.some((tag) =>
                tag.toLowerCase().includes(termoBusca.toLowerCase())
              ))
        )
        .map((item) => ({
          id: item.id,
          nome: item.nome,
          tipo: "pesquisador",
          area: item.area,
          tags: item.tags,
        }));
      setResultadosBusca(resultadosMock);
      setMostrarResultados(true);
    } finally {
      setCarregandoBusca(false);
    }
  };

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

  const limparBusca = () => {
    setTermoBusca("");
    setMostrarResultados(false);
    setResultadosBusca([]);
  };

  const handleSelecionarResultado = (resultado: ResultadoBusca) => {
    if (resultado.tipo === "pesquisador") {
      router.push(`/perfilPesquisador/${resultado.id}`);
    } else if (resultado.tipo === "empresa") {
      router.push(`/perfilEmpresa/${resultado.id}`);
    }
    setMostrarResultados(false);
    setTermoBusca("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBuscar();
    }
  };

  const goNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const goPrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleCurtir = (id: number) => {
    const listaCurtidos = JSON.parse(localStorage.getItem("curtidos") || "[]");
    if (listaCurtidos.includes(id)) {
      const novaLista = listaCurtidos.filter((itemId: number) => itemId !== id);
      localStorage.setItem("curtidos", JSON.stringify(novaLista));
    } else {
      listaCurtidos.push(id);
      localStorage.setItem("curtidos", JSON.stringify(listaCurtidos));
    }
  };

  const handleSalvarLista = (id: number) => {
    const listaSalvos = JSON.parse(localStorage.getItem("salvos") || "[]");
    if (listaSalvos.includes(id)) {
      const novaLista = listaSalvos.filter((itemId: number) => itemId !== id);
      localStorage.setItem("salvos", JSON.stringify(novaLista));
    } else {
      listaSalvos.push(id);
      localStorage.setItem("salvos", JSON.stringify(listaSalvos));
    }
  };

  if (userLoading) {
    return (
      <LayoutWrapper>
        <div className="flex items-center justify-center h-full bg-white dark:bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#990000] mx-auto"></div>
            <p className="text-xl mt-4 dark:text-white">Carregando...</p>
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <div className="p-4 md:p-6 bg-white dark:bg-gray-900 min-h-screen">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-1/2" ref={searchRef}>
            <div className="flex items-center bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-md w-full">
              <Search className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Buscar por recrutador, pesquisa, tags..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 outline-none cursor-text dark:bg-gray-800 dark:text-white"
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
                onClick={() => handleBuscar()}
                disabled={carregandoBusca}
                className="ml-2 bg-[#990000] text-white px-4 py-1 rounded-md hover:bg-red-700 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
              >
                {carregandoBusca ? "..." : "Buscar"}
              </button>
            </div>

            {mostrarResultados && (
              <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 mt-1 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
                {resultadosBusca.length > 0 ? (
                  resultadosBusca.map((resultado) => (
                    <div
                      key={`${resultado.tipo}-${resultado.id}`}
                      className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors"
                      onClick={() => handleSelecionarResultado(resultado)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {resultado.nome}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {resultado.area}
                          </p>
                          {resultado.tags && resultado.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {resultado.tags.slice(0, 3).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                              {resultado.tags.length > 3 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  +{resultado.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            resultado.tipo === "pesquisador"
                              ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300"
                              : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
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
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    Nenhum resultado encontrado para "{termoBusca}"
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-md w-full md:w-auto">
              <img
                src={userData?.fotoPerfil || "/images/user.png"}
                alt="user"
                className="w-8 h-8 rounded-full mr-2 cursor-pointer object-cover"
                onClick={() => router.push("/telaPerfil")}
                onError={(e) => {
                  e.currentTarget.src = "/images/user.png";
                }}
              />
              <span className="mr-2 cursor-default text-sm md:text-base dark:text-white">
                {nomeExibicao}
              </span>
              <button
                className="bg-[#990000] text-white px-3 py-1 rounded-md shadow-md hover:bg-red-700 cursor-pointer transition-colors text-sm md:text-base"
                onClick={() => router.push("/telaPerfil")}
              >
                Ver Perfil
              </button>
            </div>
          </div>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6 flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 max-w-7xl mx-auto">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-4xl font-bold mb-2 text-[#990000] dark:text-red-400">
              Bem-vindo(a),{" "}
              <span className="text-black dark:text-white">{nomeExibicao}</span>
            </h1>
            <p className="text-bold text-[#990000] dark:text-red-400 font-semibold text-base md:text-lg">
              Encontre pesquisadores e empresas por tags e áreas de interesse
            </p>
          </div>
          <img
            src="/images/boasvindas.png"
            alt="Boas vindas"
            className="w-48 md:w-68 cursor-default"
          />
        </div>

        <section className="relative mb-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white cursor-default">
              Recomendações
            </h2>
            <button
              className="px-4 py-2 bg-white dark:bg-gray-800 shadow-md rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer transition-colors text-sm md:text-base"
              onClick={() => console.log("Ver mais clicado")}
            >
              Ver mais
            </button>
          </div>

          <div className="relative">
            <Swiper
              ref={swiperRef}
              spaceBetween={16}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              modules={[Navigation, A11y]}
              className="pb-6"
              a11y={{
                prevSlideMessage: "Slide anterior",
                nextSlideMessage: "Próximo slide",
              }}
            >
              {recomendacoes.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex flex-col items-center relative hover:shadow-lg transition-shadow cursor-default h-full">
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button
                        className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors cursor-pointer"
                        onClick={() => handleSalvarLista(item.id)}
                      >
                        <Bookmark className="w-5 h-5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400" />
                      </button>
                      <button
                        className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900 transition-colors cursor-pointer"
                        onClick={() => handleCurtir(item.id)}
                      >
                        <Heart className="w-5 h-5 text-gray-500 hover:text-red-600 dark:hover:text-red-400" />
                      </button>
                    </div>

                    <img
                      src="/images/user.png"
                      alt="user"
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full mb-3 cursor-pointer object-cover"
                      onClick={() =>
                        router.push(`/perfilPesquisador/${item.id}`)
                      }
                    />
                    <h3 className="font-semibold text-gray-800 dark:text-white cursor-default text-center text-sm md:text-base">
                      {item.nome}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 cursor-default text-center">
                      {item.area}
                    </p>
                    <div className="flex gap-2 mt-2 flex-wrap justify-center cursor-default">
                      {item.tags &&
                        item.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 cursor-default"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-700 w-full h-0.5 my-3 cursor-default"></div>

                    <button
                      className="text-[#990000] dark:text-red-400 font-semibold hover:underline transition-colors cursor-pointer text-sm md:text-base"
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
              className="absolute top-1/2 -left-2 md:-left-6 z-10 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-2 md:p-3 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-[#990000] dark:hover:text-red-400 cursor-pointer transition-all duration-200 transform -translate-y-1/2"
              aria-label="Slide anterior"
            >
              <ChevronLeft size={16} className="md:w-5 md:h-5" />
            </button>
            <button
              onClick={goNext}
              className="absolute top-1/2 -right-2 md:-right-6 z-10 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-2 md:p-3 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-[#990000] dark:hover:text-red-400 cursor-pointer transition-all duration-200 transform -translate-y-1/2"
              aria-label="Próximo slide"
            >
              <ChevronRight size={16} className="md:w-5 md:h-5" />
            </button>
          </div>
        </section>

        <section className="mt-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white cursor-default">
              Tags Populares
            </h2>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6 cursor-default">
            <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
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
                  className="px-3 py-1.5 md:px-4 md:py-2 bg-gray-100 dark:bg-gray-700 hover:bg-[#990000] hover:text-white text-gray-700 dark:text-gray-300 rounded-full transition-colors text-xs md:text-sm font-medium cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 cursor-pointer p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg w-full max-w-sm md:max-w-md cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-[#990000] dark:text-red-400 mb-4">
              Contato com {selectedUser?.nome}
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400 text-sm md:text-base">
              Aqui você pode abrir o chat ou enviar mensagem para{" "}
              {selectedUser?.nome}.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer text-sm md:text-base"
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </button>
              <button className="px-4 py-2 bg-[#990000] text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer text-sm md:text-base">
                Enviar Mensagem
              </button>
            </div>
          </div>
        </div>
      )}
    </LayoutWrapper>
  );
}
