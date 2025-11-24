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
import { CardContato } from "@/app/components/CardContato";
import NotFound from "@/app/not-found";

''

export default function ProfileScreen() {
  const [carregando, setCarregando] = useState(true);
  const [naoEncontrado, setNaoEncontrado] = useState(false);
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

        if (res.status === 404) {
          setNaoEncontrado(true);
          setCarregando(false);
          return;
        }

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

  if (naoEncontrado) {
    return <NotFound/>
  }

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
          pais={dadosPesquisador.endereco?.pais}
          cidade={dadosPesquisador.endereco?.cidade}
          nacionalidade={dadosPesquisador.pesquisador.nacionalidade}
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
              tabName="Formações Acadêmicas"
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
              tabName="Atuações Profissionais"
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
                  "Ano": obterNumeroOuPadrao(artigo.ano),
                  "DOI": obterValorOuPadrao(artigo.doi),
                  "Idioma": obterValorOuPadrao(artigo.idioma),
                  "Autores": obterValorOuPadrao(artigo.autores)
                },
                destaque: artigo.destaque
              }))}
              podeEditar={podeEditar}
              tabName="Artigos"
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
                  "Ano": obterNumeroOuPadrao(livro.ano),
                  "ISBN": obterValorOuPadrao(livro.isbn),
                  "Idioma": obterValorOuPadrao(livro.idioma),
                  "Número de Páginas": obterNumeroOuPadrao(livro.numeroPaginas),
                  "Autores": obterValorOuPadrao(livro.autores)
                },
                destaque:livro.destaque
              }))}
              podeEditar={podeEditar}
              tabName="Livros"
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
                  "Página Inicial": obterNumeroOuPadrao(capitulo.paginaInicial),
                  "Página Final": obterNumeroOuPadrao(capitulo.paginaFinal),
                  "DOI do Livro": obterValorOuPadrao(capitulo.doi),
                },
                destaque: capitulo.destaque
              }))}
              podeEditar={podeEditar}
              tabName="Capítulos"
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
                    "Classificação": obterValorOuPadrao(evento.classificacaoEvento),
                    "Cidade": obterValorOuPadrao(evento.cidadeEvento),
                    "Ano": obterNumeroOuPadrao(evento.ano),
                  },
                  destaque: evento.destaque
                })
              )}
              podeEditar={podeEditar}
              tabName="Trabalho em Eventos"
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
              tabName="Projetos de Pesquisa"
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
              tabName="Premiações"
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
              tabName="Orientações"
            />
          </div>
        </div>

        {/* Modal Contato */}
        <CardContato
          idPesquisador={dadosPesquisador.pesquisador.id}
          aberto={aberto}
          podeEditar={podeEditar}
          onClose={() => setAberto(false)}
          exibirContato={dadosPesquisador.pesquisador.exibirContato}
          email={dadosPesquisador.endereco?.email || ""}
          cidade={dadosPesquisador.endereco?.cidade || ""}
          telefone={dadosPesquisador.endereco?.telefone || ""}
          pais={dadosPesquisador.endereco?.pais || ""}
        />
      </main>
    </div>
  );
}