"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MenuLateral from "@/app/components/MenuLateral";
import { Search, User, Bookmark, Heart, X, ListPlus } from "lucide-react";

// --- 1. Define as Interfaces ---
interface Resultado {
  id: number;
  nome: string;
  tipo: "pesquisador" | "empresa";
  area: string;
  tags: string[];
}

// --- 2. Define o Componente do Card de Resultado ---
const ResultadoCard = ({ resultado, onBookmarkClick }: { resultado: Resultado, onBookmarkClick: () => void }) => {
    const router = useRouter();

    const nomeParts = resultado.nome.split(' ');
    const primeiroNome = nomeParts[0];
    const restoDoNome = nomeParts.slice(1).join(' ');

    const handleClick = () => {
        const path = resultado.tipo === "pesquisador" 
            ? `/pesquisadores/${resultado.id+9}` // Rota correta para perfil
            : `/perfilEmpresa/${resultado.id}`;
        router.push(path);
    };

    const handleFavorito = async (id) => {
        const token = localStorage.getItem("token");

        if(!token){
            console.error("Usuário não logado. Redirecionando...");
            router.push("/login");
            return;
        }

        try{
            const response = await fetch(
                `http://localhost:8080/api/favoritos/salvarFavorito`,
                {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    "pesquisadorId": id
                })
                }
            )

            if(!response.ok){
                throw new Error(`Falha ao salvar seguidor. Status: ${response.status}`);
            }

            const novoSeguidor = await response.json();
            console.log("Seguidor salvo:", novoSeguidor);
        }catch(err){
            console.error("Erro ao seguir perfil:", err);
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center relative hover:shadow-lg transition-shadow">
            {/* Botões de ação */}
            <div className="absolute top-3 right-3 flex gap-2">
                <button className="p-1 rounded-full bg-gray-100 hover:bg-blue-100 transition-colors cursor-pointer">
                    <Bookmark className="w-5 h-5 text-gray-500 hover:text-blue-600"
                    onClick={onBookmarkClick} />
                </button>
                <button className="p-1 rounded-full bg-gray-100 hover:bg-red-100 transition-colors cursor-pointer">
                    <Heart className="w-5 h-5 text-gray-500 hover:text-red-600" 
                    onClick={() => handleFavorito(resultado.id)}/>
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

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [modalOpen, setModalOpen] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
    const [minhasListas, setMinhasListas] = useState([]);
    const [novoNomeLista, setNovoNomeLista] = useState("");


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
    }, [query, router]);

    const handleFilterChange = (filtro: "todos" | "pesquisador" | "empresa") => {
        setFiltroAtivo(filtro);
        setCurrentPage(1);
    }

    const handleBookmarkClick = async (profileId: number) => {
        setSelectedProfileId(profileId); // Guarda qual perfil estamos adicionando
        setLoadingModal(true);
        setModalOpen(true);
        setNovoNomeLista(""); // Limpa o input

        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }

        try {
            // Busca as listas customizadas do usuário
            const res = await fetch("http://localhost:8080/api/listas/listarListas", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Falha ao buscar listas");
            const data = await res.json();
            setMinhasListas(data); // Salva as listas no estado (ex: [{id: 1, nomeLista: "..."}])
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
                    headers: { "Authorization": `Bearer ${token}` }
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
            // 1. Cria a nova lista
            const resCreate = await fetch("http://localhost:8080/api/listas/salvarLista", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ nomeLista: novoNomeLista })
            });
            if (!resCreate.ok) throw new Error("Falha ao criar lista");
            
            const novaLista = await resCreate.json(); // { id, nomeLista, ... }
            
            // 2. Adiciona o perfil à lista recém-criada
            await handleAddToList(novaLista.id);
            
            setNovoNomeLista(""); // Limpa o input
        } catch (err) {
            console.error(err);
            alert("Erro ao criar nova lista.");
        }
    };

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
            return true;
        }
        return resultado.tipo === filtroAtivo;
    });

    const totalPages = Math.ceil(resultadosFiltrados.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentItems = resultadosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

    const nextPage = () => {
        if(currentPage < totalPages){
            setCurrentPage(prev => prev + 1);
        }
    };

    const prevPage = () => {
        if(currentPage > 1){
            setCurrentPage(prev => prev - 1);
        }
    }

    // --- 4. Renderização Final ---
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
                        onClick={() => handleFilterChange('todos')}
                        className={filtroAtivo === 'todos' 
                            ? "py-2 px-4 text-red-700 border-b-2 border-red-700 font-semibold" 
                            : "py-2 px-4 text-gray-500 hover:text-gray-800"}
                    >
                        Todos
                    </button>
                    <button 
                        onClick={() => handleFilterChange('empresa')}
                        className={filtroAtivo === 'empresa' 
                            ? "py-2 px-4 text-red-700 border-b-2 border-red-700 font-semibold" 
                            : "py-2 px-4 text-gray-500 hover:text-gray-800"}
                    >
                        Empresas
                    </button>
                    <button 
                        onClick={() => handleFilterChange('pesquisador')}
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
                    
                    {!carregandoResultados && resultadosFiltrados.length === 0 && (
                        <p>Nenhum resultado encontrado para este filtro.</p>
                    )}
                    {!carregandoResultados && resultadosFiltrados.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {currentItems.map(resultado => (
                                <ResultadoCard 
                                    key={`${resultado.tipo}-${resultado.id}`} 
                                    resultado={resultado}
                                    // 👇 PASSE A FUNÇÃO PARA O CARD
                                    onBookmarkClick={() => handleBookmarkClick(resultado.id)}
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
                            className="px-4 py-2 bg-white rounded-md shadow disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Anterior
                        </button>
                        <span className="text-gray-700">
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-white rounded-md shadow disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Próxima
                        </button>
                    </div>
                )}
            </main>

            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-[#990000]">Salvar em...</h2>
                            <button onClick={() => setModalOpen(false)}>
                                <X className="w-5 h-5 text-gray-500 hover:text-black" />
                            </button>
                        </div>
                        
                        {loadingModal ? (
                            <p>Carregando listas...</p>
                        ) : (
                            <>
                                {/* Lista de Listas Existentes */}
                                <div className="flex flex-col gap-2 max-h-40 overflow-y-auto mb-4">
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
                                        <p className="text-sm text-gray-500">Nenhuma lista customizada encontrada.</p>
                                    )}
                                </div>

                                {/* Criar Nova Lista */}
                                <div className="border-t pt-4 flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Criar nova lista..."
                                        value={novoNomeLista}
                                        onChange={(e) => setNovoNomeLista(e.target.value)}
                                        className="flex-1 w-full border px-3 py-2 rounded"
                                    />
                                    <button
                                        onClick={handleCreateAndAddToList}
                                        className="p-2 rounded bg-[#990000] text-white hover:bg-red-800"
                                        title="Criar e adicionar"
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