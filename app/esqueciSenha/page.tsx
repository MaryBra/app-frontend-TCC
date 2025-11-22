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
      <div className="flex-1 flex items-start justify-center bg-white pt-12 px-4 md:px-0">
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
          <h2 className="text-xl font-semibold mb-4 mt-32 text-center md:text-left text-red-800">
            Redefinir Senha
          </h2>

          {/* Mensagem de instrução */}
          <p className="text-gray-700 text-sm mb-8 text-center md:text-left">
            Digite o e-mail de sua conta e nós enviaremos um e-mail com o link
            de redefinição de senha.
          </p>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="peer w-full border-0 border-b-2 border-gray-500 bg-transparent
                         focus:border-red-700 focus:outline-none focus:ring-0
                         text-gray-700 py-2 px-2 transition-colors duration-300"
              />
              <label
                className="absolute left-2 -top-3.5 text-gray-500 text-sm transition-all
                             peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700
                             peer-placeholder-shown:top-2
                             peer-focus:-top-3.5 peer-focus:text-red-700 peer-focus:text-sm"
              >
                Email*
              </label>
            </div>

            {/* Caixa de erro / sucesso */}
            {(erro || sucesso) && (
              <div
                className={`p-3 rounded-lg border text-sm font-medium animate-fadeIn ${
                  erro
                    ? "bg-red-100 border-red-300 text-red-700"
                    : "bg-green-100 border-green-300 text-green-700"
                }`}
              >
                {erro || sucesso}
              </div>
            )}

            {/* Botão de envio */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-800 text-white p-3 rounded-lg hover:bg-red-900 transition disabled:opacity-50"
            >
              {loading
                ? "Enviando..."
                : "Enviar e-mail de redefinição de senha"}
            </button>
          </form>

          {/* Link Voltar */}
          <p className="text-sm text-center mt-3 text-gray-700">
            <a
              href="/login"
              className="text-red-800 font-medium hover:text-red-900 transition-colors"
            >
              Voltar para o login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
