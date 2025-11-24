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
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validarEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validarSenha = (senha: string) =>
    /^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(senha);

  const handleLogoClick = () => {
    window.location.href = "http://localhost:3000";
  };

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
        const data = await res.json();
        console.log(data);

        const token = data.token;
        localStorage.setItem("token", token.token);
        localStorage.setItem("usuarioId", data.usuarioId);

        console.log(email);

        if (email) {
          localStorage.setItem("email", email);
        }

        // Limpa o flag de email enviado ao criar nova conta
        localStorage.removeItem("emailVerificacaoEnviado");

        router.push(`/aguardandoVerificacao`);
      } else {
        const errorData = await res.json();
        setErro(errorData.message || "Erro ao criar a conta.");
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      setErro("Erro ao conectar com o servidor.");
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

          {/* Título em vermelho */}
          <h2 className="text-xl font-semibold mb-8 mt-32 text-center md:text-left text-red-800 dark:text-red-600">
            Criar Conta
          </h2>

          {/* Abas */}
          <div className="flex space-x-6 mb-6 justify-center md:justify-start">
            <button
              type="button"
              className={`pb-2 ${
                abaAtiva === "pesquisador"
                  ? "border-b-2 border-[#990000] dark:border-red-600 font-semibold text-[#990000] dark:text-red-600"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              onClick={() => setAbaAtiva("pesquisador")}
            >
              Pesquisador
            </button>
            <button
              type="button"
              className={`pb-2 ${
                abaAtiva === "empresa"
                  ? "border-b-2 border-[#990000] dark:border-red-600 font-semibold text-[#990000] dark:text-red-600"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              onClick={() => setAbaAtiva("empresa")}
            >
              Empresa
            </button>
          </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirmar Senha*
              </label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
                className="form-input-login"
                placeholder="Confirme sua senha"
              />
            </div>

            {erro && (
              <p className="text-red-600 dark:text-red-400 text-sm">{erro}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-800 dark:bg-red-700 text-white p-3 rounded-xl hover:bg-red-900 dark:hover:bg-red-600 transition disabled:opacity-50 font-medium"
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <p className="text-sm text-center mt-4 text-gray-700 dark:text-gray-300">
            Já tem uma conta?{" "}
            <a
              href="/login"
              className="text-red-700 dark:text-red-400 font-medium"
            >
              Entrar
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
