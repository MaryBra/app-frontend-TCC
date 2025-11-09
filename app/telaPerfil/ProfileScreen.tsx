"use client";

import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import LayoutWrapper from "../components/LayoutWrapper";
import { useUser } from "../contexts/UserContext";

interface Artigo {
  id: number;
  titulo: string;
  ano: string;
  doi: string;
}

interface FormacaoAcademica {
  id: number;
  curso: string;
  instituicao: string;
  anoConclusao: string;
  nivel: string;
}

interface DadosPesquisador {
  artigos: Artigo[];
  formacoesAcademicas: FormacaoAcademica[];
  idiomas: any[];
  atuacoesProfissionais: any[];
  projetosPesquisa: any[];
}

export default function ProfileScreen() {
  const router = useRouter();
  const { userData, refreshUserData } = useUser();

  const [nomeExibicao, setNomeExibicao] = useState("Carregando...");
  const [especialidade, setEspecialidade] = useState("Carregando...");
  const [paisNascimento, setPaisNascimento] = useState("Carregando...");
  const [dataAtualizacao, setDataAtualizacao] = useState("");
  const [horaAtualizacao, setHoraAtualizacao] = useState("");
  const [aberto, setAberto] = useState(false);
  const [listaDeTags, setListaDeTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [dadosPesquisador, setDadosPesquisador] =
    useState<DadosPesquisador | null>(null);
  const [telefone, setTelefone] = useState("Não informado");

  const email = userData?.login || "usuario@exemplo.com";

  const carregarTags = async () => {
    if (!userData?.pesquisador?.id) {
      return;
    }

    const pesquisadorId = userData.pesquisador.id;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/tags/pesquisador/${pesquisadorId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const tagsData = await response.json();

        let tagsArray: string[] = [];

        if (tagsData && typeof tagsData === "object") {
          if (
            Array.isArray(tagsData) &&
            tagsData.every((item) => typeof item === "string")
          ) {
            tagsArray = tagsData;
          } else if (Array.isArray(tagsData.listaTags)) {
            tagsArray = tagsData.listaTags;
          } else if (Array.isArray(tagsData.tags)) {
            tagsArray = tagsData.tags;
          } else if (tagsData.id && Array.isArray(tagsData.listaTags)) {
            tagsArray = tagsData.listaTags;
          } else if (tagsData.nome && typeof tagsData.nome === "string") {
            tagsArray = [tagsData.nome];
          } else {
            for (const key in tagsData) {
              if (
                Array.isArray(tagsData[key]) &&
                tagsData[key].length > 0 &&
                tagsData[key].every((item) => typeof item === "string")
              ) {
                tagsArray = tagsData[key];
                break;
              }
            }
          }
        }

        if (tagsArray.length > 0) {
          setListaDeTags(tagsArray);
          setEspecialidade(tagsArray[0]);
          localStorage.setItem(
            `tags_${pesquisadorId}`,
            JSON.stringify(tagsArray)
          );
        } else {
          await carregarTagsDoLocalStorage(pesquisadorId);
        }
      } else if (response.status === 404) {
        await carregarTagsDoLocalStorage(pesquisadorId);
      } else {
        await carregarTagsDoLocalStorage(pesquisadorId);
      }
    } catch (error) {
      await carregarTagsDoLocalStorage(userData.pesquisador.id);
    }
  };

  const carregarTagsDoLocalStorage = async (pesquisadorId: number) => {
    const tagsSalvas = localStorage.getItem(`tags_${pesquisadorId}`);

    if (tagsSalvas) {
      try {
        const tagsArray = JSON.parse(tagsSalvas);
        if (tagsArray.length > 0) {
          setListaDeTags(tagsArray);
          setEspecialidade(tagsArray[0]);
        } else {
          setListaDeTags([]);
          setEspecialidade("Nenhuma especialidade definida");
        }
      } catch (error) {
        setListaDeTags([]);
        setEspecialidade("Nenhuma especialidade definida");
      }
    } else {
      setListaDeTags([]);
      setEspecialidade("Nenhuma especialidade definida");
    }
  };

  const carregarDadosCompletos = async () => {
    if (!userData?.pesquisador?.id) return;

    const pesquisadorId = userData.pesquisador.id;
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/dadosPesquisador/${pesquisadorId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const dadosCompletos = await response.json();
        setDadosPesquisador(dadosCompletos);
      } else {
        await carregarDadosIndividuais(pesquisadorId, token);
      }
    } catch (error) {
      if (userData?.pesquisador?.id && token) {
        await carregarDadosIndividuais(userData.pesquisador.id, token);
      }
    }
  };

  const carregarDadosIndividuais = async (
    pesquisadorId: number,
    token: string
  ) => {
    try {
      const artigosResponse = await fetch(
        `http://localhost:8080/api/artigos/pesquisador/${pesquisadorId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const formacoesResponse = await fetch(
        `http://localhost:8080/api/formacoes/pesquisador/${pesquisadorId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const artigos = artigosResponse.ok ? await artigosResponse.json() : [];
      const formacoes = formacoesResponse.ok
        ? await formacoesResponse.json()
        : [];

      setDadosPesquisador({
        artigos: artigos || [],
        formacoesAcademicas: formacoes || [],
        idiomas: [],
        atuacoesProfissionais: [],
        projetosPesquisa: [],
      });
    } catch (error) {
      setDadosPesquisador({
        artigos: [],
        formacoesAcademicas: [],
        idiomas: [],
        atuacoesProfissionais: [],
        projetosPesquisa: [],
      });
    }
  };

  const atualizarTelefone = () => {
    if (
      userData?.pesquisador?.telefone &&
      userData.pesquisador.telefone.trim() !== ""
    ) {
      setTelefone(userData.pesquisador.telefone);
    } else {
      const telefoneSalvo = localStorage.getItem(`telefone_${userData?.id}`);
      if (telefoneSalvo) {
        setTelefone(telefoneSalvo);
      } else {
        setTelefone("Não informado");
      }
    }
  };

  useEffect(() => {
    const atualizarDados = async () => {
      if (!userData) {
        return;
      }

      const nomeParaExibir =
        userData.pesquisador?.nomeCompleto ||
        userData.nome ||
        userData.login ||
        "Usuário";
      setNomeExibicao(nomeParaExibir);

      if (userData.pesquisador) {
        setPaisNascimento(
          userData.pesquisador.paisNascimento || "Não informado"
        );
        setDataAtualizacao(userData.pesquisador.dataAtualizacao || "");
        setHoraAtualizacao(userData.pesquisador.horaAtualizacao || "");
        atualizarTelefone();
      }

      await Promise.all([carregarTags(), carregarDadosCompletos()]);

      setLoading(false);
    };

    if (userData) {
      atualizarDados();
    }
  }, [userData]);

  useEffect(() => {
    const handleUserDataUpdated = () => {
      refreshUserData();
    };

    const handleProfileUpdated = () => {
      refreshUserData();
    };

    const handleTelefoneUpdated = (event: CustomEvent) => {
      if (event.detail?.telefone) {
        setTelefone(event.detail.telefone);
        if (userData?.id) {
          localStorage.setItem(
            `telefone_${userData.id}`,
            event.detail.telefone
          );
        }
      }
    };

    const handleTagsUpdated = (event: CustomEvent) => {
      if (event.detail?.tags && Array.isArray(event.detail.tags)) {
        setListaDeTags(event.detail.tags);
        if (event.detail.tags.length > 0) {
          setEspecialidade(event.detail.tags[0]);
        }
      } else {
        carregarTags();
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userData") {
        refreshUserData();
      }

      if (e.key && e.key.startsWith("tags_") && userData?.pesquisador?.id) {
        const pesquisadorId = e.key.replace("tags_", "");
        if (pesquisadorId === userData.pesquisador.id.toString()) {
          try {
            const novasTags = JSON.parse(e.newValue || "[]");
            setListaDeTags(novasTags);
            if (novasTags.length > 0) {
              setEspecialidade(novasTags[0]);
            }
          } catch (error) {}
        }
      }

      if (e.key && e.key.startsWith("telefone_") && userData?.id) {
        const userId = e.key.replace("telefone_", "");
        if (userId === userData.id.toString()) {
          setTelefone(e.newValue || "Não informado");
        }
      }
    };

    window.addEventListener("userDataUpdated", handleUserDataUpdated);
    window.addEventListener("profileUpdated", handleProfileUpdated);
    window.addEventListener(
      "telefoneUpdated",
      handleTelefoneUpdated as EventListener
    );
    window.addEventListener("tagsUpdated", handleTagsUpdated as EventListener);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("userDataUpdated", handleUserDataUpdated);
      window.removeEventListener("profileUpdated", handleProfileUpdated);
      window.removeEventListener(
        "telefoneUpdated",
        handleTelefoneUpdated as EventListener
      );
      window.removeEventListener(
        "tagsUpdated",
        handleTagsUpdated as EventListener
      );
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [userData, refreshUserData]);

  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  const formatarData = (data: string) => {
    if (!data) return "Data não informada";
    try {
      const date = new Date(data);
      return date.toLocaleDateString("pt-BR");
    } catch (error) {
      return data;
    }
  };

  if (loading) {
    return (
      <LayoutWrapper>
        <div className="flex flex-col bg-white dark:bg-gray-900 w-full min-h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#990000]"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Carregando perfil...
          </p>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <div className="flex flex-col bg-white dark:bg-gray-900 w-full min-h-screen">
        {/* Topo Vermelho */}
        <div className="bg-[#990000] p-4 md:p-6 text-white w-full">
          {/* Botão de Edição */}
          <Link
            href={`/telaEdicaoPesquisador`}
            className="absolute top-4 right-4 bg-white text-[#990000] p-2 rounded-full shadow hover:bg-gray-100 transition cursor-pointer"
            title="Editar Perfil"
          >
            <Pencil size={20} />
          </Link>

          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6 w-full">
            {/* Foto do usuário */}
            <div className="rounded-md flex-shrink-0">
              <Image
                src={userData?.fotoPerfil || "/images/user.png"}
                alt="Foto do usuário"
                width={100}
                height={100}
                className="rounded-lg object-cover w-24 h-24 md:w-32 md:h-32"
                onError={(e) => {
                  e.currentTarget.src = "/images/user.png";
                }}
              />
            </div>

            {/* Nome, Cargo e Tags */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-3xl font-bold mb-1 truncate">
                {nomeExibicao}
              </h1>
              <h2 className="text-base md:text-lg mb-3 text-gray-200">
                {especialidade}
              </h2>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {listaDeTags.length > 0 ? (
                  listaDeTags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-white text-black px-3 py-1 rounded-full text-xs md:text-sm shadow-sm whitespace-nowrap"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-200 text-sm">
                    Nenhuma tag cadastrada
                  </span>
                )}
              </div>

              {/* Botões de Contato e Gerenciar */}
              <div className="flex gap-3 flex-wrap">
                <button
                  className="border border-white text-white px-3 py-2 rounded hover:bg-white hover:text-[#990000] transition whitespace-nowrap text-sm cursor-pointer"
                  onClick={() => setAberto(true)}
                >
                  Contato
                </button>

                <Link
                  href="/gerenciarListas"
                  className="border border-white text-white px-3 py-2 rounded hover:bg-white hover:text-[#990000] transition flex items-center justify-center whitespace-nowrap text-sm cursor-pointer"
                >
                  Gerenciar Listas
                </Link>
              </div>
            </div>

            {/* Info de localização e última atualização */}
            <div className="text-xs md:text-sm text-right self-end text-gray-200">
              <p className="mb-1">{paisNascimento}</p>
              <p>
                Última atualização em {formatarData(dataAtualizacao)} às{" "}
                {horaAtualizacao}
              </p>
            </div>
          </div>
        </div>

        {/* Seção de Conteúdo */}
        <div className="flex-1 p-4 md:p-6 flex flex-col lg:flex-row gap-4 md:gap-6 bg-white dark:bg-gray-900 justify-center items-start">
          {/* Card 1 - Linha do tempo com Artigos */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 min-w-0 max-w-4xl">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Linha do tempo - Artigos Publicados
            </h2>

            <div className="relative border-l-2 border-gray-300 ml-4 space-y-4">
              {dadosPesquisador?.artigos &&
              dadosPesquisador.artigos.length > 0 ? (
                dadosPesquisador.artigos.slice(0, 5).map((artigo, idx) => (
                  <div key={artigo.id || idx} className="flex items-start">
                    <div className="absolute w-3 h-3 bg-red-700 rounded-full -left-1.5 mt-1.5"></div>
                    <div className="ml-6 flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <p className="text-base font-semibold text-black dark:text-white whitespace-nowrap">
                          {artigo.ano || "Ano não informado"}
                        </p>
                        <p className="text-sm text-gray-800 dark:text-gray-300 truncate">
                          {artigo.titulo || "Artigo sem título"}
                        </p>
                      </div>
                      {artigo.doi && (
                        <a
                          href={`https://doi.org/${artigo.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-xs mb-2 inline-block"
                        >
                          DOI: {artigo.doi}
                        </a>
                      )}
                      <button
                        onClick={() =>
                          artigo.doi &&
                          window.open(`https://doi.org/${artigo.doi}`, "_blank")
                        }
                        disabled={!artigo.doi}
                        className="mt-auto w-full border border-[#990000] text-[#990000] dark:text-red-400 py-1 rounded hover:bg-[#990000] hover:text-white transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {artigo.doi ? "Acessar Artigo" : "DOI não disponível"}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    Nenhum artigo publicado encontrado
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Card 2 - Formação Acadêmica Real */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 min-w-0 max-w-4xl">
            <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">
              Formação Acadêmica
            </h2>
            {dadosPesquisador?.formacoesAcademicas &&
            dadosPesquisador.formacoesAcademicas.length > 0 ? (
              <ul className="space-y-3">
                {dadosPesquisador.formacoesAcademicas
                  .slice(0, 3)
                  .map((formacao, idx) => (
                    <li
                      key={formacao.id || idx}
                      className="bg-gray-100 dark:bg-gray-700 p-3 rounded shadow-sm text-black dark:text-white text-sm"
                    >
                      <strong>{formacao.curso || "Curso não informado"}</strong>
                      <br />
                      <span className="text-gray-600 dark:text-gray-300">
                        {formacao.instituicao || "Instituição não informada"}
                      </span>
                      {formacao.anoConclusao && (
                        <span className="text-gray-500 dark:text-gray-400 block mt-1">
                          Conclusão: {formacao.anoConclusao}
                        </span>
                      )}
                      {formacao.nivel && (
                        <span className="text-gray-500 dark:text-gray-400">
                          • {formacao.nivel}
                        </span>
                      )}
                    </li>
                  ))}
              </ul>
            ) : (
              <ul className="space-y-3">
                <li className="bg-gray-100 dark:bg-gray-700 p-3 rounded shadow-sm text-black dark:text-white text-sm">
                  Nenhuma formação acadêmica cadastrada
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Modal Contato com telefone atualizado */}
        {aberto && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 cursor-pointer"
            onClick={() => setAberto(false)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-md relative mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">
                Contato
              </h3>
              <p className="mb-2">
                <strong className="text-black dark:text-white">
                  Telefone:
                </strong>{" "}
                {telefone}
              </p>
              <p className="mb-4">
                <strong className="text-black dark:text-white">Email:</strong>{" "}
                {email}
              </p>
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
                onClick={() => setAberto(false)}
                aria-label="Fechar modal"
              >
                ✖
              </button>
              <button
                className="mt-2 bg-[#990000] text-white px-4 py-2 rounded hover:bg-red-700 transition w-full cursor-pointer"
                onClick={() => setAberto(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </LayoutWrapper>
  );
}
