"use client"

import { useState, useEffect } from "react";
import {
    Trash2,
    Star,
    Search,
    UploadCloud,
    Settings,
    Target,
    LogOut,
    LayoutDashboard,
    UserRound,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export default function EditProfileForm() { 
// estado de exemplo
    const searchParams = useSearchParams();
    const tagsParam = searchParams.get("tags");
    const [idTag, setIdTag] = useState(""); 
    const initialTags = tagsParam ? tagsParam.split(",") : [];
    const [tags, setTags] = useState<string[]>(initialTags);
    const [newTag, setNewTag] = useState("");
    const [academics, setAcademics] = useState([
        { id: 1, titulo: "Formação", ano: "Ano", descricao: "Descrição" },
    ]);

    const router = useRouter();

    const [nome, setNome] = useState("Nome");
    const [sobrenome, setSobrenome] = useState("Sobrenome");
    const [especialidade, setEspecialidade] = useState("Especialidade");
    const [telefone, setTelefone] = useState("(41) 99999‑9999");
    const [email, setEmail] = useState("projetolaverse@gmail.com");
    const [originalLogin, setOriginalLogin] = useState("");
    const [nacionalidade, setNacionalidade] = useState("Brasileiro");

    const addTag = () => {
        if (newTag.trim()) {
            setTags((t) => [...t, newTag.trim()]);
            setNewTag("");
        }
    };
    const removeTag = (i: number) => setTags((t) => t.filter((_, idx) => idx !== i));
    const removeAcad = (id: number) => setAcademics((a) => a.filter((x) => x.id !== id));
    const token = localStorage.getItem("token");
    const usuarioId = localStorage.getItem("usuarioId");
    const pesquisadorId = localStorage.getItem("idPesquisador");
    const emailAtual = localStorage.getItem("email");

    const atualizarTags = (id: number) => {
        return fetch(`http://localhost:8080/api/tags/alterarTag/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            listaTags: tags
          })
        })
    }

    const atualizarPesquisador = (id: number) => {
        const dadosAtualizados = {
            nomePesquisador: nome,
            sobrenome: sobrenome,
            nacionalidade: nacionalidade,
            ocupacao: especialidade
        };
        return fetch(`http://localhost:8080/api/pesquisadores/alterarPesquisador/${id}`,{
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(dadosAtualizados)
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Falha ao atualizar pesquisador');
            }
            return res;
        })
    }

    const atualizarLogin = () => {
        return fetch(`http://localhost:8080/api/usuarios/alterarLogin`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                novoLogin: email
            })
        }).then(res => {
                if(!res.ok){
                    throw new Error('Falha ao atualizar login');
                }
                return res;
        })
    }

    const handleSubmit = async () => {
        const loginFoiAlterado = (email !== originalLogin);

        try{

            const promessasDeAtualizacao = [
                atualizarTags(Number(idTag)),
                atualizarPesquisador(Number(pesquisadorId))
            ];
            if (loginFoiAlterado) {
                promessasDeAtualizacao.push(atualizarLogin());
            }

            await Promise.all(promessasDeAtualizacao);
            
            if (loginFoiAlterado) {

                localStorage.removeItem("token");
                localStorage.removeItem("usuarioId");
                localStorage.removeItem("tipo_usuario");

                localStorage.setItem("email", email)
                
                alert("Informações salvas! Como seu login foi alterado, por favor, faça login novamente.");
                router.push(`/login`);
            } else {
                alert("Informações salvas com sucesso!");
                router.push(`/pesquisadores/${pesquisadorId}`);
            }
        }catch(err){
            console.error("Falha ao salvar as atualizações:", err);
            alert("Erro ao salvar. Por favor, tente novamente.");
        }
    }

    useEffect(() => {
        const handleDadosPesquisador = async () => {

            if (!token) {
                console.error("Usuário não logado. Redirecionando...");
                router.push("/login");
                return;
            }

            try {
                const response = await fetch(
                // FIX: Use a variável 'email' direto na URL
                `http://localhost:8080/api/dadosPesquisador/${usuarioId}`,
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

                localStorage.setItem("idPesquisador", dadosPesquisador.pesquisador.id)
                console.log(dadosPesquisador)
                setNome(dadosPesquisador.pesquisador.nomePesquisador);
                setSobrenome(dadosPesquisador.pesquisador.sobrenome)
                setTags(dadosPesquisador.tags.listaTags);
                setEmail(emailAtual);
                setOriginalLogin(emailAtual);
                setNacionalidade(dadosPesquisador.pesquisador.nacionalidade);
                if(dadosPesquisador.pesquisador.ocupacao != null){
                    setEspecialidade(dadosPesquisador.pesquisador.ocupacao);
                }
                setIdTag(dadosPesquisador.tags.id)
            } catch(err){
                console.error("Erro ao buscar perfil:", err);
            } 
        }

        handleDadosPesquisador();
    }, [router])
      

    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-20 bg-white fixed left-0 top-0 h-screen flex flex-col items-center py-4 shadow-md">
                {/* Logo */}
                <div className="mb-10">
                    <Image
                        src="/images/logo.png"
                        alt="Logo"
                        width={50}
                        height={50}
                        quality={100}
                        priority
                    />
                </div>

                {/* Ícones do Menu */}
                <nav className="flex flex-col gap-6 mt-auto mb-4">
                    <button className="text-black hover:text-gray-600">
                        <Target size={28} />
                    </button>
                    <button className="text-black hover:text-gray-600">
                        <LayoutDashboard size={28} />
                    </button>
                    <hr className="border-gray-300 w-8 mx-auto" />
                    <button className="text-black hover:text-gray-600">
                        <Settings size={28} />
                    </button>
                    <button className="text-black hover:text-gray-600">
                        <LogOut size={28} />
                    </button>
                </nav>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto bg-transparent rounded-lg p-8 space-y-8">

                    {/* Seção de Avatar + Campos */}
                    <div className="flex flex-col md:flex-row md:items-start md:space-x-12">
                        {/* Avatar */}
                        <div className="flex-shrink-0 flex flex-col items-center -mt-4">
                            <div className="w-32 h-32 bg-gray-200 rounded-full relative">
                                <UserRound size={100} className="text-gray-400 m-auto mt-6" />
                                <button className="absolute bottom-0 right-0 bg-red-700 text-white p-2 rounded-full shadow">
                                    <UploadCloud size={16} />
                                </button>
                            </div>
                        </div>
                        {/* Título + Campos de Nome e Especialidade */}
                        <div className="flex-1 space-y-4">
                            <h1 className="text-xl font-semibold text-red-700">Editar Perfil</h1>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Nome</label>
                                <input
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 bg-white"
                                />
                                <label className="block text-sm font-medium text-gray-600">Sobrenome</label>
                                <input
                                    type="text"
                                    value={sobrenome}
                                    onChange={(e) => setSobrenome(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Especialidade</label>
                                <input
                                    type="text"
                                    value={especialidade}
                                    onChange={(e) => setEspecialidade(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Tags</label>
                        <div className="flex items-center space-x-2 mb-2">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                placeholder="Adicionar tag"
                                className="w-90 border border-gray-300 rounded px-3 py-2 bg-white"
                            />
                            <button
                                onClick={addTag}
                                className="bg-red-700 text-white p-2 rounded shadow"
                            >
                                <Search size={16} />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, i) => (
                                <span
                                    key={i}
                                    className="bg-gray-100 border border-gray-300 rounded-full px-3 py-1 flex items-center space-x-1"
                                >
                                    <span className="text-sm text-black">{tag}</span>
                                    <button onClick={() => removeTag(i)}>
                                        <Trash2 size={14} className="text-red-700" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Informações de Contato */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-medium text-gray-700">Informações de Contato</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600">Telefone</label>
                                <input
                                    type="text"
                                    value={telefone}
                                    onChange={(e) => setTelefone(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600">Endereço</label>
                                <input
                                    type="text"
                                    defaultValue="Curitiba, PR"
                                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600">Nacionalidade</label>
                                <input
                                    type="text"
                                    value={nacionalidade}
                                    onChange={(e) => setNacionalidade(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 bg-white"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Formação Acadêmica */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-medium text-gray-700">Formação Acadêmica</h2>
                        <div className="space-y-4">
                            {academics.map((acad) => (
                                <div
                                    key={acad.id}
                                    className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-start">
                                        <div className="md:col-span-5">
                                            <label className="block text-sm text-gray-600">Título</label>
                                            <input
                                                type="text"
                                                defaultValue={acad.titulo}
                                                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 bg-white"
                                            />
                                        </div>

                                        <div className="md:col-span-1">
                                            <label className="block text-sm text-gray-600">Ano</label>
                                            <input
                                                type="text"
                                                defaultValue={acad.ano}
                                                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 bg-white"
                                            />
                                        </div>

                                        <div className="md:col-span-1 flex flex-col items-center justify-start space-y-2">
                                            <button
                                                onClick={() => removeAcad(acad.id)}
                                                className="bg-red-700 text-white p-2 rounded-full hover:bg-red-800 transition"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full transition">
                                                <Star size={18} />
                                            </button>
                                        </div>

                                        <div className="md:col-span-6">
                                            <label className="block text-sm text-gray-600">Descrição</label>
                                            <textarea
                                                defaultValue={acad.descricao}
                                                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 bg-white"
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Botões de Ação */}
                    <div className="flex justify-end space-x-4 mt-4">
                        <button className="px-6 py-2 border border-gray-400 rounded text-gray-700 hover:bg-gray-50"
                        onClick={() => {
                            router.push(`/pesquisadores/${pesquisadorId}`)
                        }}>
                            Cancelar
                        </button>
                        <button 
                            className="px-6 py-2 bg-red-700 text-white rounded shadow hover:bg-red-800"
                            onClick={() => {
                                handleSubmit();
                            }}
                        >
                            Gravar
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}