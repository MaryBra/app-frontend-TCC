export interface Usuario {
  login: string;
}

export interface DadosPesquisador {
  pesquisador: Pesquisador;
  formacoesAcademicas: FormacoesAcademicas[];
  atuacoesProfissionais: AtuacoesProfissionais[];
  artigos: Artigos[];
  linhaDoTempo?: LinhaDoTempo[];
  livros: Livros[];
  capitulos: Capitulos[];
  trabalhosEvento: TrabalhosEvento[];
  projetosPesquisa: ProjetosPesquisa[];
  premiacoes: Premiacoes[];
  orientacoes: Orientacoes[];
  tags: {
    listaTags: string[];
  };
}

export interface Pesquisador {
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

export interface AtuacoesProfissionais {
  id: number;
  cargo: string;
  instituicao: string;
  anoInicio: number;
  anoFim: number;
  destaque: false;
}

export interface Artigos {
  id: number;
  ano: number;
  titulo: string;
  periodico: string;
  doi: string;
  idioma: string;
  destaque: boolean;
}

export interface Livros {
  id: number;
  isbn: string;
  editora: string;
  ano: number;
  numeroPaginas: number;
  titulo: string;
  destaque: boolean;
}

export interface Capitulos {
  id: number;
  editora: string;
  paginaInicial: number;
  paginaFinal: number;
  tituloCapitulo: string;
  nomeLivro: string;
  ano: number;
  destaque: boolean;
}

export interface ProjetosPesquisa {
  id: number;
  titulo: string;
  descricao: string;
  instituicao: string;
  ano: number;
  financiador: string;
  destaque: boolean;
}

export interface TrabalhosEvento {
  id: number;
  titulo: string;
  ano: number;
  nomeEvento: string;
  cidadeEvento: string;
  classificacaoEvento: string;
  destaque: boolean;
}

export interface FormacoesAcademicas {
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

export interface Premiacoes {
  id: number;
  titulo: string;
  instituicao: string;
  ano: number;
  destaque: boolean;
}

export interface Orientacoes {
  id: number;
  nomeOrientado: string;
  nomeCurso: string;
  ano: number;
  instituicao: string;
  tituloTrabalho: string;
  tipo: string;
  destaque: boolean;
}

export interface LinhaDoTempo {
  ano: number;
  titulo: string;
  id?: number;
  tipo: string;
}