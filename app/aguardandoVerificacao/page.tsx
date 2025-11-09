"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AguardandoVerificacao() {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [operationType, setOperationType] = useState<
    "resend" | "change" | null
  >(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleResendCode = async () => {
    setIsLoading(true);
    setOperationType("resend");
    setMessage("");

    try {
      const res = await fetch(
        `http://localhost:8080/api/email/reenviarVerificacao?email=${encodeURIComponent(
          email
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await res.json();

      if (res.ok) {
        setMessage(
          result.message ||
            "Código reenviado com sucesso! Verifique seu e-mail."
        );
      } else {
        setMessage(result.error || "Erro ao reenviar código. Tente novamente.");
      }
    } catch (e) {
      setMessage("Erro ao conectar com o servidor.");
    } finally {
      setIsLoading(false);
      setOperationType(null);
    }
  };

  const handleChangeEmail = async () => {
    if (!newEmail || !newEmail.includes("@")) {
      setMessage("Por favor, insira um e-mail válido.");
      return;
    }

    if (newEmail === email) {
      setMessage("O novo e-mail deve ser diferente do atual.");
      return;
    }

    setIsLoading(true);
    setOperationType("change");
    setMessage("");

    try {
      const res = await fetch(
        `http://localhost:8080/api/email/alterarEmail?emailAntigo=${encodeURIComponent(
          email
        )}&emailNovo=${encodeURIComponent(newEmail)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await res.json();

      if (res.ok) {
        // Atualiza o email no estado e localStorage
        setEmail(newEmail);
        localStorage.setItem("email", newEmail);
        setShowChangeEmail(false);
        setNewEmail("");
        setMessage(
          result.message ||
            "E-mail alterado com sucesso! Verifique seu novo e-mail para o código de verificação."
        );
      } else {
        setMessage(result.error || "Erro ao alterar e-mail.");
      }
    } catch (e) {
      setMessage("Erro ao conectar com o servidor.");
    } finally {
      setIsLoading(false);
      setOperationType(null);
    }
  };

  // Função para ocultar parte do email
  const maskEmail = (email: string) => {
    if (!email) return "seu e-mail";
    const [user, domain] = email.split("@");
    if (user.length <= 3) return `${user[0]}***@${domain}`;
    return `${user.slice(0, 3)}***@${domain}`;
  };

  const getButtonText = () => {
    if (isLoading) {
      if (operationType === "resend") return "Enviando...";
      if (operationType === "change") return "Alterando...";
      return "Processando...";
    }
    return "Reenviar Código";
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#990000] opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#990000] opacity-5 rounded-full blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        {/* Card principal */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden">
          {/* Detalhe decorativo vermelho no topo */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#990000] via-red-600 to-[#990000]"></div>

          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Image
                src="/images/logo_1.png"
                alt="Logo"
                width={180}
                height={180}
                quality={100}
                priority
                className="drop-shadow-lg"
              />
            </motion.div>
          </div>

          {/* Ícone de email */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="mb-6 flex justify-center"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-[#990000] dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-full bg-[#990000] opacity-20 animate-ping"></div>
            </div>
          </motion.div>

          {/* Título */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Verifique seu e-mail
          </h1>

          {/* Descrição */}
          <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed mb-6">
            Enviamos um link de confirmação para
            <br />
            <span className="font-semibold text-[#990000] dark:text-red-400 inline-block mt-2">
              {maskEmail(email)}
            </span>
          </p>

          {/* Mensagem de status */}
          {message && (
            <div
              className={`mb-4 p-3 rounded-lg text-center ${
                message.includes("sucesso") || message.includes("enviado")
                  ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                  : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
              }`}
            >
              {message}
            </div>
          )}

          {/* Formulário para alterar email */}
          {showChangeEmail && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4 space-y-3"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Novo e-mail
                </label>
                <input
                  type="email"
                  placeholder="Digite seu novo e-mail"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#990000] dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowChangeEmail(false);
                    setNewEmail("");
                    setMessage("");
                  }}
                  className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleChangeEmail}
                  className="flex-1 px-4 py-2 bg-[#990000] text-white rounded-lg hover:bg-red-800 disabled:opacity-50 cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading && operationType === "change"
                    ? "Alterando..."
                    : "Alterar E-mail"}
                </button>
              </div>
            </motion.div>
          )}

          {/* Instruções */}
          <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-6 mb-6 border border-red-100 dark:border-red-800">
            <p className="text-gray-700 dark:text-gray-300 text-sm text-center leading-relaxed">
              Clique no link recebido para confirmar seu cadastro e ativar sua
              conta. O link é válido por 24 horas.
            </p>
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col gap-3 mb-4">
            <button
              onClick={handleResendCode}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-[#990000] text-white rounded-lg hover:bg-red-800 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {getButtonText()}
            </button>

            {!showChangeEmail && (
              <button
                onClick={() => setShowChangeEmail(true)}
                disabled={isLoading}
                className="w-full px-4 py-2 text-[#990000] dark:text-red-400 border border-[#990000] dark:border-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition-colors cursor-pointer"
              >
                Alterar E-mail
              </button>
            )}
          </div>

          {/* Nota de rodapé */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed">
              Não recebeu o e-mail? Verifique sua pasta de spam ou lixo
              eletrônico.
            </p>
          </div>
        </div>

        {/* Link de suporte */}
        <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          Precisa de ajuda?{" "}
          <a
            href="#"
            className="text-[#990000] dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition cursor-pointer"
          >
            Entre em contato
          </a>
        </p>
      </motion.div>
    </div>
  );
}
