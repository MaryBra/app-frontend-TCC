"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Home, User, Settings, LogOut, LayoutDashboard, Target, Pencil } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";


export default function ProfileScreen() {
    const searchParams = useSearchParams();
    const tagsParam = searchParams.get("tags");
    const idTag = searchParams.get("idTag");
    const router = useRouter();
    const [nome, setNome] = useState("Nome Completo");
    const especialidade = searchParams.get("especialidade") || "Especialidade";
    const [paisNascimento, setPaisNascimento] = useState("País");
    const [dataAtualizacao, setDataAtualizacao] = useState("");
    const [horaAtualizacao, setHoraAtualizacao] = useState("");
    const [aberto, setAberto] = useState(false);
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [formacao, setFormacao] = useState<any[]>([]);

    const tags = tagsParam ? tagsParam.split(",") : [];

    const [destaques, setDestaques] = useState<any[]>([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/pesquisadores/listarPesquisadores")
        .then((res) => res.json())
        .then((data) => {
            if (Array.isArray(data)) {
            const pesquisador = data.find((p) => p.id == Number(idTag));
            if (pesquisador) {
                setNome(`${pesquisador.nomePesquisador} ${pesquisador.sobrenome}`);
                setPaisNascimento(pesquisador.paisNascimento || "Não informado");
                setDataAtualizacao(pesquisador.dataAtualizacao || "");
                setHoraAtualizacao(pesquisador.horaAtualizacao || "");
            }
            }
        })
        .catch((err) => console.error("Erro ao buscar perfil:", err));
    }, [idTag]);

    useEffect(() => {
        fetch("http://localhost:8080/api/enderecos/listarEnderecos")
        .then((res) => res.json())
        .then((data) => {
            setEmail(data.email || "");
            setTelefone(data.telefone || "");
        })
        .catch((err) => console.error("Erro ao buscar endereço:", err))
    }, []);

    useEffect(() => {
        fetch("http://localhost:8080/premiacoes/listarPremiacoes")
        .then((res) => res.json())
        .then((data) => setDestaques(data))
        .catch((err) => console.error("Erro ao buscar destaques:", err));
    }, []);

    useEffect(() => {
        fetch("http://localhost:8080/formacoes/listarFormacoes")
        .then((res) => res.json())
        .then((data) => setFormacao(data))
        .catch((err) => console.error("Erro ao buscar formação:", err));
    }, []);

    return (
        <div className="flex h-screen bg-gray-100">
        {/* Menu Lateral */}
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

        {/* Conteúdo da Tela */}
        <main className="flex-1 flex flex-col ml-20 bg-[#ECECEC]">
            {/* Topo Vermelho */}
            <div className="bg-[#990000] p-6 text-white relative shadow-md">
            {/* Botão de Edição */}
            <Link
                href={`/telaEdicaoPesquisador?tags=${encodeURIComponent(tags.join(","))}&idTag=${idTag}`}
                className="absolute top-4 right-4 bg-white text-[#990000] p-2 rounded-full shadow hover:bg-gray-100 transition"
                title="Editar Perfil"
            >
                <Pencil size={20} />
            </Link>
            <div className="flex items-start gap-6">
                {/* Foto do usuário */}
                <div className="rounded-md flex items-center justify-center overflow-hidden">
                <Image
                    src="/images/user.png"
                    alt="Foto do usuário"
                    width={400}
                    height={300}
                />
                </div>

                {/* Nome, Cargo e Tags */}
                <div className="flex-1">
                <h1 className="text-4xl font-bold mb-1">{nome}</h1>
                <h2 className="text-xl mb-4">{especialidade}</h2>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    {tags.length > 0 ? (
                    tags.map((tag) => (
                        <span
                        key={tag}
                        className="bg-white text-black px-4 py-2 rounded-full text-sm shadow-sm"
                        >
                        {tag}
                        </span>
                    ))
                    ) : (
                    <></>
                    )}
                </div>

                {/* Botões de Contato e Gerenciar */}
                <div className="mt-4 flex gap-4">
                    <button
                        className="border border-white text-white px-4 py-1 rounded hover:bg-white hover:text-[#990000] transition"
                        onClick={() => router.push("/contato")}
                    >
                        Contato
                    </button>

                    <Link
                        href="/gerenciarListas"
                        className="border border-white text-white px-4 py-1 rounded hover:bg-white hover:text-[#990000] transition flex items-center justify-center"
                    >
                        Gerenciar Listas
                    </Link>
                    </div>
                </div>
            </div>

            {/* Info de localização e última atualização */}
            <div className="absolute right-6 bottom-4 text-sm">
                <p>{paisNascimento}</p>
                <p className="text-xs">Última atualização em {dataAtualizacao} às {horaAtualizacao}</p>
            </div>
            </div>

            {/* Seção de Conteúdo (Cards lado a lado) */}
            <div className="p-8 flex gap-6 bg-[#ECECEC]">
            {/* Card 1 - Linha do tempo */}
            <div className="flex-1 bg-white rounded-lg shadow-md p-4">
                <h2 className="text-sm text-gray-700 mb-2">Linha do tempo - Destaques</h2>

                {/* Caixa com scroll */}
                <div className="relative border-l-2 border-gray-300 ml-4">
                    {Array.isArray(destaques) &&
                        destaques.map((item, idx) => (
                            <div key={idx} className="mb-8 flex items-center">
                                <div className="absolute w-3 h-3 bg-red-700 rounded-full -left-1.5"></div>

                                {/* Ano + Título */}
                                <div className="ml-6 flex items-center gap-2">
                                    <p className="text-lg font-semibold text-black">{item.ano}</p>
                                    <p className="text-sm text-gray-800">{item.titulo}</p>
                                    <p className="text-xs text-gray-600">{item.instituicao}</p>
                                </div>

                                {/* Botão */}
                                <button className="ml-auto bg-red-700 text-white text-sm px-4 py-1 rounded shadow hover:bg-red-800 transition">
                                    Acessar
                                </button>
                            </div>
                        ))
                    }
                </div>
            </div>

            {/* Card 2 - Formação Acadêmica */}
            <div className="flex-1 bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold mb-4 text-black">Formação Acadêmica</h2>
                <ul className="space-y-2">
                    {Array.isArray(formacao) &&
                        formacao.map((item, idx) => (
                            <li key={idx} className="bg-gray-100 p-3 rounded shadow-sm text-black">
                                <p className="font-semibold">{item.curso}</p>
                                <p className="text-sm">{item.instituicao}</p>
                                <p className="text-xs text-gray-600">
                                    {item.anoInicio} – {item.anoConclusao} ({item.status})
                                </p>
                                {item.tituloTrabalho && (
                                <p className="text-xs text-gray-500 mt-1">
                                    <span className="font-semibold">Trabalho:</span> {item.tituloTrabalho}
                                </p>
                                )}
                                {item.orientador && (
                                <p className="text-xs text-gray-500">
                                    <span className="font-semibold">Orientador:</span> {item.orientador}
                                </p>
                                )}
                            </li>
                        ))
                    }           
                </ul>
                </div>
            </div>

            {/* Modal Contato */}
            {aberto && (
            <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={() => setAberto(false)}
            >
                <div
                className="bg-white rounded-lg p-6 w-80 relative"
                onClick={(e) => e.stopPropagation()}
                >
                <h3 className="text-xl font-semibold mb-4 text-black">Contato</h3>
                <p className="mb-2">
                    <strong className="text-black">Telefone:</strong> {telefone}
                </p>
                <p className="mb-4">
                    <strong className="text-black">Email:</strong> {email}
                </p>
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                    onClick={() => setAberto(false)}
                    aria-label="Fechar modal"
                >
                    ✖
                </button>
                <button
                    className="mt-2 bg-[#990000] text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    onClick={() => setAberto(false)}
                >
                    Fechar
                </button>
                </div>
            </div>
            )}
        </main>
        </div>
    );
}