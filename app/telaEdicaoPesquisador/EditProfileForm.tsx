"use client";

import { useState, useEffect } from "react";
import {
  Search,
  UploadCloud,
  UserRound,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import MenuLateral from "../components/MenuLateral";
import FormField from "../components/FormField";
import { ToggleSwitch } from "../components/ToggleSwitch";
import { PerfilAcademicoTabs } from "../components/editar-perfil-pesquisador/PerfilAcademicoTabs";
import { initialChanges, ChangesMap, mapFormacoesToChanges } from "../types/perfilAcademico.types";
import { FormacoesSection } from "../components/editar-perfil-pesquisador/FormacoesSection";

export default function EditProfileForm() {
  
  const searchParams = useSearchParams();
  const tagsParam = searchParams.get("tags");
  const [idTag, setIdTag] = useState("");
  const initialTags = tagsParam ? tagsParam.split(",") : [];
  const [tags, setTags] = useState<string[]>(initialTags);
  const [newTag, setNewTag] = useState("");

  const [activeTab, setActiveTab] = useState("Formações Acadêmicas");
  const [changes, setChanges] = useState<ChangesMap>(initialChanges);


  interface FormacaoAcademica {
    id: number;
    nivel: string;
    instituicao: string;
    curso: string;
    anoInicio: number;
    anoConclusao: number;
    destaque: boolean;
  }

  const [imagemPerfil, setImagemPerfil] = useState<string | null>(null);
  const [imagemAlterada, setImagemAlterada] = useState(false);
  const [arquivoImagem, setArquivoImagem] = useState<File | null>(null);

  const router = useRouter();

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [originalLogin, setOriginalLogin] = useState("");
  const [nacionalidade, setNacionalidade] = useState("");
  const [compartilharContato, setCompartilharContato] = useState(false);


  const addTag = () => {
    if (newTag.trim()) {
      setTags((t) => [...t, newTag.trim()]);
      setNewTag("");
    }
  };
  
  const removeTag = (i: number) =>
    setTags((t) => t.filter((_, idx) => idx !== i));

  const token = localStorage.getItem("token");
  const usuarioId = localStorage.getItem("usuarioId");
  const pesquisadorId = localStorage.getItem("idPesquisador");
  const emailAtual = localStorage.getItem("email");

  const atualizarTags = (id: number) => {
    return fetch(`http://localhost:8080/api/tags/alterarTag/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        listaTags: tags,
      }),
    }).then((res) => {
      if (!res.ok) {
        throw new Error("Falha ao atualizar as tags");
      }
      return res;
    });
  };

  const atualizarPesquisador = (id: number) => {
    const dadosAtualizados = {
      nomePesquisador: nome,
      sobrenome: sobrenome,
      nacionalidade: nacionalidade,
      ocupacao: especialidade,
    };
    return fetch(
      `http://localhost:8080/api/pesquisadores/alterarPesquisador/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dadosAtualizados),
      }
    ).then((res) => {
      if (!res.ok) {
        throw new Error("Falha ao atualizar pesquisador");
      }
      return res;
    });
  };


  const atualizarFoto = () => {
    if (!arquivoImagem) {
      throw new Error("Nenhum arquivo de imagem selecionado");
    }

    const formData = new FormData();
    formData.append("file", arquivoImagem);
    return fetch(
      `http://localhost:8080/api/pesquisadores/${pesquisadorId}/imagem`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    ).then((res) => {
      if (!res.ok) {
        throw new Error("Falha ao atualizar login");
      }
      return res;
    });
  };

  const prepararFormacoesParaAPI = () => {
  const formacoesAcademicas = changes["Formações Acadêmicas"];

  const adicionadas = formacoesAcademicas
    .filter((item) => item.status === "adicionado")
    .map((item) => item.data);

  const editadas = formacoesAcademicas
    .filter((item) => item.status === "editado")
    .map((item) => item.data);

  const deletadas = formacoesAcademicas
    .filter((item) => item.status === "deletado")
    .map((item) => item.data.id);

  return {
    pesquisadorId: Number(pesquisadorId),
    formacoesAcademicas: {
      adicionadas,
      editadas,
      deletadas,
    },
  };
};

  const atualizarPerfilAcademico = (dados: any) => {
      return fetch(
      `http://localhost:8080/api/pesquisadores/${pesquisadorId}/perfilAcademico`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dados),
      }
    ).then((res) => {
      if (!res.ok) {
        throw new Error("Falha ao atualizar formações acadêmicas");
      }
      return res;
    });
  }

  function addItem(tab: string, data: any) {
    setChanges((prev) => ({
      ...prev,
      [tab]: [{ data, status: "added" }, ...prev[tab]], 
    }));
  }


    function editItem(tab: string, id: number | string, updatedData: any) {
      setChanges((prev) => ({
        ...prev,
        [tab]: prev[tab].map((item) =>
          item.data.id === id
            ? { ...item, data: updatedData, status: item.status === "added" ? "added" : "edited" }
            : item
        ),
      }));
    }

    function deleteItem(tab: string, id: number | string) {
      setChanges((prev) => ({
        ...prev,
        [tab]: prev[tab]
          .map((item) =>
            item.data.id === id
              ? item.status === "added"
                ? null
                : { ...item, status: "deleted" }
              : item
          )
          .filter(Boolean),
      }));
    }

  

  const handleSubmit = async () => {
    const loginFoiAlterado = email !== originalLogin;

     const formacoesParaEnviar = prepararFormacoesParaAPI();
     console.log("=== JSON DAS FORMAÇÕES ACADÊMICAS ===");
      console.log(JSON.stringify(formacoesParaEnviar, null, 2));
      console.log("=====================================");

    try {
      const promessasDeAtualizacao = [
        atualizarTags(Number(idTag)),
        atualizarPesquisador(Number(pesquisadorId)),
      ];

      if (imagemAlterada) {
        promessasDeAtualizacao.push(atualizarFoto());
      }

      await Promise.all(promessasDeAtualizacao);

      if (loginFoiAlterado) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuarioId");
        localStorage.removeItem("tipo_usuario");

        localStorage.setItem("email", email);

        alert(
          "Informações salvas! Como seu login foi alterado, por favor, faça login novamente."
        );
        router.push(`/login`);
      } else {
        alert("Informações salvas com sucesso!");
        router.push(`/pesquisadores/${usuarioId}`);
      }
    } catch (err) {
      console.error("Falha ao salvar as atualizações:", err);
      alert("Erro ao salvar. Por favor, tente novamente.");
    }
  };

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

        localStorage.setItem("idPesquisador", dadosPesquisador.pesquisador.id);
        console.log(dadosPesquisador);
        setNome(dadosPesquisador.pesquisador.nomePesquisador);
        setSobrenome(dadosPesquisador.pesquisador.sobrenome);
        setTags(dadosPesquisador.tags.listaTags);
        setEmail(emailAtual);
        setOriginalLogin(emailAtual);
        setNacionalidade(dadosPesquisador.pesquisador.nacionalidade);
        if (dadosPesquisador.pesquisador.ocupacao != null) {
          setEspecialidade(dadosPesquisador.pesquisador.ocupacao);
        }
        setIdTag(dadosPesquisador.tags.id);


        if (dadosPesquisador?.formacoesAcademicas) {
        setChanges((prev) => ({
          ...prev,
          "Formações Acadêmicas": mapFormacoesToChanges(dadosPesquisador.formacoesAcademicas),
        }));
  }

        const res = await fetch(
          `http://localhost:8080/api/pesquisadores/${pesquisadorId}/imagem`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Erro ao buscar imagem");
        }

        const blob = await res.blob();
        const urlImagem = URL.createObjectURL(blob);
        setImagemPerfil(urlImagem);
      } catch (err) {
        console.error("Erro ao buscar perfil:", err);
      }
    };

    handleDadosPesquisador();
  }, [router]);

  return (
    <div className="flex h-screen bg-gray-100">
      <MenuLateral />

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto bg-transparent rounded-lg p-8 space-y-8">
          {/* Seção de Avatar + Campos */}
          <div className="flex flex-col md:flex-row md:items-center md:space-x-12">

            {/* Avatar */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="w-40 h-40 rounded-full relative bg-gray-200 shadow-md">
                {imagemPerfil ? (
                  <img
                    src={imagemPerfil}
                    alt="Foto do pesquisador"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <UserRound size={120} className="text-gray-400 m-auto mt-7" />
                )}

                <input
                  type="file"
                  id="upload-foto"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const arquivo = e.target.files?.[0];
                    if (arquivo) {
                      const url = URL.createObjectURL(arquivo);
                      setImagemPerfil(url);
                      setArquivoImagem(arquivo);
                      setImagemAlterada(true);
                    }
                  }}
                />

                <button
                  onClick={() => document.getElementById("upload-foto")?.click()}
                  className="absolute -bottom-2 -right-2 bg-red-700 text-white p-2 rounded-full shadow hover:bg-red-800 transition-colors"
                >
                  <UploadCloud size={18} />
                </button>
              </div>
            </div>

            {/* Campos */}
            <div className="flex-1 space-y-4 w-full">

              <h1 className="text-xl font-semibold text-red-700">Editar Perfil</h1>

                <FormField
                  label="Nome"
                  value={nome}
                  onChange={(e: any) => setNome(e.target.value)}
                  placeholder="Adicionar nome"
                  required
                />

                <FormField
                  label="Sobrenome"
                  value={sobrenome}
                  onChange={(e: any) => setSobrenome(e.target.value)}
                  placeholder="Adicionar sobrenome"
                />

                <FormField
                  label="Ocupação/Especialidade"
                  value={especialidade}
                  onChange={(e: any) => setEspecialidade(e.target.value)}
                  placeholder="Adicionar ocupação ou especialidade"
                />
                </div>
          </div>


          {/* Tags */}
          <section className="mt-12 space-y-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Tags</h2>
              <div className="w-full h-px bg-gray-300 mt-1"></div>
            </div>

            {/* Campo de adicionar tag */}
            <div className="flex items-center space-x-2">
              <div className="flex-1">

                <FormField
                  label=""
                  value={newTag}
                  onChange={(e: any) => setNewTag(e.target.value)}
                  placeholder="Adicionar tag"
                />
              </div>

              <button
                onClick={addTag}
                className="bg-red-700 text-white p-2 rounded-xl shadow hover:bg-red-800 transition"
              >
                <Search size={18} />
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="flex flex-wrap gap-3">
              {tags.map((tag, i) => (
                <div key={i} className="relative">
                  <span
                    className="bg-gray-100 border border-gray-300 rounded-full px-4 py-1 pr-6 text-sm text-gray-700 shadow-sm block relative"
                  >
                    {tag}
                  </span>

                  <button
                    onClick={() => removeTag(i)}
                    className="absolute -top-1.5 -right-1.5 bg-red-700 text-red rounded-full w-4 h-4 flex items-center justify-center text-[10px] leading-none shadow hover:bg-red-800 transition"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

        </section>


          {/* Informações de Contato */}
          <section className="mt-12 space-y-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Informações de Contato</h2>
              <div className="w-full h-px bg-gray-300 mt-1"></div>
            </div>

            <ToggleSwitch
              label="Exibir minhas informações de contato para outros usuários"
              value={compartilharContato}
              onChange={(val) => setCompartilharContato(val)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="E-mail"
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  placeholder="Adicionar e-mail"
                  required
                  disabled
                />
              
              <FormField
                label="Telefone"
                value={telefone}
                onChange={(e: any) => setTelefone(e.target.value)}
                placeholder="Adicionar telefone"
              />

              <FormField
                label="Endereço"
                value={telefone}
                onChange={(e: any) => setEmail(e.target.value)}
                placeholder="Adicionar endereço"
              />

              <FormField
                label="Nacionalidade"
                value={nacionalidade}
                onChange={(e: any) => setNacionalidade(e.target.value)}
                placeholder="Adicionar nacionalidade"
              />
            </div>
          </section>

          <section className="mt-12 space-y-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Editar Perfil Acadêmico</h2>
              <div className="w-full h-px bg-gray-300 mt-1"></div>

              <PerfilAcademicoTabs active={activeTab} onChange={setActiveTab} />

              {activeTab === "Formações Acadêmicas" && (
                <FormacoesSection
                  data={changes["Formações Acadêmicas"].filter((i) => i.status !== "deleted").map((i) => i.data)}
                  onAdd={(data) => addItem("Formações Acadêmicas", data)}
                  onEdit={(id, data) => editItem("Formações Acadêmicas", id, data)}
                  onDelete={(id) => deleteItem("Formações Acadêmicas", id)}
                />
              )}

            </div>
          </section>

          {/* Botões de Ação */}
          {/* Botões fixos no canto inferior direito, um pouco mais à esquerda */}
<div className="fixed bottom-0 right-0 flex space-x-4 p-4 z-50 mr-8">
  <button
    className="
      w-48 px-4 py-3 
      border border-gray-400 rounded-lg shadow-md transition 
      text-gray-700 hover:bg-gray-50
    "
    onClick={() => {
      router.push(`/pesquisadores/${usuarioId}`);
    }}
  >
    Cancelar
  </button>

  <button
    className="
      w-48 px-4 py-3 
      text-white rounded-lg shadow-md transition 
      bg-[#990000] hover:bg-red-700
    "
    onClick={() => {
      handleSubmit();
    }}
  >
    Salvar
  </button>
</div>


        </div>
      </main>
    </div>
  );
}
