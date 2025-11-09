"use client";

import { useState, useEffect, useRef } from "react";
import LayoutWrapper from "../components/LayoutWrapper";
import {
  Search,
  X,
  User,
  Building,
  MapPin,
  Bookmark,
  Heart,
  Filter,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ResultadoBusca {
  id: number;
  nome: string;
  tipo: "pesquisador" | "empresa";
  area: string;
  localizacao?: string;
  tags?: string[];
  especialidades?: string[];
}

export default function Buscar() {
  const [termoBusca, setTermoBusca] = useState("");
  const [resultados, setResultados] = useState<ResultadoBusca[]>([]);
  const [resultadosFiltrados, setResultadosFiltrados] = useState<
    ResultadoBusca[]
  >([]);
  const [carregando, setCarregando] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<
    "todos" | "pesquisador" | "empresa"
  >("todos");
  const [filtroArea, setFiltroArea] = useState("todas");
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // 🔥 ADICIONE ESTE USEEFFECT
  useEffect(() => {
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

  const mockResultados: ResultadoBusca[] = [
    {
      id: 1,
      nome: "Dr. Carlos Silva",
      tipo: "pesquisador",
      area: "Inteligência Artificial",
      localizacao: "São Paulo, SP",
      tags: ["Machine Learning", "Deep Learning", "Python"],
      especialidades: ["AI", "Data Science"],
    },
    {
      id: 2,
      nome: "Tech Solutions Ltda",
      tipo: "empresa",
      area: "Desenvolvimento de Software",
      localizacao: "Curitiba, PR",
      tags: ["SaaS", "Cloud Computing", "Mobile"],
      especialidades: ["Tecnologia", "Inovação"],
    },
    {
      id: 3,
      nome: "Dra. Maria Santos",
      tipo: "pesquisador",
      area: "Ciência de Dados",
      localizacao: "Rio de Janeiro, RJ",
      tags: ["Big Data", "Python", "Estatística"],
      especialidades: ["Data Analysis", "BI"],
    },
    {
      id: 4,
      nome: "Inova Tech",
      tipo: "empresa",
      area: "Consultoria em TI",
      localizacao: "Belo Horizonte, MG",
      tags: ["Consultoria", "Digital Transformation", "IT"],
      especialidades: ["Consultoria", "Transformação Digital"],
    },
    {
      id: 5,
      nome: "Dr. João Pereira",
      tipo: "pesquisador",
      area: "Segurança da Informação",
      localizacao: "Porto Alegre, RS",
      tags: ["Cybersecurity", "Network Security", "Encryption"],
      especialidades: ["Security", "Networking"],
    },
  ];

  const areasUnicas = [...new Set(mockResultados.map((item) => item.area))];

  useEffect(() => {
    setResultados(mockResultados);
    setResultadosFiltrados(mockResultados);
  }, []);

  useEffect(() => {
    filtrarResultados();
  }, [termoBusca, filtroTipo, filtroArea, resultados]);

  const filtrarResultados = () => {
    let filtrados = resultados;

    if (filtroTipo !== "todos") {
      filtrados = filtrados.filter((item) => item.tipo === filtroTipo);
    }

    if (filtroArea !== "todas") {
      filtrados = filtrados.filter((item) => item.area === filtroArea);
    }

    if (termoBusca.trim()) {
      const termo = termoBusca.toLowerCase();
      filtrados = filtrados.filter(
        (item) =>
          item.nome.toLowerCase().includes(termo) ||
          item.area.toLowerCase().includes(termo) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(termo)) ||
          item.especialidades?.some((esp) =>
            esp.toLowerCase().includes(termo)
          ) ||
          item.localizacao?.toLowerCase().includes(termo)
      );
    }

    setResultadosFiltrados(filtrados);
  };

  const handleBuscar = async () => {
    if (!termoBusca.trim()) {
      setMostrarResultados(false);
      return;
    }

    setCarregando(true);
    setMostrarResultados(true);

    setTimeout(() => {
      filtrarResultados();
      setCarregando(false);
    }, 500);
  };

  const limparBusca = () => {
    setTermoBusca("");
    setMostrarResultados(false);
    setResultadosFiltrados(resultados);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBuscar();
    }
  };

  const handleCurtir = (id: number, tipo: string) => {
    const listaCurtidos = JSON.parse(localStorage.getItem("curtidos") || "[]");
    const itemId = `${tipo}-${id}`;

    if (listaCurtidos.includes(itemId)) {
      const novaLista = listaCurtidos.filter((item: string) => item !== itemId);
      localStorage.setItem("curtidos", JSON.stringify(novaLista));
    } else {
      listaCurtidos.push(itemId);
      localStorage.setItem("curtidos", JSON.stringify(listaCurtidos));
    }

    window.dispatchEvent(new Event("favoritosAtualizados"));
  };

  const handleSalvar = (id: number, tipo: string) => {
    const listaSalvos = JSON.parse(localStorage.getItem("salvos") || "[]");
    const itemId = `${tipo}-${id}`;

    if (listaSalvos.includes(itemId)) {
      const novaLista = listaSalvos.filter((item: string) => item !== itemId);
      localStorage.setItem("salvos", JSON.stringify(novaLista));
    } else {
      listaSalvos.push(itemId);
      localStorage.setItem("salvos", JSON.stringify(listaSalvos));
    }
  };

  const handleVerPerfil = (resultado: ResultadoBusca) => {
    if (resultado.tipo === "pesquisador") {
      router.push(`/perfilPesquisador/${resultado.id}`);
    } else {
      router.push(`/perfilEmpresa/${resultado.id}`);
    }
  };

  const isCurtido = (id: number, tipo: string) => {
    const listaCurtidos = JSON.parse(localStorage.getItem("curtidos") || "[]");
    return listaCurtidos.includes(`${tipo}-${id}`);
  };

  const isSalvo = (id: number, tipo: string) => {
    const listaSalvos = JSON.parse(localStorage.getItem("salvos") || "[]");
    return listaSalvos.includes(`${tipo}-${id}`);
  };

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

  return (
    <LayoutWrapper>
      <div className="p-4 md:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-[#990000] dark:text-red-400 mb-6">
            Buscar
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 mb-6">
            <div className="relative mb-4" ref={searchRef}>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por pesquisadores, empresas, tags, áreas..."
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#990000] dark:bg-gray-700 dark:text-white"
                  />
                  {termoBusca && (
                    <button
                      onClick={limparBusca}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
                <button
                  onClick={handleBuscar}
                  disabled={carregando}
                  className="bg-[#990000] text-white px-6 py-3 rounded-lg hover:bg-red-800 disabled:opacity-50 cursor-pointer"
                >
                  {carregando ? "Buscando..." : "Buscar"}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Filter className="text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  Filtrar por:
                </span>
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value as any)}
                  className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 dark:bg-gray-700 dark:text-white text-sm cursor-pointer"
                >
                  <option value="todos">Todos</option>
                  <option value="pesquisador">Pesquisadores</option>
                  <option value="empresa">Empresas</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={filtroArea}
                  onChange={(e) => setFiltroArea(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 dark:bg-gray-700 dark:text-white text-sm cursor-pointer"
                >
                  <option value="todas">Todas as áreas</option>
                  {areasUnicas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {mostrarResultados && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Resultados da busca {termoBusca && `para "${termoBusca}"`}
                  </h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {resultadosFiltrados.length} resultado(s) encontrado(s)
                  </span>
                </div>

                {carregando ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#990000] mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                      Buscando...
                    </p>
                  </div>
                ) : resultadosFiltrados.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {resultadosFiltrados.map((resultado) => (
                      <div
                        key={`${resultado.tipo}-${resultado.id}`}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`p-2 rounded-full ${
                                resultado.tipo === "pesquisador"
                                  ? "bg-blue-100 dark:bg-blue-900"
                                  : "bg-green-100 dark:bg-green-900"
                              }`}
                            >
                              {resultado.tipo === "pesquisador" ? (
                                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              ) : (
                                <Building className="w-5 h-5 text-green-600 dark:text-green-400" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {resultado.nome}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {resultado.area}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handleCurtir(resultado.id, resultado.tipo)
                              }
                              className={`p-1 rounded-full ${
                                isCurtido(resultado.id, resultado.tipo)
                                  ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                              } cursor-pointer`}
                            >
                              <Heart
                                className="w-4 h-4"
                                fill={
                                  isCurtido(resultado.id, resultado.tipo)
                                    ? "currentColor"
                                    : "none"
                                }
                              />
                            </button>
                            <button
                              onClick={() =>
                                handleSalvar(resultado.id, resultado.tipo)
                              }
                              className={`p-1 rounded-full ${
                                isSalvo(resultado.id, resultado.tipo)
                                  ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                              } cursor-pointer`}
                            >
                              <Bookmark
                                className="w-4 h-4"
                                fill={
                                  isSalvo(resultado.id, resultado.tipo)
                                    ? "currentColor"
                                    : "none"
                                }
                              />
                            </button>
                          </div>
                        </div>

                        {resultado.localizacao && (
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            {resultado.localizacao}
                          </div>
                        )}

                        {resultado.tags && resultado.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {resultado.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {resultado.tags.length > 3 && (
                              <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                                +{resultado.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        <button
                          onClick={() => handleVerPerfil(resultado)}
                          className="w-full mt-2 bg-[#990000] text-white py-2 rounded-lg hover:bg-red-800 transition-colors cursor-pointer"
                        >
                          Ver Perfil
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">
                      Nenhum resultado encontrado para sua busca.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {!mostrarResultados && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Sugestões de busca
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Inteligência Artificial",
                  "Data Science",
                  "Desenvolvimento Web",
                  "Cloud Computing",
                  "Machine Learning",
                  "UX/UI Design",
                ].map((sugestao) => (
                  <button
                    key={sugestao}
                    onClick={() => {
                      setTermoBusca(sugestao);
                      handleBuscar();
                    }}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm cursor-pointer"
                  >
                    {sugestao}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </LayoutWrapper>
  );
}
