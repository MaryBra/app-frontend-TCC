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

        const tokenContent = jwtDecode<TokenPayload>(data.token)
        
        // Se a conta não for verificada, mandamos para a tela de verificação
        if (tokenContent.conta_verificada == false) {
          localStorage.setItem("email", email);
          router.push("/aguardandoVerificacao");
        } 

        else {

          switch (tokenContent.tipo_usuario) {
            // Se tiver cadastro de pesquisador não concluído
            case "pesquisador_pendente":
              router.push("/cadastro-pesquisador")
              break;

            // Se tiver cadastro de empresa não concluído
            case "empresa_pendente":
              router.push("/cadastro-empresa")
              break;
            
            // Se tiver cadastro concluído
            case "empresa":
            case "pesquisador":
              localStorage.setItem("tipo_usuario", tokenContent.tipo_usuario)
              localStorage.setItem("id_usuario", String(tokenContent.id_usuario))
              router.push("/home");
              break;
            
            // Se não estiver nada definido
            default:
              setErro("Conta indefinida. Contate o suporte.")

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
      <div className="flex-1 flex items-start justify-center bg-white pt-12 px-4 md:px-0">
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

          <h2 className="text-xl font-semibold mb-8 mt-32 text-center md:text-left text-red-800">
            Entrar
          </h2>

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

            <div className="relative">
              <input
                type="password"
                placeholder=" "
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
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
                Senha*
              </label>
            </div>

            {/* Link de esqueci minha senha */}
            <div className="text-right -mt-4">
              <a
                href="/esqueciSenha"
                className="text-sm text-red-700 font-medium hover:text-red-900 transition-colors"
              >
                Esqueci minha senha
              </a>
            </div>

            {/* Caixa de erro acima do botão */}
            {erro && (
              <div className="mt-2 mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-700 text-sm font-medium animate-fadeIn">
                {erro}
              </div>
            )}

            {/* Botão de envio */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-800 text-white p-3 rounded-lg hover:bg-red-900 transition disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="text-sm text-center mt-4 text-gray-700">
            Ainda não possui uma conta?{" "}
            <a
              href="/criarConta"
              className="text-red-800 font-medium hover:text-red-900 transition-colors"
            >
              Criar conta
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
