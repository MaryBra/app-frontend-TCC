"use client";

import { useSearchParams, useRouter, useParams } from "next/navigation";
import {
  Home,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  Target,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CardLista } from "@/app/components/CardLista";
import MenuLateral from "@/app/components/MenuLateral";
import {
  formatarDataHora,
  obterAnoOuPadrao,
  obterNumeroOuPadrao,
  obterValorOuPadrao,
} from "@/app/utils/formatadores";
import { CardLinhaDoTempo } from "@/app/components/CardLinhaTempo";
import { HeaderPesquisador } from "@/app/components/HeaderPesquisador";
import { DadosPesquisador } from "@/app/types/pesquisador.types";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";



export default function ProfileScreen() {
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const router = useRouter();
  const { id } = useParams();

  const [dadosPesquisador, setDadosPesquisador] =
    useState<DadosPesquisador | null>(null);
  const [podeEditar, setPodeEditar] = useState(false);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const idUsuarioLogado = localStorage.getItem("usuarioId");
    const tipoUsuarioLogado = localStorage.getItem("tipo_usuario");
    const editor =
      id === idUsuarioLogado && tipoUsuarioLogado === "pesquisador";

    setPodeEditar(editor);

    const buscarDados = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:8080/api/dadosPesquisador/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Falha ao buscar dados do pesquisador");
        }

        const data = await res.json();
        console.log(data);
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
        <div className="flex h-screen bg-gray-100">
          <MenuLateral />
          <main className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <LoadingSpinner></LoadingSpinner>
            </div>
          </main>
        </div>
      );
    }

  // Erro
  if (erro || !dadosPesquisador) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl text-red-600">
          {erro || "Perfil não encontrado"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Menu Lateral */}
      <MenuLateral />

      {/* Conteúdo da Tela */}
      <main className="flex-1 flex flex-col ml-20 bg-[#ECECEC]">
        {/* Topo Vermelho */}
        <HeaderPesquisador
          nomePesquisador={obterValorOuPadrao(
            dadosPesquisador.pesquisador.nomePesquisador
          )}
          sobrenome={obterValorOuPadrao(dadosPesquisador.pesquisador.sobrenome)}
          ocupacao={dadosPesquisador.pesquisador.ocupacao}
          imagemPerfil={dadosPesquisador.pesquisador.imagemPerfil}
          tags={dadosPesquisador.tags?.listaTags ?? []}
          dataAtualizacao={formatarDataHora(
            dadosPesquisador.pesquisador.dataAtualizacao,
            dadosPesquisador.pesquisador.horaAtualizacao
          )}
          horaAtualizacao=""
          podeEditar={podeEditar}
          idPesquisador={dadosPesquisador.pesquisador.id}
          usuarioId={dadosPesquisador.pesquisador.usuario.id}
          onClickContato={() => setAberto(true)}
        />

        {/* Seção de Conteúdo */}
        <div className="p-8 bg-[#ECECEC] overflow-y-auto">
          {/* Primeira Linha - Linha do tempo e Formação Acadêmica */}
          <div className="flex gap-6 mb-6">
            {/* Card 1 - Linha do tempo */}
            <CardLinhaDoTempo
              items={(dadosPesquisador.linhaDoTempo ?? []).map((item) => ({
                id: item.id,
                ano: item.ano,
                titulo: obterValorOuPadrao(item.titulo),
                tipo: item.tipo
              }))}
              podeEditar={podeEditar}
              onClickAdicionar={() => console.log("Adicionar destaque")}
            />

            {/* Card 2 - Formação Acadêmica */}
            <CardLista
              titulo="Formação Acadêmica"
              items={(dadosPesquisador?.formacoesAcademicas ?? []).map(
                (formacao) => ({
                  id: formacao.id,
                  titulo: `${obterValorOuPadrao(
                    formacao.nivel
                  )} — ${obterValorOuPadrao(formacao.curso)}`,
                  subtitulo: `${obterValorOuPadrao(
                    formacao.instituicao
                  )} (${obterAnoOuPadrao(
                    formacao.anoInicio
                  )} - ${obterAnoOuPadrao(formacao.anoConclusao)})`,
                  detalhes: {
                    "Status": obterValorOuPadrao(formacao.status),
                    "Título do Trabalho": obterValorOuPadrao(formacao.tituloTrabalho),
                    "Orientador": obterValorOuPadrao(formacao.orientador),
                    "Ano de Início": obterAnoOuPadrao(formacao.anoInicio),
                    "Ano de Conclusão": obterAnoOuPadrao(formacao.anoConclusao),
                  },
                  destaque: formacao.destaque
                })
              )}
              podeEditar={podeEditar}
            />
          </div>

          <div className="flex gap-6 mb-6">
            {/* Card 3 - Atuação Profissional */}
            <CardLista
              titulo="Atuação Profissional"
              items={(dadosPesquisador?.atuacoesProfissionais ?? []).map(
                (atuacao) => ({
                  id: atuacao.id,
                  titulo: obterValorOuPadrao(atuacao.cargo),
                  subtitulo: `${obterValorOuPadrao(
                    atuacao.instituicao
                  )} (${obterAnoOuPadrao(
                    atuacao.anoInicio
                  )} - ${obterAnoOuPadrao(atuacao.anoFim)})`,
                  detalhes: {
                    "Instituição": obterValorOuPadrao(atuacao.instituicao),
                    "Ano de Início": obterAnoOuPadrao(atuacao.anoInicio),
                    "Ano de Término": obterAnoOuPadrao(atuacao.anoFim),
                  },
                  destaque: atuacao.destaque
                })
              )}
              podeEditar={podeEditar}
            />

            {/* Card 4 - Artigos Publicados */}
            <CardLista
              titulo="Artigos Publicados"
              items={(dadosPesquisador?.artigos ?? []).map((artigo) => ({
                id: artigo.id,
                titulo: obterValorOuPadrao(artigo.titulo),
                subtitulo: `Periódico: ${obterValorOuPadrao(
                  artigo.periodico
                )} (${obterNumeroOuPadrao(artigo.ano)})`,
                detalhes: {
                  "Periódico": obterValorOuPadrao(artigo.periodico),
                  "Ano": obterNumeroOuPadrao(artigo.ano),
                  "DOI": obterValorOuPadrao(artigo.doi),
                  "Idioma": obterValorOuPadrao(artigo.idioma),
                },
                destaque: artigo.destaque
              }))}
              podeEditar={podeEditar}
            />
          </div>

          <div className="flex gap-6 mb-6">
            {/* Card 5 - Livros Publicados */}
            <CardLista
              titulo="Livros Publicados"
              items={(dadosPesquisador?.livros ?? []).map((livro) => ({
                id: livro.id,
                titulo: obterValorOuPadrao(livro.titulo),
                subtitulo: `Editora: ${obterValorOuPadrao(
                  livro.editora
                )} (${obterNumeroOuPadrao(livro.ano)})`,
                detalhes: {
                  "Editora": obterValorOuPadrao(livro.editora),
                  "Ano": obterNumeroOuPadrao(livro.ano),
                  "ISBN": obterValorOuPadrao(livro.isbn),
                  "Número de Páginas": obterNumeroOuPadrao(livro.numeroPaginas),
                },
                destaque:livro.destaque
              }))}
              podeEditar={podeEditar}
            />

            {/* Card 6 - Capítulos Publicados */}
            <CardLista
              titulo="Capítulos Publicados"
              items={(dadosPesquisador?.capitulos ?? []).map((capitulo) => ({
                id: capitulo.id,
                titulo: obterValorOuPadrao(capitulo.tituloCapitulo),
                subtitulo: `Livro: ${obterValorOuPadrao(
                  capitulo.nomeLivro
                )} (${obterNumeroOuPadrao(capitulo.ano)})`,
                detalhes: {
                  "Nome do Livro": obterValorOuPadrao(capitulo.nomeLivro),
                  "Ano": obterNumeroOuPadrao(capitulo.ano),
                },
                destaque: capitulo.destaque
              }))}
              podeEditar={podeEditar}
            />
          </div>

          <div className="flex gap-6 mb-6">
            {/* Card 7 - Trabalhos em Eventos */}
            <CardLista
              titulo="Trabalhos em Eventos"
              items={(dadosPesquisador?.trabalhosEvento ?? []).map(
                (evento) => ({
                  id: evento.id,
                  titulo: obterValorOuPadrao(evento.titulo),
                  subtitulo: `${obterValorOuPadrao(
                    evento.nomeEvento
                  )} (${obterNumeroOuPadrao(evento.ano)})`,
                  detalhes: {
                    "Nome do Evento": obterValorOuPadrao(evento.nomeEvento),
                    "Cidade": obterValorOuPadrao(evento.cidadeEvento),
                    "Ano": obterNumeroOuPadrao(evento.ano),
                  },
                  destaque: evento.destaque
                })
              )}
              podeEditar={podeEditar}
            />

            {/* Card 8 - Projetos de Pesquisa */}
            <CardLista
              titulo="Projetos de Pesquisa"
              items={(dadosPesquisador?.projetosPesquisa ?? []).map(
                (projeto) => ({
                  id: projeto.id,
                  titulo: obterValorOuPadrao(projeto.titulo),
                  subtitulo: `${obterValorOuPadrao(
                    projeto.instituicao
                  )} (${obterNumeroOuPadrao(projeto.ano)})`,
                  detalhes: {
                    "Instituição": obterValorOuPadrao(projeto.instituicao),
                    "Ano": obterNumeroOuPadrao(projeto.ano),
                    "Financiador": obterValorOuPadrao(projeto.financiador),
                  },
                  destaque: projeto.destaque
                })
              )}
              podeEditar={podeEditar}
            />
          </div>

          <div className="flex gap-6 mb-6">
            {/* Card 9 - Premiações */}
            <CardLista
              titulo="Premiações"
              items={(dadosPesquisador?.premiacoes ?? []).map((premiacao) => ({
                id: premiacao.id,
                titulo: obterValorOuPadrao(premiacao.titulo),
                subtitulo: `${obterValorOuPadrao(
                  premiacao.instituicao
                )} (${obterNumeroOuPadrao(premiacao.ano)})`,
                detalhes: {
                  "Instituição": obterValorOuPadrao(premiacao.instituicao),
                  "Ano": obterNumeroOuPadrao(premiacao.ano),
                },
                destaque: premiacao.destaque
              }))}
              podeEditar={podeEditar}
            />

            {/* Card 10 - Orientações */}
            <CardLista
              titulo="Orientações"
              items={(dadosPesquisador?.orientacoes ?? []).map(
                (orientacao) => ({
                  id: orientacao.id,
                  titulo: obterValorOuPadrao(orientacao.tituloTrabalho),
                  subtitulo: `${obterValorOuPadrao(
                    orientacao.tipo
                  )} (${obterNumeroOuPadrao(orientacao.ano)})`,
                  detalhes: {
                    "Nome do Orientado": obterValorOuPadrao(orientacao.nomeOrientado),
                    "Tipo": obterValorOuPadrao(orientacao.tipo),
                    "Curso": obterValorOuPadrao(orientacao.nomeCurso),
                    "Instituição": obterValorOuPadrao(orientacao.instituicao),
                    "Ano": obterNumeroOuPadrao(orientacao.ano),
                  },
                  destaque: orientacao.destaque
                })
              )}
              podeEditar={podeEditar}
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
              <p className="mb-4 text-gray-700">
                <strong className="text-black">Email:</strong>{" "}
                {obterValorOuPadrao(dadosPesquisador.pesquisador.usuario.login)}
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