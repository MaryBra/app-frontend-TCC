"use client";

import { useState, useEffect, useRef } from "react";
import { Trash2, Search, Camera } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LayoutWrapper from "../components/LayoutWrapper";
import { useUser } from "../contexts/UserContext";

export default function EditProfileForm() {
  const router = useRouter();
  const { userData, refreshUserData, updateUserPhoto } = useUser();

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    nomePesquisador: "",
    sobrenome: "",
    dataNascimento: "",
    nacionalidade: "",
    paisNascimento: "",
    nomeCitacoesBibliograficas: "",
    telefone: "",
    email: "",
  });

  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [tagId, setTagId] = useState<number | null>(null);
  const [pesquisadorId, setPesquisadorId] = useState<number | null>(null);
  const [dadosCarregados, setDadosCarregados] = useState(false);

  const formatarTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const limited = numbers.slice(0, 11);

    if (limited.length <= 10) {
      return limited
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    } else {
      return limited
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }
  };

  useEffect(() => {
    const carregarDados = async () => {
      if (!userData) {
        return;
      }

      const id = userData.pesquisador?.id;
      if (!id) {
        return;
      }

      setPesquisadorId(id);

      if (userData.pesquisador) {
        let telefoneParaPreencher = userData.pesquisador.telefone || "";

        if (!telefoneParaPreencher && userData.id) {
          const telefoneSalvo = localStorage.getItem(`telefone_${userData.id}`);
          if (telefoneSalvo) {
            telefoneParaPreencher = telefoneSalvo;
          }
        }

        setFormData({
          nomePesquisador: userData.pesquisador.nomePesquisador || "",
          sobrenome: userData.pesquisador.sobrenome || "",
          dataNascimento: userData.pesquisador.dataNascimento || "",
          nacionalidade: userData.pesquisador.nacionalidade || "",
          paisNascimento: userData.pesquisador.paisNascimento || "",
          nomeCitacoesBibliograficas:
            userData.pesquisador.nomeCitacoesBibliograficas || "",
          telefone: telefoneParaPreencher,
          email: userData.login || "",
        });
      }

      await carregarTags(id);
      carregarImagemPerfil();

      setDadosCarregados(true);
    };

    carregarDados();
  }, [userData]);

  const carregarTags = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/tags/pesquisador/${id}`,
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
          if (Array.isArray(tagsData)) {
            tagsArray = tagsData;
          } else if (Array.isArray(tagsData.listaTags)) {
            tagsArray = tagsData.listaTags;
          } else if (Array.isArray(tagsData.tags)) {
            tagsArray = tagsData.tags;
          } else if (tagsData.id && Array.isArray(tagsData.listaTags)) {
            tagsArray = tagsData.listaTags;
            setTagId(tagsData.id);
          } else if (tagsData.nome) {
            tagsArray = [tagsData.nome];
          } else {
            for (const key in tagsData) {
              if (Array.isArray(tagsData[key]) && tagsData[key].length > 0) {
                tagsArray = tagsData[key];
                break;
              }
            }
          }
        }

        if (tagsArray.length > 0) {
          setTags(tagsArray);
          localStorage.setItem(`tags_${id}`, JSON.stringify(tagsArray));
        } else {
          await carregarTagsDoLocalStorage(id);
        }
      } else if (response.status === 404) {
        await carregarTagsDoLocalStorage(id);
      } else {
        await carregarTagsDoLocalStorage(id);
      }
    } catch (error) {
      await carregarTagsDoLocalStorage(id);
    }
  };

  const carregarTagsDoLocalStorage = async (id: number) => {
    const tagsSalvas = localStorage.getItem(`tags_${id}`);

    if (tagsSalvas) {
      try {
        const tagsArray = JSON.parse(tagsSalvas);
        if (tagsArray.length > 0) {
          setTags(tagsArray);
        } else {
          setTags([]);
        }
      } catch (error) {
        setTags([]);
      }
    } else {
      setTags([]);
    }
  };

  const carregarImagemPerfil = () => {
    if (userData?.fotoPerfil) {
      setImagePreview(userData.fotoPerfil);
    } else {
      const savedPhoto = localStorage.getItem(`userPhoto_${userData?.id}`);
      if (savedPhoto) {
        setImagePreview(savedPhoto);
      } else {
        setImagePreview("/images/user.png");
      }
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecione um arquivo de imagem válido.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("A imagem deve ter no máximo 5MB.");
        return;
      }

      setSelectedImage(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "telefone") {
      const formattedValue = formatarTelefone(value);
      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const addTag = () => {
    const tagFormatada = newTag.trim();

    if (tagFormatada === "") {
      alert("Por favor, digite uma tag válida");
      return;
    }

    if (tags.includes(tagFormatada)) {
      alert("Esta tag já foi adicionada");
      return;
    }

    const novasTags = [...tags, tagFormatada];
    setTags(novasTags);
    setNewTag("");

    if (pesquisadorId) {
      localStorage.setItem(`tags_${pesquisadorId}`, JSON.stringify(novasTags));
    }
  };

  const removeTag = (tagParaRemover: string) => {
    const novasTags = tags.filter((tag) => tag !== tagParaRemover);
    setTags(novasTags);

    if (pesquisadorId) {
      localStorage.setItem(`tags_${pesquisadorId}`, JSON.stringify(novasTags));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const updateTags = async (): Promise<boolean> => {
    if (!pesquisadorId) {
      return false;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return false;
      }

      const tagData = {
        pesquisador: { id: pesquisadorId },
        listaTags: tags,
      };

      const response = await fetch(`http://localhost:8080/api/tags/salvarTag`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tagData),
      });

      if (response.ok) {
        localStorage.setItem(`tags_${pesquisadorId}`, JSON.stringify(tags));
        return true;
      } else {
        localStorage.setItem(`tags_${pesquisadorId}`, JSON.stringify(tags));
        return false;
      }
    } catch (error) {
      localStorage.setItem(`tags_${pesquisadorId}`, JSON.stringify(tags));
      return false;
    }
  };

  const handleUpdateProfile = async () => {
    if (!pesquisadorId) {
      alert("ID do pesquisador não encontrado.");
      return;
    }

    if (!formData.nomePesquisador.trim() || !formData.sobrenome.trim()) {
      alert("Nome e sobrenome são obrigatórios.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token não encontrado");
      }

      const telefoneParaEnviar =
        formData.telefone.trim() !== ""
          ? formData.telefone
          : userData?.pesquisador?.telefone || "";

      const perfilResponse = await fetch(
        `http://localhost:8080/api/pesquisadores/atualizarPerfil/${pesquisadorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nomePesquisador: formData.nomePesquisador,
            sobrenome: formData.sobrenome,
            dataNascimento: formData.dataNascimento || null,
            nacionalidade: formData.nacionalidade,
            paisNascimento: formData.paisNascimento,
            nomeCitacoesBibliograficas: formData.nomeCitacoesBibliograficas,
            telefone: telefoneParaEnviar,
          }),
        }
      );

      if (!perfilResponse.ok) {
        const errorText = await perfilResponse.text();
        throw new Error(`Erro ao atualizar perfil: ${errorText}`);
      }

      if (selectedImage) {
        await uploadImage();
      }

      await updateTags();
      await refreshUserData();

      if (userData) {
        const userDataAtualizado = {
          ...userData,
          nome: `${formData.nomePesquisador} ${formData.sobrenome}`.trim(),
          pesquisador: {
            ...userData.pesquisador,
            id: pesquisadorId,
            nomePesquisador: formData.nomePesquisador,
            sobrenome: formData.sobrenome,
            nomeCompleto:
              `${formData.nomePesquisador} ${formData.sobrenome}`.trim(),
            telefone: telefoneParaEnviar,
            nacionalidade: formData.nacionalidade,
            paisNascimento: formData.paisNascimento,
            dataNascimento: formData.dataNascimento,
            nomeCitacoesBibliograficas: formData.nomeCitacoesBibliograficas,
          },
        };
        localStorage.setItem("userData", JSON.stringify(userDataAtualizado));

        if (telefoneParaEnviar) {
          localStorage.setItem(`telefone_${userData.id}`, telefoneParaEnviar);
        }
      }

      window.dispatchEvent(new Event("userDataUpdated"));
      window.dispatchEvent(new CustomEvent("profileUpdated"));
      window.dispatchEvent(
        new CustomEvent("telefoneUpdated", {
          detail: { telefone: telefoneParaEnviar },
        })
      );
      window.dispatchEvent(
        new CustomEvent("tagsUpdated", {
          detail: { tags: tags },
        })
      );

      alert("Perfil atualizado com sucesso!");
      router.push("/telaPerfil");
    } catch (error: any) {
      alert(error.message || "Erro ao atualizar perfil. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (): Promise<boolean> => {
    if (!selectedImage || !pesquisadorId) return true;

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/pesquisadores/${pesquisadorId}/imagem`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        if (imagePreview && userData) {
          updateUserPhoto(imagePreview);
          localStorage.setItem(`userPhoto_${userData.id}`, imagePreview);
        }
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  return (
    <LayoutWrapper>
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8 space-y-8">
          {/* Cabeçalho */}
          <div className="flex justify-between items-center border-b pb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#990000] dark:text-red-400">
                Editar Perfil
              </h1>
            </div>
            <button
              onClick={() => router.push("/telaPerfil")}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
            >
              Cancelar
            </button>
          </div>

          {/* Seção de Foto */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200">
                <Image
                  src={imagePreview || "/images/user.png"}
                  alt="Foto do perfil"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/images/user.png";
                  }}
                />
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 right-2 bg-[#990000] text-white p-2 rounded-full shadow-lg hover:bg-red-800 transition cursor-pointer"
                title="Alterar foto"
              >
                <Camera size={16} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* Formulário */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  name="nomePesquisador"
                  value={formData.nomePesquisador}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#990000] focus:border-transparent transition dark:bg-gray-700 dark:text-white"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sobrenome *
                </label>
                <input
                  type="text"
                  name="sobrenome"
                  value={formData.sobrenome}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#990000] focus:border-transparent transition dark:bg-gray-700 dark:text-white"
                  placeholder="Seu sobrenome"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#990000] focus:border-transparent transition dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nacionalidade
                </label>
                <input
                  type="text"
                  name="nacionalidade"
                  value={formData.nacionalidade}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#990000] focus:border-transparent transition dark:bg-gray-700 dark:text-white"
                  placeholder="Sua nacionalidade"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  País de Nascimento
                </label>
                <input
                  type="text"
                  name="paisNascimento"
                  value={formData.paisNascimento}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#990000] focus:border-transparent transition dark:bg-gray-700 dark:text-white"
                  placeholder="País onde nasceu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome em Citações
                </label>
                <input
                  type="text"
                  name="nomeCitacoesBibliograficas"
                  value={formData.nomeCitacoesBibliograficas}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#990000] focus:border-transparent transition dark:bg-gray-700 dark:text-white"
                  placeholder="Nome para citações bibliográficas"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="border-t pt-8">
            <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Tags de Especialização ({tags.length})
            </label>

            <div className="w-full min-h-32 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 mb-4">
              {tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 border-2 border-gray-200 dark:border-gray-600 rounded-full px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-semibold shadow-sm"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-red-600 hover:text-red-800 transition-colors cursor-pointer ml-1"
                        title="Remover tag"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-20">
                  <p className="text-gray-500 dark:text-gray-400">
                    Nenhuma tag adicionada
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite uma tag e pressione Enter"
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#990000] focus:border-transparent transition dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={addTag}
                className="bg-[#990000] text-white px-6 py-3 rounded-lg hover:bg-red-800 transition cursor-pointer flex items-center gap-2"
                type="button"
              >
                <Search size={16} />
                Adicionar
              </button>
            </div>
          </div>

          {/* Informações de Contato */}
          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Informações de Contato
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  readOnly
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Telefone
                </label>
                <input
                  type="text"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  maxLength={15}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#990000] focus:border-transparent transition dark:bg-gray-700 dark:text-white"
                  placeholder="(XX) XXXXX-XXXX"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1"></p>
              </div>
            </div>
          </div>

          {/* Botão Salvar */}
          <div className="flex justify-end pt-8 border-t">
            <button
              onClick={handleUpdateProfile}
              disabled={loading}
              className="bg-[#990000] text-white px-8 py-4 rounded-lg hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer flex items-center gap-3 font-semibold text-lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </button>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
