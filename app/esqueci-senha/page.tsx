"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

export default function EsqueciSenha() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);

  const validarEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
        "http://localhost:8080/api/usuarios/esqueci-senha",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );

      if (res.ok) {
        setSucesso(
          "Email de recuperação enviado! Verifique sua caixa de entrada e pasta de spam."
        );
        setEmail("");

        // Redireciona após 3 segundos
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        const errorData = await res.json();
        setErro(errorData.message || "Erro ao enviar email de recuperação");
      }
    } catch (error) {
      console.error("Erro:", error);
      setErro("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-gray-900">
      {/* Lado esquerdo: imagem */}
      <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-[#990000] to-red-800 items-center justify-center relative overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src="/images/login.png"
            alt="Recuperar senha"
            width={500}
            height={600}
            quality={100}
            priority
            className="object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Lado direito: formulário */}
      <div className="flex-1 flex items-center justify-center py-8 px-4 md:px-0">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Image
              src="/images/logo_1.png"
              alt="Logo"
              width={150}
              height={150}
              quality={100}
              priority
              className="drop-shadow-lg mx-auto mb-4"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
              Recuperar Senha
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
              Digite seu email para receber as instruções de recuperação de
              senha.
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
                  className="peer w-full border-0 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-800
                             focus:border-red-700 focus:outline-none focus:ring-0
                             text-gray-700 dark:text-white py-3 px-2 transition-colors duration-300"
                />
                <label
                  className="absolute left-2 -top-3.5 text-gray-500 dark:text-gray-400 text-sm transition-all
                                 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700 dark:peer-placeholder-shown:text-gray-400
                                 peer-placeholder-shown:top-2
                                 peer-focus:-top-3.5 peer-focus:text-red-700 peer-focus:text-sm"
                >
                  Email*
                </label>
              </div>

              {/* Mensagens de status */}
              {erro && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-700 dark:text-red-400 text-sm">
                    {erro}
                  </p>
                </div>
              )}

              {sucesso && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-green-700 dark:text-green-400 text-sm">
                    {sucesso}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#990000] text-white p-3 rounded-lg hover:bg-red-800 
                           transition disabled:opacity-50 disabled:cursor-not-allowed
                           font-medium shadow-sm cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  "Enviar Instruções"
                )}
              </button>
            </form>

            <div className="text-center mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Lembrou sua senha?{" "}
                <Link
                  href="/login"
                  className="text-[#990000] dark:text-red-400 font-medium hover:underline hover:text-red-800 dark:hover:text-red-300"
                >
                  Fazer login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
