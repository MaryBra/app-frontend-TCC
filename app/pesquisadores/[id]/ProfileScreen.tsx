"use client";

import { useSearchParams, useRouter, useParams } from "next/navigation";
import { Home, User, Settings, LogOut, LayoutDashboard, Target, Pencil } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CardLista } from "@/app/components/CardLista";
import MenuLateral from "@/app/components/MenuLateral";
import { formatarDataHora, obterAnoOuPadrao, obterNumeroOuPadrao, obterValorOuPadrao } from "@/app/utils/formatadores";
import { CardLinhaDoTempo } from "@/app/components/CardLinhaTempo";
import { HeaderPesquisador } from "@/app/components/HeaderPesquisador";


interface DadosPesquisador {
    pesquisador: Pesquisador,
    formacoesAcademicas: FormacoesAcademicas[],
    atuacoesProfissionais: AtuacoesProfissionais[],
    artigos: Artigos[],
    linhaDoTempo?: LinhaDoTempo[],
    livros: Livros[],
    capitulos: Capitulos[],
    trabalhosEvento: TrabalhosEvento[],
    projetosPesquisa: ProjetosPesquisa[],
    premiacoes: Premiacoes[],
    orientacoes: Orientacoes[],
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
  ocupacao: string;
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
  anoFim: number;
}

interface Artigos {
  id: number;
  ano: number;
  titulo: string;
  periodico: string;
  doi: string;
  idioma: string;
  destaque: boolean;
}

interface Livros {
  id: number;
  isbn: string;
  editora: string;
  ano: number;
  numeroPaginas: number;
  titulo: string;
  destaque: boolean;
}

interface Capitulos {
  id: number;
  tituloCapitulo: string;
  nomeLivro: string;
  ano: number;
  destaque: boolean;
}

interface ProjetosPesquisa {
  id: number;
  titulo: string;
  instituicao: string;
  ano: number;
  financiador: string;
}

interface TrabalhosEvento {
  id: number;
  titulo: string;
  ano: number;
  nomeEvento: string;
  cidadeEvento: string;
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

interface Premiacoes {
  id: number;
  titulo: string;
  instituicao: string;
  ano: number;
}

interface Orientacoes {
  id: number;
  nomeOrientado: string;
  nomeCurso: string;
  ano: number;
  instituicao: string;
  tituloTrabalho: string;
  tipo: string;
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

