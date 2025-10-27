"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

export default function Cadastro() {
  const router = useRouter();
  const [abaAtiva, setAbaAtiva] = useState("pesquisador");

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const validarEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validarSenha = (senha: string) =>
    /^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(senha);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!validarEmail(email)) {
      setErro("Digite um email válido.");
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

    setErro(null);
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:8080/api/usuarios/salvarUsuario",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            login: email,
            password: senha,
            tipo_usuario: abaAtiva,
            roles: abaAtiva === "pesquisador" ? ["usuario"] : ["empresa"],
          }),
        }
      );

      if (res.ok) {
        alert("Conta criada com sucesso!");

        const data = await res.json();

        const token = data.token;

        localStorage.setItem("token", token)

        // Redirecionar baseado no tipo de usuário
        if (abaAtiva === "pesquisador") {
          router.push("/perfilPesquisador");
        } else {
          router.push("/cadastro-empresa");
        }
      } else {
        const errorData = await res.json();
        setErro(errorData.message || "Erro ao criar a conta.");
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      setErro("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Lado esquerdo: imagem */}
      <div className="hidden md:flex w-1/3 bg-red-800 items-end justify-center overflow-visible">
        <div className="relative h-screen w-[180%]">
          <Image
            src="/images/cadastro.png"
            alt="Cadastro"
            fill
            quality={100}
            priority
            className="object-cover drop-shadow-lg absolute bottom-0"
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

          <h2 className="text-xl font-semibold mb-8 mt-6 text-center md:text-left">
            Criar Conta
          </h2>

          {/* Abas */}
          <div className="flex space-x-6 mb-6 justify-center md:justify-start">
            <button
              type="button"
              className={`pb-2 ${
                abaAtiva === "pesquisador"
                  ? "border-b-2 border-[#990000] font-semibold text-[#990000]"
                  : "text-gray-500"
              }`}
              onClick={() => setAbaAtiva("pesquisador")}
            >
              Pesquisador
            </button>
            <button
              type="button"
              className={`pb-2 ${
                abaAtiva === "empresa"
                  ? "border-b-2 border-[#990000] font-semibold text-[#990000]"
                  : "text-gray-500"
              }`}
              onClick={() => setAbaAtiva("empresa")}
            >
              Empresa
            </button>
          </div>

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

            <div className="relative">
              <input
                type="password"
                placeholder=" "
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
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
                Confirmar Senha*
              </label>
            </div>

            {erro && <p className="text-red-600 text-sm">{erro}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-800 text-white p-3 rounded-lg hover:bg-red-900 transition disabled:opacity-50"
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            Já tem uma conta?{" "}
            <a href="/login" className="text-red-700 font-medium">
              Entrar
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
