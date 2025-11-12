"use client";

import { useSearchParams, useRouter, useParams } from "next/navigation";
import { Home, User, Settings, LogOut, LayoutDashboard, Target, Pencil } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CardLista } from "@/app/components/CardLista";
import MenuLateral from "@/app/components/MenuLateral";


interface DadosPesquisador {
    pesquisador: Pesquisador,
    formacoesAcademicas: FormacoesAcademicas[],
    atuacoesProfissionais: AtuacoesProfissionais[],
    artigos: Artigos[],
    linhaDoTempo?: LinhaDoTempo[],
    tags: {
        listaTags: string[]
    }
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

interface AtuacoesProfissionais {
  id: number;
  cargo: string;
  instituicao: string;
  anoInicio: number;
  anoConclusao: number;
}

interface Artigos {
  id: number;
  ano: number;
  periodico: string;
  doi: string;
  idioma: string;
}

interface FormacoesAcademicas {
  id: number;
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

interface LinhaDoTempo {
  ano: number;
  titulo: string;
  id?: number;
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
      <MenuLateral/>

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
              {dadosPesquisador.tags.listaTags.map((tag, index) => (
                  <span
                  key={index}
                  className="bg-white text-black px-4 py-2 rounded-full text-sm shadow-sm">
                    {tag}
                  </span>
                ))}
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
        <div className="p-8 bg-[#ECECEC] overflow-y-auto">
          {/* Primeira Linha - Linha do tempo e Formação Acadêmica */}
          <div className="flex gap-6 mb-6">
            {/* Card 1 - Linha do tempo */}
            <div className="flex-1 bg-white rounded-lg shadow-md p-4 h-fit">
              <h2 className="text-sm text-gray-700 mb-2">Linha do tempo - Destaques</h2>

              {dadosPesquisador.linhaDoTempo && dadosPesquisador.linhaDoTempo.length > 0 ? (
                <div className="relative border-l-2 border-gray-300 ml-4">
                  {dadosPesquisador.linhaDoTempo.map((item, idx) => (
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
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 px-4">
                  <div className="text-center mb-4">
                    <p className="text-gray-500 text-sm mb-1">
                      Nenhum destaque adicionado ainda
                    </p>
                    <p className="text-gray-400 text-xs">
                      {podeEditar 
                        ? "Destaque suas conquistas e marcos importantes da sua trajetória acadêmica"
                        : "Este pesquisador ainda não adicionou destaques à linha do tempo"}
                    </p>
                  </div>
                  
                  {podeEditar && (
                    <button className="bg-[#990000] hover:bg-red-700 text-white px-5 py-1.5 rounded-lg shadow-md transition text-sm">
                      Adicionar Destaques
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Card 2 - Formação Acadêmica */}
            <CardLista
              titulo="Formação Acadêmica"
              items={dadosPesquisador.formacoesAcademicas.map((formacao) => ({
                id: formacao.id,
                titulo: `${formacao.nivel} — ${formacao.instituicao}`,
                subtitulo: `${formacao.curso} (${formacao.anoInicio} - ${formacao.anoConclusao})`
              }))}
              textoBotao="Ver mais"
              podeEditar={podeEditar}
              onClickBotao={() => console.log("Ver mais formações")}
            />
          </div>

          <div className="flex gap-6 mb-6">
            {/* Card 3 - Atuação Profissional */}
            <CardLista
              titulo="Atuação Profissional"
              items={dadosPesquisador.atuacoesProfissionais.map((atuacao) => ({
                id: atuacao.id,
                titulo: `${atuacao.cargo}`,
                subtitulo: `${atuacao.instituicao} (${atuacao.anoInicio} - ${atuacao.anoConclusao})`
              }))}
              textoBotao="Ver mais"
              podeEditar={podeEditar}
              onClickBotao={() => console.log("Ver mais atuações")}
            />

            {/* Card 4 - Artigos Publicados */}
            <CardLista
              titulo="Artigos Publicados"
              items={dadosPesquisador.artigos.map((artigo) => ({
                id: artigo.id,
                titulo: `${artigo.periodico}`,
                subtitulo: `Idioma: ${artigo.idioma} | DOI: ${artigo.doi}`
              }))}
              textoBotao="Ver mais"
              podeEditar={podeEditar}
              onClickBotao={() => console.log("Ver mais artigos")}
            />
          </div>

          {/* Terceira Linha - Projetos e Premiações (exemplo) */}
          <div className="flex gap-6 mb-6">
            {/* Card 5 - Projetos de Pesquisa */}
            <CardLista
              titulo="Projetos de Pesquisa"
              items={[ ]}
              textoBotao="Ver mais"
              onClickBotao={() => console.log("Ver mais projetos")}
            />

            {/* Card 6 - Premiações */}
            <CardLista
              titulo="Premiações e Honrarias"
              items={[ ]}
              textoBotao="Ver mais"
              onClickBotao={() => console.log("Ver mais premiações")}
            />
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