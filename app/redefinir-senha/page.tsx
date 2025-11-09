"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function RedefinirSenha() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValido, setTokenValido] = useState(false);
  const [verificandoToken, setVerificandoToken] = useState(true);

  // Verificar se o token é válido
  useEffect(() => {
    const verificarToken = async () => {
      if (!token) {
        setErro("Token de redefinição inválido ou expirado.");
        setVerificandoToken(false);
        return;
      }

      try {
        // Aqui você pode fazer uma chamada para verificar se o token é válido
        // Por enquanto, vamos assumir que é válido se existir
        setTokenValido(true);
      } catch (error) {
        setErro("Token de redefinição inválido ou expirado.");
      } finally {
        setVerificandoToken(false);
      }
    };

    verificarToken();
  }, [token]);

  const validarSenha = (senha: string) => {
    return /^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(senha);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setErro("Token de redefinição não encontrado.");
      return;
    }

    if (!validarSenha(senha)) {
      setErro(
        "A senha deve ter no mínimo 8 caracteres, incluir um número e um caractere especial."
      );
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setErro("");
    setSucesso("");
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:8080/api/usuarios/redefinir-senha",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            novaSenha: senha,
          }),
        }
      );

      if (res.ok) {
        setSucesso(
          "Senha redefinida com sucesso! Redirecionando para o login..."
        );
        setSenha("");
        setConfirmarSenha("");

        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        const errorData = await res.json();
        setErro(errorData.message || "Erro ao redefinir senha");
      }
    } catch (error) {
      console.error("Erro:", error);
      setErro("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  if (verificandoToken) {
    return (
      <div className="flex flex-col md:flex-row h-screen bg-white dark:bg-gray-900">
        <div className="hidden md:flex w-1/3 bg-red-800 items-end justify-start overflow-visible relative">
          <div className="relative h-auto w-[120%] -right-[11.11%]">
            <Image
              src="/images/login.png"
              alt="Login"
              width={500}
              height={900}
              quality={100}
              priority
              className="object-contain drop-shadow-lg absolute bottom-0"
            />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#990000] mx-auto"></div>
            <p className="text-xl mt-4 dark:text-white">Verificando token...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValido) {
    return (
      <div className="flex flex-col md:flex-row h-screen bg-white dark:bg-gray-900">
        <div className="hidden md:flex w-1/3 bg-red-800 items-end justify-start overflow-visible relative">
          <div className="relative h-auto w-[120%] -right-[11.11%]">
            <Image
              src="/images/login.png"
              alt="Login"
              width={500}
              height={900}
              quality={100}
              priority
              className="object-contain drop-shadow-lg absolute bottom-0"
            />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900">
          <div className="text-center">
            <Image
              src="/images/logo_1.png"
              alt="Logo"
              width={150}
              height={150}
              className="mx-auto mb-6"
            />
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Token Inválido
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{erro}</p>
            <Link
              href="/esqueci-senha"
              className="text-[#990000] dark:text-red-400 font-medium hover:underline"
            >
              Solicitar novo link de redefinição
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white dark:bg-gray-900">
      {/* Lado esquerdo: imagem */}
      <div className="hidden md:flex w-1/3 bg-red-800 items-end justify-start overflow-visible relative">
        <div className="relative h-auto w-[120%] -right-[11.11%]">
          <Image
            src="/images/login.png"
            alt="Login"
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
          <Image
            src="/images/logo_1.png"
            alt="Logo"
            width={150}
            height={150}
            quality={100}
            priority
            className="drop-shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer mx-auto"
          />

          <h2 className="text-xl font-semibold mb-4 mt-12 text-center md:text-left dark:text-white">
            Redefinir Senha
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mb-6 text-center md:text-left">
            Digite sua nova senha abaixo.
          </p>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="password"
                placeholder=" "
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="peer w-full border-0 border-b-2 border-gray-500 dark:border-gray-400 bg-transparent dark:bg-gray-900
                           focus:border-red-700 focus:outline-none focus:ring-0
                           text-gray-700 dark:text-white py-2 px-2 transition-colors duration-300"
              />
              <label
                className="absolute left-2 -top-3.5 text-gray-500 dark:text-gray-400 text-sm transition-all
                               peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700 dark:peer-placeholder-shown:text-gray-400
                               peer-placeholder-shown:top-2
                               peer-focus:-top-3.5 peer-focus:text-red-700 peer-focus:text-sm"
              >
                Nova Senha*
              </label>
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder=" "
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
                className="peer w-full border-0 border-b-2 border-gray-500 dark:border-gray-400 bg-transparent dark:bg-gray-900
                           focus:border-red-700 focus:outline-none focus:ring-0
                           text-gray-700 dark:text-white py-2 px-2 transition-colors duration-300"
              />
              <label
                className="absolute left-2 -top-3.5 text-gray-500 dark:text-gray-400 text-sm transition-all
                               peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700 dark:peer-placeholder-shown:text-gray-400
                               peer-placeholder-shown:top-2
                               peer-focus:-top-3.5 peer-focus:text-red-700 peer-focus:text-sm"
              >
                Confirmar Nova Senha*
              </label>
            </div>

            {erro && <p className="text-red-600 text-sm">{erro}</p>}
            {sucesso && <p className="text-green-600 text-sm">{sucesso}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-800 text-white p-3 rounded-lg hover:bg-red-900 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Redefinindo..." : "Redefinir Senha"}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm dark:text-gray-400">
              Lembrou sua senha?{" "}
              <Link
                href="/login"
                className="text-red-700 dark:text-red-400 font-medium hover:underline"
              >
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
