"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import MenuLateral from "../../components/MenuLateral";
import {
  Heart,
  Bookmark,
  Trash2,
  X,
  User,
  Building,
  MapPin,
  Mail,
} from "lucide-react";
import { useSidebar } from "../../contexts/SidebarContext";

interface ItemLista {
  id: string;
  tipo: "pesquisador" | "empresa";
  nome: string;
  area: string;
  localizacao?: string;
  email?: string;
  tags?: string[];
}

// Mock data fora do componente
const pesquisadoresMock = [
  {
    id: "pesquisador-1",
    tipo: "pesquisador" as const,
    nome: "Dr. Carlos Silva",
    area: "Inteligência Artificial",
    localizacao: "São Paulo, SP",
    email: "carlos.silva@usp.br",
    tags: ["Machine Learning", "Deep Learning", "Python"],
  },
  {
    id: "pesquisador-2",
    tipo: "pesquisador" as const,
    nome: "Dra. Maria Santos",
    area: "Ciência de Dados",
    localizacao: "Rio de Janeiro, RJ",
    email: "maria.santos@ufrj.br",
    tags: ["Big Data", "Python", "Estatística"],
  },
  {
    id: "pesquisador-3",
    tipo: "pesquisador" as const,
    nome: "Dr. João Pereira",
    area: "Segurança da Informação",
    localizacao: "Campinas, SP",
    email: "joao.pereira@unicamp.br",
    tags: ["Cybersecurity", "Networking"],
  },
];

const empresasMock = [
  {
    id: "empresa-1",
    tipo: "empresa" as const,
    nome: "Tech Solutions Ltda",
    area: "Desenvolvimento de Software",
    localizacao: "Curitiba, PR",
    email: "contato@techsolutions.com",
    tags: ["SaaS", "Cloud Computing", "Mobile"],
  },
  {
    id: "empresa-2",
    tipo: "empresa" as const,
    nome: "Inova Tech",
    area: "Consultoria em TI",
    localizacao: "Belo Horizonte, MG",
    email: "contato@inovatech.com",
    tags: ["Consultoria", "Digital Transformation"],
  },
];