        const idUsuarioLogado = localStorage.getItem("usuarioId");
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
        <HeaderPesquisador
        nomePesquisador={obterValorOuPadrao(dadosPesquisador.pesquisador.nomePesquisador)}
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
                titulo: obterValorOuPadrao(item.titulo)
              }))}
              podeEditar={podeEditar}
              onClickAdicionar={() => console.log("Adicionar destaque")}
              onClickAcessar={(item) => console.log("Acessar item:", item)}
            />

            {/* Card 2 - Formação Acadêmica */}
            <CardLista
              titulo="Formação Acadêmica"
              items={(dadosPesquisador?.formacoesAcademicas ?? []).map((formacao) => ({
                id: formacao.id,
                titulo: `${obterValorOuPadrao(formacao.nivel)} — ${obterValorOuPadrao(formacao.curso)}`,
                subtitulo: `${obterValorOuPadrao(formacao.instituicao)} (${obterAnoOuPadrao(formacao.anoInicio)} - ${obterAnoOuPadrao(formacao.anoConclusao)})`
              }))}
              podeEditar={podeEditar}
              onClickBotao={() => console.log("Ver mais formações")}
            />
          </div>

          <div className="flex gap-6 mb-6">
            {/* Card 3 - Atuação Profissional */}
            <CardLista
              titulo="Atuação Profissional"
              items={(dadosPesquisador?.atuacoesProfissionais ?? []).map((atuacao) => ({
                id: atuacao.id,
                titulo: obterValorOuPadrao(atuacao.cargo),
                subtitulo: `${obterValorOuPadrao(atuacao.instituicao)} (${obterAnoOuPadrao(atuacao.anoInicio)} - ${obterAnoOuPadrao(atuacao.anoFim)})`
              }))}
              podeEditar={podeEditar}
              onClickBotao={() => console.log("Ver mais atuações")}
            />

            {/* Card 4 - Artigos Publicados */}
            <CardLista
              titulo="Artigos Publicados"
              items={(dadosPesquisador?.artigos ?? []).map((artigo) => ({
                id: artigo.id,
                titulo: obterValorOuPadrao(artigo.titulo),
                subtitulo: `Periódico: ${obterValorOuPadrao(artigo.periodico)} (${obterNumeroOuPadrao(artigo.ano)})`
              }))}
              podeEditar={podeEditar}
              onClickBotao={() => console.log("Ver mais artigos")}
            />
          </div>

          <div className="flex gap-6 mb-6">
            {/* Card 5 - Livros Publicados */}
            <CardLista
              titulo="Livros Publicados"
              items={(dadosPesquisador?.livros ?? []).map((livro) => ({
                id: livro.id,
                titulo: obterValorOuPadrao(livro.titulo),
                subtitulo: `Editora: ${obterValorOuPadrao(livro.editora)} (${obterNumeroOuPadrao(livro.ano)})`
              }))}
              podeEditar={podeEditar}
              onClickBotao={() => console.log("Ver mais livros")}
            />

            {/* Card 6 - Capítulos Publicados */}
            <CardLista
              titulo="Capítulos Publicados"
              items={(dadosPesquisador?.capitulos ?? []).map((capitulo) => ({
                id: capitulo.id,
                titulo: obterValorOuPadrao(capitulo.tituloCapitulo),
                subtitulo: `Livro: ${obterValorOuPadrao(capitulo.nomeLivro)} (${obterNumeroOuPadrao(capitulo.ano)})`
              }))}
              podeEditar={podeEditar}
              onClickBotao={() => console.log("Ver mais capítulos")}
            />
          </div>

          <div className="flex gap-6 mb-6">
            {/* Card 7 - Trabalhos em Eventos */}
            <CardLista
              titulo="Trabalhos em Eventos"
              items={(dadosPesquisador?.trabalhosEvento ?? []).map((evento) => ({
                id: evento.id,
                titulo: obterValorOuPadrao(evento.titulo),
                subtitulo: `${obterValorOuPadrao(evento.nomeEvento)} (${obterNumeroOuPadrao(evento.ano)})`
              }))}
              podeEditar={podeEditar}
              onClickBotao={() => console.log("Ver mais trabalhos")}
            />

            {/* Card 8 - Projetos de Pesquisa */}
            <CardLista
              titulo="Projetos de Pesquisa"
              items={(dadosPesquisador?.projetosPesquisa ?? []).map((projeto) => ({
                id: projeto.id,
                titulo: obterValorOuPadrao(projeto.titulo),
                subtitulo: `${obterValorOuPadrao(projeto.instituicao)} (${obterNumeroOuPadrao(projeto.ano)})`
              }))}
              onClickBotao={() => console.log("Ver mais projetos")}
            />
          </div>

          <div className="flex gap-6 mb-6">
            {/* Card 9 - Premiações */}
            <CardLista
              titulo="Premiações"
              items={(dadosPesquisador?.premiacoes ?? []).map((preamiacao) => ({
                id: preamiacao.id,
                titulo: obterValorOuPadrao(preamiacao.titulo),
                subtitulo: `${obterValorOuPadrao(preamiacao.instituicao)} (${obterNumeroOuPadrao(preamiacao.ano)})`
              }))}
              podeEditar={podeEditar}
              onClickBotao={() => console.log("Ver mais trabalhos")}
            />

            {/* Card 10 - Orientações */}
            <CardLista
              titulo="Orientações"
              items={(dadosPesquisador?.orientacoes ?? []).map((orientacao) => ({
                id: orientacao.id,
                titulo: obterValorOuPadrao(orientacao.tituloTrabalho),
                subtitulo: `${obterValorOuPadrao(orientacao.tipo)} (${obterNumeroOuPadrao(orientacao.ano)})`
              }))}
              onClickBotao={() => console.log("Ver mais projetos")}
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
              <p className="mb-4">
                <strong className="text-black">Email:</strong> {obterValorOuPadrao(dadosPesquisador.pesquisador.usuario.login)}
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