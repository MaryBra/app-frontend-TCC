"use client";

import { useState, useEffect } from "react";
import { Bookmark, Heart, List } from "lucide-react";
import MenuLateral from "../components/MenuLateral";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Importe o router

// Interface para o objeto da lista que a UI vai usar
interface ListaDisplay {
  id: number | string; // ID pode ser número (custom) ou string ("favoritos")
  nome: string;
  count: number;
  icone: JSX.Element;
}

export default function GerenciarListas() {
  const router = useRouter();
  
  // O estado agora começa vazio e será preenchido pela API
  const [listas, setListas] = useState<ListaDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [novoNome, setNovoNome] = useState("");

  // --- 1. BUSCAR DADOS DAS APIs ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    const usuarioId = localStorage.getItem("usuarioId");

    if (!token || !usuarioId) {
      console.error("Usuário não logado. Redirecionando...");
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };

      try {
        // Prepara as duas chamadas de API
        const fetchListasCustom = fetch(`http://localhost:8080/api/listas/listarListas`, { headers });
        const fetchFavoritos = fetch(`http://localhost:8080/api/favoritos/usuario/${usuarioId}/favorito`, { headers });

        // Executa em paralelo
        const [resListas, resFavoritos] = await Promise.all([fetchListasCustom, fetchFavoritos]);

        if (!resListas.ok || !resFavoritos.ok) {
          throw new Error("Falha ao buscar dados das listas ou favoritos");
        }

        const listasData = await resListas.json(); // Array de ListaDTO
        const favoritosData = await resFavoritos.json(); // Array de Favorito

        // 1. Objeto Fixo de Favoritos
        const listaFavoritos: ListaDisplay = {
          id: "favoritos", // ID especial para o link
          nome: "Favoritos",
          count: favoritosData.length, // Contagem real
          icone: <Heart className="text-red-500" />
        };

        // 2. Listas Customizadas da API
        // (Assumindo que sua API /listarListas retorna um array de {id, nome, count})
        const listasCustomizadas: ListaDisplay[] = listasData.map(lista => ({
          id: lista.id,
          nome: lista.nomeLista,
          count: lista.perfisSalvos ? lista.perfisSalvos.length : 0, // Ajuste 'count' se o nome da propriedade for outro
          icone: <List />
        }));

        // 3. Junta tudo e atualiza o estado
        setListas([listaFavoritos, ...listasCustomizadas]);

      } catch (err) {
        console.error("Erro ao carregar listas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);


  const adicionarLista = async () => {
    if (novoNome.trim() === "") return;
    
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:8080/api/listas/salvarLista`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ nomeLista: novoNome })
      });

      if (!res.ok) {
        throw new Error("Falha ao criar a lista");
      }

      const listaSalva = await res.json(); // A nova lista (ex: {id: 4, nome: "..."})

      // Cria o objeto de UI para a nova lista
      const novaLista: ListaDisplay = {
        id: listaSalva.id,
        nome: listaSalva.nomeLista,
        count: 0, // Novas listas começam com 0
        icone: <List />,
      };

      // Adiciona a nova lista ao estado e fecha o modal
      setListas(listasAnteriores => [...listasAnteriores, novaLista]);
      setNovoNome("");
      setShowModal(false);

    } catch (err) {
      console.error("Erro ao salvar lista:", err);
      alert("Erro ao salvar a lista.");
    }
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

        {/* Listas (Agora dinâmicas) */}
        {loading ? (
          <p className="text-gray-500">Carregando listas...</p>
        ) : (
          <div className="flex flex-col gap-4">
            {listas.map((lista) => (
              <Link
                key={lista.id}
                // O href agora funciona para /lista/favoritos e /lista/2
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
        )}
      </div>

      {/* Modal (sem alteração) */}
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