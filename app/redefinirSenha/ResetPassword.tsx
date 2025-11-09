"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function NovaSenha() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [codigo, setCodigo] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState("");
  const [verificandoCodigo, setVerificandoCodigo] = useState(true);

  useEffect(() => {
    const codigoParam = searchParams.get("codigo");

    if (!codigoParam) {
      router.replace("/esqueciSenha");
      return;
    }

    const validarCodigo = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/redefinicao/validar?codigo=${codigoParam}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });
        const data = await res.json();

        if (data ==true) {
          setCodigo(codigoParam);
        } else {
          router.replace("/esqueciSenha");
        }
      } catch (error) {
        console.error("Erro ao validar código:", error);
        router.replace("/esqueciSenha");
      } finally {
        // Delay de 300ms para evitar o “flash” visual
        setTimeout(() => setVerificandoCodigo(false), 300);
      }
    };

    validarCodigo();
  }, [searchParams, router]);

  const validarSenha = (senha: string) => {
    if (senha.length < 6) {
      return "A senha deve ter no mínimo 6 caracteres.";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const erroSenha = validarSenha(senha);
    if (erroSenha) {
      setErro(erroSenha);
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    if (!codigo) {
      setErro("Código de redefinição inválido.");
      return;
    }

    setErro("");
    setSucesso("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/redefinicao/alterar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigo: codigo,
          senha: senha,
        }),
      });

      if (res.ok) {
        setSucesso("Senha redefinida com sucesso! Você será redirecionado para o login...");
        setSenha("");
        setConfirmarSenha("");

        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        const data = await res.json();
        setErro(data.message || "Erro ao redefinir a senha. O código pode estar expirado.");
      }
    } catch (error) {
      console.error("Erro:", error);
      setErro("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  if (verificandoCodigo) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white text-red-800 animate-fadeIn">
        {/* Spinner animado */}
        <div className="w-10 h-10 border-4 border-red-300 border-t-red-800 rounded-full animate-spin mb-4"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen animate-fadeIn">
      {/* Lado esquerdo: decorações */}
      <div className="hidden md:flex w-1/3 bg-red-800 items-center justify-center relative overflow-hidden"></div>

      {/* Lado direito: formulário */}
      <div className="flex-1 flex items-start justify-center bg-white pt-12 px-4 md:px-0 transition-opacity duration-500">
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

          <h2 className="text-xl font-semibold mb-4 mt-32 text-center md:text-left text-red-800">
            Criar Nova Senha
          </h2>

          <p className="text-gray-700 text-sm mb-8 text-center md:text-left">
            Digite sua nova senha e confirme-a para concluir a redefinição.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <button
              type="submit"
              disabled={loading || !codigo}
              className="w-full bg-red-800 text-white p-3 rounded-lg hover:bg-red-900 transition disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Redefinindo...
                </div>
              ) : (
                "Confirmar Nova Senha"
              )}
            </button>
          </form>

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
