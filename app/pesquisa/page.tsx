"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MenuLateral from "@/app/components/MenuLateral";
import { Search, User, Bookmark, Heart, X } from "lucide-react";

// --- 1. Define as Interfaces ---
interface Resultado {
  id: number;
  nome: string;
  tipo: "pesquisador" | "empresa";
  area: string;
  tags: string[];
}

// --- 2. Define o Componente do Card de Resultado ---
const ResultadoCard = ({ resultado }: { resultado: Resultado }) => {
    const router = useRouter();

    const nomeParts = resultado.nome.split(' ');
    const primeiroNome = nomeParts[0];
    const restoDoNome = nomeParts.slice(1).join(' ');

    const handleClick = () => {
        const path = resultado.tipo === "pesquisador" 
            ? `/pesquisadores/${resultado.id}` // Rota correta para perfil
            : `/perfilEmpresa/${resultado.id}`;
        router.push(path);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center relative hover:shadow-lg transition-shadow">
            {/* Botões de ação */}
            <div className="absolute top-3 right-3 flex gap-2">
                <button className="p-1 rounded-full bg-gray-100 hover:bg-blue-100 transition-colors cursor-pointer">
                    <Bookmark className="w-5 h-5 text-gray-500 hover:text-blue-600" />
                </button>
                <button className="p-1 rounded-full bg-gray-100 hover:bg-red-100 transition-colors cursor-pointer">
                    <Heart className="w-5 h-5 text-gray-500 hover:text-red-600" />
                </button>
            </div>

            {/* Imagem Placeholder */}
            <div 
                onClick={handleClick}
                className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-3 cursor-pointer"
            >
                <User size={40} className="text-gray-400" />
            </div>

            {/* Nome e Subtítulo */}
            <h3 onClick={handleClick} className="font-semibold text-gray-800 cursor-pointer">{primeiroNome}</h3>
            <p onClick={handleClick} className="text-gray-500 text-sm mb-4 cursor-pointer">{restoDoNome}</p>
            
            <div className="bg-gray-200 w-full h-0.5 my-1"></div>

            {/* Botão Contato */}
            <button
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

    const [resultados, setResultados] = useState<Resultado[]>([]);
    const [carregandoResultados, setCarregandoResultados] = useState(true);
    
    // Estados para o cabeçalho
    const [termoBusca, setTermoBusca] = useState(query || "");
    const [nome, setNome] = useState(null);

    const [filtroAtivo, setFiltroAtivo] = useState<'todos' | 'pesquisador' | 'empresa'>('todos');

    // Efeito para buscar o NOME DO USUÁRIO (para o cabeçalho)
    useEffect(() => {
        const handleBuscarUsuario = async () =>{
            const token = localStorage.getItem("token");
            const email = localStorage.getItem("email");

            if (!token || !email) {
                router.push("/login"); 
                return;
            }

            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            };

            try {
                const response = await fetch(
                    `http://localhost:8080/api/usuarios/listarUsuario/${email}`,
                    { headers }
                );
                if (!response.ok) throw new Error("Falha ao buscar usuário");
                const dadosUsuario = await response.json();

                if(dadosUsuario.tipoUsuario.name === "PESQUISADOR"){
                    const respPesq = await fetch(
                        `http://localhost:8080/api/dadosPesquisador/${dadosUsuario.id}`,
                        { headers }
                    );
                    if (!respPesq.ok) throw new Error("Falha ao buscar pesquisador");
                    const dadosPesquisador = await respPesq.json();
                    setNome(dadosPesquisador.pesquisador.nomePesquisador);
                } else {
                    // Adicione a lógica para empresa se necessário
                    const respEmp = await fetch(
                        `http://localhost:8080/api/empresas/listarEmpresa/${dadosUsuario.id}`,
                        { headers }
                    );
                    if (!respEmp.ok) throw new Error("Falha ao buscar empresa");
                    const dadosEmpresa = await respEmp.json();
                    setNome(dadosEmpresa.nomeRegistro);
                }
            } catch(err) {
                console.error("Erro ao buscar perfil do usuário:", err);
            }
        };

        handleBuscarUsuario();
    }, [router]);

    // Efeito para buscar os RESULTADOS DA PESQUISA (baseado no 'query' da URL)
    useEffect(() => {
        if (!query) {
            setCarregandoResultados(false);
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchResultados = async () => {
            setCarregandoResultados(true);
            try {
                const response = await fetch("http://localhost:8080/api/pesquisa/buscar", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        termo: query,
                        tipo: "todos",
                    }),
                });

                if (!response.ok) {
                    throw new Error("Falha ao buscar resultados");
                }
                const dados = await response.json();
                setResultados(dados);

            } catch (error) {
                console.error("Erro ao buscar:", error);
            } finally {
                setCarregandoResultados(false);
            }
        };

        fetchResultados();
    }, [query, router]); // Re-busca se a query ou o router mudarem

    // Funções para o cabeçalho
    const handleNovaBusca = () => {
        if (termoBusca.trim()) {
            router.push(`/pesquisa?q=${encodeURIComponent(termoBusca.trim())}`);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleNovaBusca();
        }
    };

    const resultadosFiltrados = resultados.filter(resultado => {
        if (filtroAtivo === 'todos') {
            return true; // Mostra todos
        }
        return resultado.tipo === filtroAtivo;
    });

    // --- 4. Renderização Final ---
    return (
        <div className="flex h-screen bg-gray-100">
            <MenuLateral />

            <main className="flex-1 ml-20 p-8 overflow-y-auto">

                {/* --- O CABEÇALHO QUE VOCÊ QUERIA --- */}
                <header className="flex justify-between items-center mb-6">
                    {/* Barra de Pesquisa */}
                    <div className="relative w-1/2">
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
                                    onClick={() => setTermoBusca("")}
                                    className="text-gray-500 hover:text-gray-700 ml-2 cursor-pointer transition-colors"
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

                    {/* Botão de Perfil */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow-md">
                            <img
                                src="/images/user.png" // Seu placeholder
                                alt="user"
                                className="w-8 rounded-full mr-2 cursor-pointer"
                                onClick={() => router.push("/meu-perfil")} // Ajuste a rota
                            />
                            <span className="mr-2 cursor-default">{nome || "Carregando..."}</span>
                            <button
                                className="bg-[#990000] text-white px-3 py-1 rounded-md shadow-md hover:bg-red-700"
                                onClick={() => router.push("/meu-perfil")} // Ajuste a rota
                            >
                                Ver Perfil
                            </button>
                        </div>
                    </div>
                </header>
                {/* --- FIM DO CABEÇALHO --- */}


                {/* Conteúdo dos Resultados */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Resultados da busca para "{query}"
                    </h1>
                </div>

                <div className="flex border-b border-gray-300 mb-6">
                    <button 
                        onClick={() => setFiltroAtivo('todos')}
                        className={filtroAtivo === 'todos' 
                            ? "py-2 px-4 text-red-700 border-b-2 border-red-700 font-semibold" 
                            : "py-2 px-4 text-gray-500 hover:text-gray-800"}
                    >
                        Todos
                    </button>
                    <button 
                        onClick={() => setFiltroAtivo('empresa')}
                        className={filtroAtivo === 'empresa' 
                            ? "py-2 px-4 text-red-700 border-b-2 border-red-700 font-semibold" 
                            : "py-2 px-4 text-gray-500 hover:text-gray-800"}
                    >
                        Empresas
                    </button>
                    <button 
                        onClick={() => setFiltroAtivo('pesquisador')}
                        className={filtroAtivo === 'pesquisador' 
                            ? "py-2 px-4 text-red-700 border-b-2 border-red-700 font-semibold" 
                            : "py-2 px-4 text-gray-500 hover:text-gray-800"}
                    >
                        Pesquisadores
                    </button>
                </div>

                {/* O GRID DE RESULTADOS */}
                <div className="max-w-full">
                    {carregandoResultados && <p>Carregando...</p>}
                    
                    {!carregandoResultados && resultados.length === 0 && (
                        <p>Nenhum resultado encontrado para este filtro.</p>
                    )}

                    {!carregandoResultados && resultados.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {resultadosFiltrados.map(resultado => (
                                <ResultadoCard key={`${resultado.tipo}-${resultado.id}`} resultado={resultado} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}