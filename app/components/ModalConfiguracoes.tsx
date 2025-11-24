"use client";

import { useState, useEffect } from "react";
import { X, Trash2, Sun, Moon, Monitor } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalConfiguracoes({
  isOpen,
  onClose,
}: SettingsModalProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [email, setEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [temaSelecionado, setTemaSelecionado] = useState("system");

  // Estados para feedback visual
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    setMounted(true);
    // Carregar tema atual ao abrir o modal
    setTemaSelecionado(theme || "system");
  }, [theme]);

  useEffect(() => {
    if (isOpen) {
      const emailSalvo = localStorage.getItem("email") || "";
      setEmail(emailSalvo);
      // Limpar campos ao abrir o modal
      setNovaSenha("");
      setConfirmarSenha("");
      setErro("");
      setSucesso("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // --- FUNÇÃO PARA SALVAR CONFIGURAÇÕES ---
  const handleSave = async () => {
    setErro("");
    setSucesso("");

    // 1. Aplicar o tema selecionado (só aplica quando salva)
    setTheme(temaSelecionado);

    // 2. Se há senha para alterar, validar e enviar
    if (novaSenha || confirmarSenha) {
      if (!novaSenha || !confirmarSenha) {
        setErro("Preencha os campos de senha para alterar.");
        return;
      }
      if (novaSenha.length < 6) {
        setErro("A senha deve ter no mínimo 6 caracteres.");
        return;
      }
      if (novaSenha !== confirmarSenha) {
        setErro("As senhas não coincidem.");
        return;
      }

      // Pega dados do LocalStorage
      const token = localStorage.getItem("token");
      const usuarioId = localStorage.getItem("usuarioId");

      if (!token || !usuarioId) {
        setErro("Erro de autenticação.");
        return;
      }

      setLoading(true);

      try {
        const res = await fetch(
          `http://localhost:8080/api/usuarios/alterarSenha/${usuarioId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              senha: novaSenha,
            }),
          }
        );

        if (res.ok) {
          setSucesso("Senha alterada com sucesso!");
          setNovaSenha("");
          setConfirmarSenha("");
        } else {
          const errorText = await res.text();
          throw new Error(errorText || "Erro ao alterar senha.");
        }
      } catch (error: any) {
        console.error(error);
        setErro(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Se não há senha para alterar, apenas mostrar sucesso do tema
      setSucesso("Configurações salvas com sucesso!");
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  // --- FUNÇÃO DE EXCLUIR CONTA ---
  const handleDeleteAccount = async () => {
    const confirmacao = confirm(
      "Tem certeza que deseja excluir sua conta permanentemente? Todos os seus dados serão perdidos."
    );

    if (!confirmacao) return;

    const token = localStorage.getItem("token");
    const usuarioId = localStorage.getItem("usuarioId");

    if (!token || !usuarioId) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8080/api/usuarios/excluir/${usuarioId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        localStorage.clear();
        onClose();
        router.push("/");
      } else {
        throw new Error("Falha ao excluir conta.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 w-[600px] rounded-lg shadow-xl overflow-hidden transition-colors duration-300">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-custom-red dark:text-red-400 w-full text-center">
            Configurações da Conta
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 absolute right-4 top-4"
          >
            <X size={24} />
          </button>
        </div>

        {/* Corpo */}
        <div className="p-8 space-y-6">
          {/* Seção de Tema */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Aparência
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setTemaSelecionado("light")}
                className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                  temaSelecionado === "light"
                    ? "border-custom-red dark:border-red-400 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
              >
                <Sun
                  className={`w-8 h-8 mb-2 ${
                    temaSelecionado === "light"
                      ? "text-custom-red dark:text-red-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                />
                <span
                  className={`font-medium ${
                    temaSelecionado === "light"
                      ? "text-custom-red dark:text-red-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Claro
                </span>
              </button>

              <button
                onClick={() => setTemaSelecionado("dark")}
                className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                  temaSelecionado === "dark"
                    ? "border-custom-red dark:border-red-400 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
              >
                <Moon
                  className={`w-8 h-8 mb-2 ${
                    temaSelecionado === "dark"
                      ? "text-custom-red dark:text-red-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                />
                <span
                  className={`font-medium ${
                    temaSelecionado === "dark"
                      ? "text-custom-red dark:text-red-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Escuro
                </span>
              </button>

              <button
                onClick={() => setTemaSelecionado("system")}
                className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                  temaSelecionado === "system"
                    ? "border-custom-red dark:border-red-400 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
              >
                <Monitor
                  className={`w-8 h-8 mb-2 ${
                    temaSelecionado === "system"
                      ? "text-custom-red dark:text-red-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                />
                <span
                  className={`font-medium ${
                    temaSelecionado === "system"
                      ? "text-custom-red dark:text-red-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Sistema
                </span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Email cadastrado
            </label>
            <input
              type="text"
              value={email}
              readOnly
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-400 cursor-not-allowed transition-colors duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Nova senha
            </label>
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800 text-gray-900 dark:text-gray-300 transition-colors duration-300"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Confirmar nova senha
            </label>
            <input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800 text-gray-900 dark:text-gray-300 transition-colors duration-300"
            />
          </div>

          {/* Área de Mensagens de Erro/Sucesso */}
          {(erro || sucesso) && (
            <div
              className={`p-3 rounded text-sm font-medium text-center transition-colors duration-300 ${
                erro
                  ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                  : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
              }`}
            >
              {erro || sucesso}
            </div>
          )}

          {/* Botão Excluir */}
          <button
            onClick={handleDeleteAccount}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2 bg-red-50 dark:bg-red-900/20 text-custom-red dark:text-red-400 border border-red-200 dark:border-red-800 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-300 disabled:opacity-50 mt-4"
          >
            {loading ? (
              "Processando..."
            ) : (
              <>
                <Trash2 size={18} />
                Excluir Conta
              </>
            )}
          </button>
        </div>

        {/* Rodapé */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 transition font-medium"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 rounded bg-custom-red dark:bg-red-700 text-white hover:bg-custom-red-dark dark:hover:bg-red-600 transition font-medium disabled:opacity-50"
          >
            {loading ? "Gravando..." : "Gravar"}
          </button>
        </div>
      </div>
    </div>
  );
}
