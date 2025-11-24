"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { TokenPayload } from "../types/auth.types";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

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
    if (!senha) {
      setErro("Senha é obrigatória.");
      return;
    }

    setErro("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: email,
          password: senha,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);

        const tokenContent = jwtDecode<TokenPayload>(data.token);

        // Se a conta não for verificada, mandamos para a tela de verificação
        if (tokenContent.conta_verificada == false) {
          localStorage.setItem("email", email);
          router.push("/aguardandoVerificacao");
        } else {
          switch (tokenContent.tipo_usuario) {
            // Se tiver cadastro de pesquisador não concluído
            case "pesquisador_pendente":
              router.push("/cadastro-pesquisador");
              break;

            // Se tiver cadastro de empresa não concluído
            case "empresa_pendente":
              router.push("/cadastro-empresa");
              break;

            // Se tiver cadastro concluído
            case "empresa":
            case "pesquisador":
              localStorage.setItem("tipo_usuario", tokenContent.tipo_usuario);
              // localStorage.setItem(
              //   "usuarioId",
              //   String(tokenContent.id_usuario)
              // );
              // console.log(tokenContent.id_usuario)
              router.push("/home");
              break;

            // Se não estiver nada definido
            default:
              setErro("Conta indefinida. Contate o suporte.");
          }
        }
      } else {
        const errorData = await res.json();
        setErro(errorData.message || "Credenciais inválidas");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      setErro("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
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
            onClick={handleLogoClick}
          />

          <h2 className="text-xl font-semibold mb-8 mt-32 text-center md:text-left text-red-800 dark:text-red-600">
            Entrar
          </h2>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Senha*
              </label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="form-input-login"
                placeholder="Digite sua senha"
              />
            </div>

            {/* Link de esqueci minha senha */}
            <div className="text-right -mt-4">
              <a
                href="/esqueciSenha"
                className="text-sm text-red-700 dark:text-red-400 font-medium hover:text-red-900 dark:hover:text-red-300 transition-colors"
              >
                Esqueci minha senha
              </a>
            </div>

            {/* Caixa de erro acima do botão */}
            {erro && (
              <div className="mt-2 mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 text-sm font-medium animate-fadeIn">
                {erro}
              </div>
            )}

            {/* Botão de envio */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-800 dark:bg-red-700 text-white p-3 rounded-xl hover:bg-red-900 dark:hover:bg-red-600 transition disabled:opacity-50 font-medium"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="text-sm text-center mt-4 text-gray-700 dark:text-gray-300">
            Ainda não possui uma conta?{" "}
            <a
              href="/criarConta"
              className="text-red-800 dark:text-red-400 font-medium hover:text-red-900 dark:hover:text-red-300 transition-colors"
            >
              Criar conta
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
