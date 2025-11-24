"use client";

import Image from "next/image";
import { useState } from "react";

export default function RedefinirSenha() {
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState("");

  const validarEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogoClick = () => {
    window.location.href = "http://localhost:3000";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarEmail(email)) {
      setErro("Digite um email válido.");
      return;
    }

    setErro("");
    setSucesso("");
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8080/api/redefinicao/enviar?email=${email}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.ok || res.status == 404) {
        setSucesso(
          "Se o e-mail estiver cadastrado, o link para redefinição de senha será enviado para a caixa de entrada."
        );
        setEmail("");
      } else {
        const data = await res.json();
        setErro(data.message || "Erro ao enviar o e-mail de redefinição.");
      }
    } catch (error) {
      console.error("Erro:", error);
      setErro("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Lado esquerdo: imagem ilustrativa */}
      <div className="hidden md:flex w-1/3 bg-red-800 items-end justify-start overflow-visible relative">
        <div className="relative h-auto w-[120%] -right-[11.11%]">
          <Image
            src="/images/login.png"
            alt="Redefinir Senha"
            width={500}
            height={900}
            quality={100}
            priority
            className="object-contain drop-shadow-lg absolute bottom-0"
          />
        </div>
      </div>

      {/* Lado direito: formulário */}
      <div className="flex-1 flex items-start justify-center bg-white dark:bg-gray-900 pt-12 px-4 md:px-0">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Image
            src="/images/logo_1.png"
            alt="Logo"
            width={150}
            height={150}
            quality={100}
            priority
            className="drop-shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer mx-auto"
            onClick={handleLogoClick}
          />

          {/* Cabeçalho */}
          <h2 className="text-xl font-semibold mb-4 mt-32 text-center md:text-left text-red-800 dark:text-red-600">
            Redefinir Senha
          </h2>

          {/* Mensagem de instrução */}
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-8 text-center md:text-left">
            Digite o e-mail de sua conta e nós enviaremos um e-mail com o link
            de redefinição de senha.
          </p>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email*
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input-login"
                placeholder="Digite seu email"
              />
            </div>

            {/* Caixa de erro / sucesso */}
            {(erro || sucesso) && (
              <div
                className={`p-3 rounded-lg border text-sm font-medium animate-fadeIn ${
                  erro
                    ? "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300"
                    : "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300"
                }`}
              >
                {erro || sucesso}
              </div>
            )}

            {/* Botão de envio */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-800 dark:bg-red-700 text-white p-3 rounded-xl hover:bg-red-900 dark:hover:bg-red-600 transition disabled:opacity-50 font-medium"
            >
              {loading
                ? "Enviando..."
                : "Enviar e-mail de redefinição de senha"}
            </button>
          </form>

          {/* Link Voltar */}
          <p className="text-sm text-center mt-3 text-gray-700 dark:text-gray-300">
            <a
              href="/login"
              className="text-red-800 dark:text-red-400 font-medium hover:text-red-900 dark:hover:text-red-300 transition-colors"
            >
              Voltar para o login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
