"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function AguardandoVerificacao() {
  const params = useSearchParams();
  const email = localStorage.getItem("email");
  const emailEnviadoRef = useRef(false);

  useEffect(() => {
    // Verifica se já enviou o email nesta sessão
    const emailJaEnviado = localStorage.getItem("emailVerificacaoEnviado");

    const verificarEmail = async () => {
      // Previne múltiplos envios
      if (emailEnviadoRef.current || emailJaEnviado) {
        console.log("Email já enviado, pulando...");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");
        console.log("Enviando email de verificação para:", email);

        emailEnviadoRef.current = true;
        localStorage.setItem("emailVerificacaoEnviado", "true");

        const res = await fetch(
          `http://localhost:8080/api/email/enviarVerificacao?email=${email}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          console.error("Erro ao verificar e-mail:", res.status);
          // Se deu erro, permite tentar novamente
          emailEnviadoRef.current = false;
          localStorage.removeItem("emailVerificacaoEnviado");
        } else {
          console.log("E-mail enviado com sucesso!");
        }
      } catch (e) {
        console.error("Erro na requisição de verificação:", e);
        // Se deu erro, permite tentar novamente
        emailEnviadoRef.current = false;
        localStorage.removeItem("emailVerificacaoEnviado");
      }
    };

    verificarEmail();
  }, []); // Array de dependências vazio - executa apenas uma vez

  // Função para reenviar email manualmente
  const reenviarEmail = async () => {
    try {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");
      console.log("Reenviando email para:", email);

      const res = await fetch(
        `http://localhost:8080/api/email/enviarVerificacao?email=${email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        console.error("Erro ao reenviar e-mail:", res.status);
        alert("Erro ao reenviar email. Tente novamente.");
      } else {
        console.log("E-mail reenviado com sucesso!");
        alert("Email reenviado com sucesso!");
      }
    } catch (e) {
      console.error("Erro ao reenviar email:", e);
      alert("Erro ao reenviar email. Tente novamente.");
    }
  };

  // Função para ocultar parte do email
  const maskEmail = (email: string | null) => {
    if (!email) return "seu e-mail";
    const [user, domain] = email.split("@");
    if (user.length <= 3) return `${user[0]}***@${domain}`;
    return `${user.slice(0, 3)}***@${domain}`;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12 relative overflow-hidden">
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
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden">
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
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-[#990000]"
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
            </div>
          </motion.div>

          {/* Título */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
            Verifique seu e-mail
          </h1>

          {/* Descrição */}
          <p className="text-gray-600 text-center leading-relaxed mb-6">
            Enviamos um link de confirmação para
            <br />
            <span className="font-semibold text-[#990000] inline-block mt-2">
              {maskEmail(email)}
            </span>
          </p>

          {/* Instruções */}
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 mb-6 border border-red-100">
            <p className="text-gray-700 text-sm text-center leading-relaxed">
              Clique no link recebido para confirmar seu cadastro e ativar sua
              conta. O link é válido por 24 horas.
            </p>
          </div>

          {/* Botão para reenviar email */}
          <div className="text-center mb-6">
            <button
              onClick={reenviarEmail}
              className="text-[#990000] hover:text-red-700 font-medium underline transition"
            >
              Reenviar email de verificação
            </button>
          </div>

          {/* Nota de rodapé */}
          <div className="pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              Não recebeu o e-mail? Verifique sua pasta de spam ou lixo
              eletrônico.
            </p>
          </div>
        </div>

        {/* Link de suporte (opcional) */}
        <p className="text-center mt-6 text-sm text-gray-500">
          Precisa de ajuda?{" "}
          <a
            href="#"
            className="text-[#990000] hover:text-red-700 font-medium transition"
          >
            Entre em contato
          </a>
        </p>
      </motion.div>
    </div>
  );
}
