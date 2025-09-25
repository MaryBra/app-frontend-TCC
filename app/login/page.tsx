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

  const validarEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validarSenha = (senha: string) =>
    /^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(senha);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    setErro(""); // limpa erros

    // Enviar dados para o backend
    try {
      const res = await fetch("http://localhost:8080/api/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "login": email, "password": senha }),
      });

      if (res.ok) {
        const usuarioCriado = await res.json(); // backend retorna id ou dados do usuário
        alert("Conta criada com sucesso!");
        router.push(`/perfilPesquisador/${usuarioCriado.id}`); // redireciona para perfil
      } else {
        const erroData = await res.json();
        alert(erroData.mensagem || "Erro ao criar a conta.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro na requisição ao servidor.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Lado esquerdo: imagem */}
      <div className="hidden md:flex w-1/3 bg-red-800 items-end justify-start overflow-visible relative">
        <div className="relative h-auto w-[120%] -right-[11.11%]">
          <Image
            src="/images/login.png"
            alt="Logo"
            width={500}          // largura customizada
            height={900}         // altura customizada
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

          <h2 className="text-xl font-semibold mb-8 mt-32 text-center md:text-left">
            Entrar
          </h2>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {["Email", "Senha"].map((campo, i) => {
              const stateMap = [email, senha];
              const setStateMap = [setEmail, setSenha];
              const type = campo === "Email" ? "email" : "password";

              return (
                <div key={i} className="relative">
                  <input
                    type={type}
                    placeholder=" "
                    value={stateMap[i]}
                    onChange={(e) => setStateMap[i](e.target.value)}
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
                    {campo}*
                  </label>
                </div>
              );
            })}

            {erro && <p className="text-red-600 text-sm">{erro}</p>}

            <button
              type="submit"
              className="w-full bg-red-800 text-white p-3 rounded-lg hover:bg-red-900 transition"
            >
              Entrar
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            Ainda não possui uma conta?{" "}
            <a href="/criarConta" className="text-red-700 font-medium">
              Criar conta
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