export default function ListaPage() {
  const { id } = useParams();
  const router = useRouter();
  const [itens, setItens] = useState<ItemLista[]>([]);
  const [listaInfo, setListaInfo] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [nomeLista, setNomeLista] = useState("");
  const { isCollapsed, isMobile } = useSidebar();

  const mainMargin = isCollapsed
    ? isMobile
      ? "ml-0"
      : "md:ml-20"
    : "md:ml-64";

  useEffect(() => {
    carregarLista();
  }, [id]);

  const criarItemMock = (itemId: string): ItemLista | null => {
    const [tipo, itemIdNum] = itemId.split("-");

    if (tipo === "pesquisador") {
      return pesquisadoresMock.find((p) => p.id === itemId) || null;
    } else if (tipo === "empresa") {
      return empresasMock.find((e) => e.id === itemId) || null;
    }
    return null;
  };

  const carregarLista = () => {
    const listasSalvas = localStorage.getItem("listasPersonalizadas");
    const curtidos = JSON.parse(localStorage.getItem("curtidos") || "[]");

    if (id === "1") {
      // Lista de Favoritos
      setListaInfo({
        id: 1,
        nome: "Favoritos",
        count: curtidos.length,
        cor: "#dc2626",
      });

      const itensFavoritos = curtidos
        .map((itemId: string) => {
          return criarItemMock(itemId);
        })
        .filter(Boolean) as ItemLista[];

      setItens(itensFavoritos);
    } else {
      // Listas personalizadas
      if (listasSalvas) {
        const listas = JSON.parse(listasSalvas);
        const lista = listas.find((l: any) => l.id === parseInt(id as string));

        if (lista) {
          setListaInfo(lista);
          setNomeLista(lista.nome);

          const itensLista = lista.itens
            .map((itemId: string) => {
              return criarItemMock(itemId);
            })
            .filter(Boolean) as ItemLista[];

          setItens(itensLista);
        }
      }
    }
  };

  const removerItem = (itemId: string) => {
    if (id === "1") {
      // Remover dos favoritos
      const curtidos = JSON.parse(localStorage.getItem("curtidos") || "[]");
      const novaLista = curtidos.filter((item: string) => item !== itemId);
      localStorage.setItem("curtidos", JSON.stringify(novaLista));
    } else {
      // Remover de lista personalizada
      const listasSalvas = localStorage.getItem("listasPersonalizadas");
      if (listasSalvas) {
        const listas = JSON.parse(listasSalvas);
        const listaIndex = listas.findIndex(
          (l: any) => l.id === parseInt(id as string)
        );

        if (listaIndex !== -1) {
          listas[listaIndex].itens = listas[listaIndex].itens.filter(
            (item: string) => item !== itemId
          );
          listas[listaIndex].count = listas[listaIndex].itens.length;
          localStorage.setItem("listasPersonalizadas", JSON.stringify(listas));
        }
      }
    }

    setItens((prev) => prev.filter((item) => item.id !== itemId));
    window.dispatchEvent(new Event("favoritosAtualizados"));
  };

  const excluirLista = () => {
    if (id !== "1") {
      const listasSalvas = localStorage.getItem("listasPersonalizadas");
      if (listasSalvas) {
        const listas = JSON.parse(listasSalvas);
        const novaLista = listas.filter(
          (l: any) => l.id !== parseInt(id as string)
        );
        localStorage.setItem("listasPersonalizadas", JSON.stringify(novaLista));
      }
    }
    router.push("/gerenciarListas");
  };

  const handleContato = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleVerPerfil = (item: ItemLista) => {
    const itemId = item.id.split("-")[1];
    if (item.tipo === "pesquisador") {
      router.push(`/perfilPesquisador/${itemId}`);
    } else {
      router.push(`/perfilEmpresa/${itemId}`);
    }
  };

  if (!listaInfo) {
    return (
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        <MenuLateral />
        <main
          className={`flex-1 transition-all duration-300 ease-in-out ${mainMargin} w-full min-h-screen flex items-center justify-center`}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#990000] mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Carregando lista...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <MenuLateral />

      <div
        className={`flex-1 bg-gray-100 dark:bg-gray-900 p-6 transition-all duration-300 ease-in-out ${mainMargin}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#990000] dark:text-red-400">
                {listaInfo.nome}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {itens.length} itens na lista
              </p>
            </div>
            <div className="flex gap-2">
              {id !== "1" && (
                <>
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-white dark:bg-gray-800 p-2 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                    title="Editar lista"
                  >
                    <Bookmark className="text-[#990000] dark:text-red-400" />
                  </button>
                  <button className="bg-white dark:bg-gray-800 p-2 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer">
                    <Heart className="text-red-600" />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {itens.map((item) => (
              <div
                key={item.id}
                className="relative bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
              >
                <button
                  onClick={() => removerItem(item.id)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900 transition cursor-pointer"
                  title="Remover da lista"
                >
                  <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600 dark:hover:text-red-400" />
                </button>

                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                    item.tipo === "pesquisador"
                      ? "bg-blue-100 dark:bg-blue-900"
                      : "bg-green-100 dark:bg-green-900"
                  }`}
                >
                  {item.tipo === "pesquisador" ? (
                    <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Building className="w-8 h-8 text-green-600 dark:text-green-400" />
                  )}
                </div>

                <h2 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {item.nome}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {item.area}
                </p>

                {item.localizacao && (
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    {item.localizacao}
                  </div>
                )}

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 justify-center my-2">
                    {item.tags.slice(0, 2).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 2 && (
                      <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                        +{item.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex gap-2 w-full mt-auto">
                  <button
                    onClick={() => handleVerPerfil(item)}
                    className="flex-1 bg-[#990000] text-white py-1 px-2 rounded text-xs hover:bg-red-800 transition-colors cursor-pointer"
                  >
                    Ver Perfil
                  </button>
                  {item.email && (
                    <button
                      onClick={() => handleContato(item.email!)}
                      className="p-1 border border-[#990000] text-[#990000] dark:text-red-400 rounded hover:bg-[#990000] hover:text-white transition-colors cursor-pointer"
                    >
                      <Mail className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {itens.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Lista vazia
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {id === "1"
                    ? "Nenhum item favoritado ainda."
                    : "Adicione itens a esta lista para vê-los aqui."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center border-b dark:border-gray-700 px-4 py-3">
              <h2 className="text-lg font-bold text-[#990000] dark:text-red-400">
                Editar lista
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome da lista
              </label>
              <input
                type="text"
                value={nomeLista}
                onChange={(e) => setNomeLista(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-4 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />

              <button
                onClick={excluirLista}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-800 transition mb-6 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Excluir Lista
              </button>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 text-white hover:bg-gray-400 dark:hover:bg-gray-500 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded bg-[#990000] text-white hover:bg-red-800 transition cursor-pointer"
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
