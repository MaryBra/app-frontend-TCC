"use client";

import { useState, useEffect } from "react";
import LayoutWrapper from "../components/LayoutWrapper";
import {
  Search,
  Filter,
  User,
  MapPin,
  Mail,
  Bookmark,
  Heart,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Pesquisador {
  id: number;
  nome: string;
  area: string;
  instituicao: string;
  localizacao: string;
  email: string;
  tags: string[];
  especialidades: string[];
  curtido: boolean;
  salvo: boolean;
}

export default function Pesquisadores() {
  const [pesquisadores, setPesquisadores] = useState<Pesquisador[]>([]);
  const [pesquisadoresFiltrados, setPesquisadoresFiltrados] = useState<
    Pesquisador[]
  >([]);
  const [termoBusca, setTermoBusca] = useState("");
  const [filtroArea, setFiltroArea] = useState("todas");
  const [carregando, setCarregando] = useState(true);
  const [showAddToList, setShowAddToList] = useState<number | null>(null);
  const [listas, setListas] = useState<any[]>([]);
  const router = useRouter();

  const mockPesquisadores: Pesquisador[] = [
    {
      id: 1,
      nome: "Dr. Carlos Silva",
      area: "Inteligência Artificial",
      instituicao: "Universidade de São Paulo",
      localizacao: "São Paulo, SP",
      email: "carlos.silva@usp.br",
      tags: ["Machine Learning", "Deep Learning", "Python", "TensorFlow"],
      especialidades: ["AI", "Computer Vision", "NLP"],
      curtido: false,
      salvo: false,
    },
    {
      id: 2,
      nome: "Dra. Maria Santos",
      area: "Ciência de Dados",
      instituicao: "Universidade Federal do Rio de Janeiro",
      localizacao: "Rio de Janeiro, RJ",
      email: "maria.santos@ufrj.br",
      tags: ["Big Data", "Python", "Estatística", "SQL"],
      especialidades: ["Data Analysis", "Business Intelligence", "Analytics"],
      curtido: true,
      salvo: false,
    },
    {
      id: 3,
      nome: "Dr. João Pereira",
      area: "Segurança da Informação",
      instituicao: "Universidade Estadual de Campinas",
      localizacao: "Campinas, SP",
      email: "joao.pereira@unicamp.br",
      tags: ["Cybersecurity", "Networking", "Cryptography"],
      especialidades: ["Security", "Network Protection", "Encryption"],
      curtido: false,
      salvo: true,
    },
    {
      id: 4,
      nome: "Dra. Ana Oliveira",
      area: "Desenvolvimento Web",
      instituicao: "Universidade Federal de Minas Gerais",
      localizacao: "Belo Horizonte, MG",
      email: "ana.oliveira@ufmg.br",
      tags: ["React", "Node.js", "JavaScript", "TypeScript"],
      especialidades: ["Frontend", "Backend", "Full Stack"],
      curtido: false,
      salvo: false,
    },
    {
      id: 5,
      nome: "Dr. Pedro Costa",
      area: "Mobile Development",
      instituicao: "Universidade de Brasília",
      localizacao: "Brasília, DF",
      email: "pedro.costa@unb.br",
      tags: ["Flutter", "React Native", "iOS", "Android"],
      especialidades: ["Mobile", "Cross-platform", "UI/UX"],
      curtido: false,
      salvo: false,
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      const pesquisadoresComEstado = mockPesquisadores.map((p) => ({
        ...p,
        curtido:
          localStorage.getItem("curtidos")?.includes(`pesquisador-${p.id}`) ||
          false,
        salvo:
          localStorage.getItem("salvos")?.includes(`pesquisador-${p.id}`) ||
          false,
      }));
      setPesquisadores(pesquisadoresComEstado);
      setPesquisadoresFiltrados(pesquisadoresComEstado);
      setCarregando(false);
    }, 1000);

    const listasSalvas = localStorage.getItem("listasPersonalizadas");
    if (listasSalvas) {
      setListas(JSON.parse(listasSalvas));
    }
  }, []);

  useEffect(() => {
    filtrarPesquisadores();
  }, [termoBusca, filtroArea, pesquisadores]);

  const filtrarPesquisadores = () => {
    let filtrados = pesquisadores;

    if (filtroArea !== "todas") {
      filtrados = filtrados.filter((p) => p.area === filtroArea);
    }

    if (termoBusca.trim()) {
      const termo = termoBusca.toLowerCase();
      filtrados = filtrados.filter(
        (p) =>
          p.nome.toLowerCase().includes(termo) ||
          p.area.toLowerCase().includes(termo) ||
          p.instituicao.toLowerCase().includes(termo) ||
          p.tags.some((tag) => tag.toLowerCase().includes(termo)) ||
          p.especialidades.some((esp) => esp.toLowerCase().includes(termo))
      );
    }

    setPesquisadoresFiltrados(filtrados);
  };

  const handleCurtir = (id: number) => {
    const listaCurtidos = JSON.parse(localStorage.getItem("curtidos") || "[]");
    const itemId = `pesquisador-${id}`;

    let novaLista;
    if (listaCurtidos.includes(itemId)) {
      novaLista = listaCurtidos.filter((item: string) => item !== itemId);
    } else {
      novaLista = [...listaCurtidos, itemId];
    }

    localStorage.setItem("curtidos", JSON.stringify(novaLista));

    setPesquisadores((prev) =>
      prev.map((p) => (p.id === id ? { ...p, curtido: !p.curtido } : p))
    );

    window.dispatchEvent(new Event("favoritosAtualizados"));
  };

  const handleSalvar = (id: number) => {
    const listaSalvos = JSON.parse(localStorage.getItem("salvos") || "[]");
    const itemId = `pesquisador-${id}`;

    let novaLista;
    if (listaSalvos.includes(itemId)) {
      novaLista = listaSalvos.filter((item: string) => item !== itemId);
    } else {
      novaLista = [...listaSalvos, itemId];
    }

    localStorage.setItem("salvos", JSON.stringify(novaLista));

    setPesquisadores((prev) =>
      prev.map((p) => (p.id === id ? { ...p, salvo: !p.salvo } : p))
    );
  };

  const handleAdicionarLista = (pesquisadorId: number, listaId: number) => {
    const listasAtualizadas = listas.map((lista) => {
      if (lista.id === listaId) {
        const itemId = `pesquisador-${pesquisadorId}`;
        if (!lista.itens.includes(itemId)) {
          return {
            ...lista,
            itens: [...lista.itens, itemId],
            count: lista.count + 1,
          };
        }
      }
      return lista;
    });

    setListas(listasAtualizadas);
    localStorage.setItem(
      "listasPersonalizadas",
      JSON.stringify(listasAtualizadas)
    );
    setShowAddToList(null);
  };

  const handleContato = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const areasUnicas = [...new Set(pesquisadores.map((p) => p.area))];

  if (carregando) {
    return (
      <LayoutWrapper>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#990000] mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Carregando pesquisadores...
            </p>
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-[#990000] dark:text-red-400 mb-6">
            Pesquisadores
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar pesquisadores por nome, área, tags..."
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#990000] dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="text-gray-400" />
                <select
                  value={filtroArea}
                  onChange={(e) => setFiltroArea(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded px-3 py-3 dark:bg-gray-700 dark:text-white cursor-pointer"
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

            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                {pesquisadoresFiltrados.length} pesquisador(es) encontrado(s)
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pesquisadoresFiltrados.map((pesquisador) => (
                <div
                  key={pesquisador.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-all bg-white dark:bg-gray-800 relative"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[#990000] rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {pesquisador.nome}
                        </h3>
                        <p className="text-sm text-[#990000] dark:text-red-400">
                          {pesquisador.area}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleCurtir(pesquisador.id)}
                        className={`p-2 rounded-full ${
                          pesquisador.curtido
                            ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        } cursor-pointer`}
                      >
                        <Heart
                          className="w-4 h-4"
                          fill={pesquisador.curtido ? "currentColor" : "none"}
                        />
                      </button>
                      <button
                        onClick={() => handleSalvar(pesquisador.id)}
                        className={`p-2 rounded-full ${
                          pesquisador.salvo
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        } cursor-pointer`}
                      >
                        <Bookmark
                          className="w-4 h-4"
                          fill={pesquisador.salvo ? "currentColor" : "none"}
                        />
                      </button>
                      <button
                        onClick={() =>
                          setShowAddToList(
                            showAddToList === pesquisador.id
                              ? null
                              : pesquisador.id
                          )
                        }
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {showAddToList === pesquisador.id && (
                    <div className="absolute top-16 right-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10 p-2 min-w-48">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 px-2">
                        Adicionar à lista:
                      </p>
                      {listas.length > 0 ? (
                        listas.map((lista) => (
                          <button
                            key={lista.id}
                            onClick={() =>
                              handleAdicionarLista(pesquisador.id, lista.id)
                            }
                            className="w-full text-left px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded cursor-pointer"
                          >
                            {lista.nome}
                          </button>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 px-2 py-1">
                          Nenhuma lista criada
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      {pesquisador.instituicao}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      {pesquisador.localizacao}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {pesquisador.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {pesquisador.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                          +{pesquisador.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        router.push(`/perfilPesquisador/${pesquisador.id}`)
                      }
                      className="flex-1 bg-[#990000] text-white py-2 px-4 rounded-lg hover:bg-red-800 transition-colors text-sm cursor-pointer"
                    >
                      Ver Perfil
                    </button>
                    <button
                      onClick={() => handleContato(pesquisador.email)}
                      className="flex items-center justify-center p-2 border border-[#990000] text-[#990000] dark:text-red-400 rounded-lg hover:bg-[#990000] hover:text-white transition-colors cursor-pointer"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {pesquisadoresFiltrados.length === 0 && (
              <div className="text-center py-12">
                <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhum pesquisador encontrado
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Tente ajustar seus filtros ou termos de busca.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
