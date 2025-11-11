"use client";

import { useSearchParams, useRouter, useParams } from "next/navigation";
import { Home, User, Settings, LogOut, LayoutDashboard, Target, Pencil } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface DadosPesquisador {
    pesquisador: Pesquisador,
    formacoesAcademicas: FormacoesAcademicas[]
}

interface Usuario {
    login: string;
}

interface Pesquisador {
  id: number;
  usuario: Usuario;
  nomePesquisador: string;
  sobrenome: string;
  dataNascimento: string;
  nomeCitacoesBibliograficas: string;
  dataAtualizacao: string;
  horaAtualizacao: string;
  nacionalidade: string;
  paisNascimento: string;
  lattesId: number;
  imagemPerfil: string | null;
}

interface FormacoesAcademicas {
  id: number;
  pesquisador: Pesquisador;
  nivel: string;
  sequenciaFormacao: number;
  instituicao: string;
  curso: string;
  status: string;
  anoInicio: number;
  anoConclusao: number;
  tituloTrabalho: string;
  orientador: string;
  destaque: boolean;
}

export default function ProfileScreen() {

    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    const router = useRouter();
    const { id } = useParams();

    const [dadosPesquisador, setDadosPesquisador] = useState<DadosPesquisador | null>(null);
    const [podeEditar, setPodeEditar] = useState(false);
    const [aberto, setAberto] = useState(false);

    useEffect(() => {

        const idUsuarioLogado = localStorage.getItem("id_usuario");
        const tipoUsuarioLogado = localStorage.getItem("tipo_usuario");
        const editor = id === idUsuarioLogado && tipoUsuarioLogado === "pesquisador";
        
        setPodeEditar(editor);

        const buscarDados = async () => {
            const token = localStorage.getItem("token")

            if (!token) {
                router.push("/login")
                return
            }

            try {
                const res = await fetch(`http://localhost:8080/api/dadosPesquisador/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Falha ao buscar dados do pesquisador");
                }

                const data = await res.json();
                console.log(data)
                setDadosPesquisador(data);

            } catch (err) {
                console.error("Erro ao buscar perfil:", err);
                setErro("Erro ao carregar perfil");
            } finally {
                setCarregando(false);
            }
        };

        buscarDados();

    }, [id]);

    if (carregando) {
        return (
        <div className="flex h-screen items-center justify-center">
            <p className="text-xl">Carregando perfil...</p>
        </div>
        );
    }   

  // Erro
  if (erro || !dadosPesquisador) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl text-red-600">{erro || "Perfil não encontrado"}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Menu Lateral */}
      <aside className="w-20 bg-white fixed left-0 top-0 h-screen flex flex-col items-center py-4 shadow-md">
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
          {/* Botão de Edição - só aparece se pode editar */}
          {podeEditar && (
            <Link
              href={`/telaEdicaoPesquisador/${id}`}
              className="absolute top-4 right-4 bg-white text-[#990000] p-2 rounded-full shadow hover:bg-gray-100 transition"
              title="Editar Perfil"
            >
              <Pencil size={20} />
            </Link>
          )}

          <div className="flex items-start gap-6">
            <div className="rounded-md flex items-center justify-center overflow-hidden">
              <Image
                src="/images/user.png"
                alt="Foto do usuário"
                width={400}
                height={300}
              />
            </div>

            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-1">{dadosPesquisador.pesquisador.nomePesquisador} {dadosPesquisador.pesquisador.sobrenome}</h1>
              <h2 className="text-xl mb-4">
              </h2>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
              {dadosPesquisador.tags.listaTags.length > 0 ? (
                dadosPesquisador.tags.listaTags.map((tag, index) => (
                  <span
                  key={index}
                  className="bg-white text-black px-4 py-2 rounded-full text-sm shadow-sm">
                    {tag}
                  </span>
                ))
              ): (
                    <>
                        <span className="bg-white text-black px-3 py-1 rounded-full text-sm shadow-sm">
                        Desenvolvimento de Software
                        </span>
                        <span className="bg-white text-black px-3 py-1 rounded-full text-sm shadow-sm">
                        Suporte Técnico
                        </span>
                        <span className="bg-white text-black px-3 py-1 rounded-full text-sm shadow-sm">
                        Redes de Computadores
                        </span>
                    </>)}
              </div>

              {/* Botões de Contato */}
              <div className="mt-4 flex gap-4">
                <button
                  className="border border-white text-white px-4 py-1 rounded hover:bg-white hover:text-[#990000] transition"
                  onClick={() => setAberto(true)}
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

          {/* Info de localização */}
          <div className="absolute right-6 bottom-4 text-sm">
            <p className="text-xs">
              Última atualização em {dadosPesquisador.pesquisador.dataAtualizacao} às {dadosPesquisador.pesquisador.horaAtualizacao}
            </p>
          </div>
        </div>

        {/* Seção de Conteúdo */}
        <div className="p-8 flex gap-6 bg-[#ECECEC]">
          {/* Card 1 - Linha do tempo */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-4">
            <h2 className="text-sm text-gray-700 mb-2">Linha do tempo - Destaques</h2>

            <div className="relative border-l-2 border-gray-300 ml-4">
              {/* {dadosPesquisador.linhaDoTempo.map((item, idx) => (
                <div key={idx} className="mb-8 flex items-center">
                  <div className="absolute w-3 h-3 bg-red-700 rounded-full -left-1.5"></div>

                  <div className="ml-6 flex items-center gap-2">
                    <p className="text-lg font-semibold text-black">{item.ano}</p>
                    <p className="text-sm text-gray-800">{item.titulo}</p>
                  </div>

                  <button className="ml-auto bg-red-700 text-white text-sm px-4 py-1 rounded shadow hover:bg-red-800 transition">
                    Acessar
                  </button>
                </div>
              ))} */}
            </div>
          </div>

          {/* Card 2 - Formação Acadêmica */}
          <div className="flex-1 bg-white rounded-2xl shadow-lg p-6">
            <div className="relative mb-6">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-gray-200 h-8 rounded-md"></div>
                <h2 className="relative z-10 text-center text-2xl font-bold text-black tracking-wide">
                Formação Acadêmica
                </h2>
            </div>

            <ul className="space-y-5">
                {dadosPesquisador?.formacoesAcademicas?.map((formacao) => (
                <li key={formacao.id} className="flex items-center gap-10 bg-gray-50 rounded-xl p-5">
                    {/* Bolinha cinza centralizada verticalmente */}
                    <div className="w-5 h-5 bg-gray-400 rounded-full flex-shrink-0 self-center"></div>

                    {/* Conteúdo textual */}
                    <div className="flex flex-col text-black leading-snug">
                    <p className="font-bold text-base">
                        {formacao.nivel} — {formacao.instituicao}
                    </p>
                    <p className="text-sm text-gray-700">
                        {formacao.curso} ({formacao.anoInicio} - {formacao.anoConclusao})
                    </p>
                    </div>
                </li>
                ))}
            </ul>

        <div className="mt-8 flex justify-end">
            <button className="bg-[#990000] hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow-md transition">
                Ver mais
            </button>
        </div>

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
                {/* <strong className="text-black">Telefone:</strong> {dadosPesquisador.telefone} */}
              </p>
              <p className="mb-4">
                <strong className="text-black">Email:</strong> {dadosPesquisador.pesquisador.usuario.login}
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