"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function VerificarEmail() {
  const params = useSearchParams();
  const uniqueId = params.get("codigo");
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [mensagem, setMensagem] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState<string | null>(null);

  useEffect(() => {
    if (!uniqueId) {
      setStatus("error");
      setMensagem("Token de verificação ausente.");
      return;
    }

    const verificar = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/usuarios/verificarEmail?codigo=${uniqueId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();

          setTipoUsuario(data.tipo);

          setStatus("success");
          setMensagem("Seu e-mail foi confirmado com sucesso!");
        } else {
          const data = await res.json();
          setStatus("error");
          setMensagem(data.message || "Token inválido ou expirado.");
        }
      } catch (err) {
        setStatus("error");
        setMensagem("Erro ao conectar com o servidor.");''
      }
    };

    verificar();
  }, [uniqueId, token, router]);

  const rotaPorTipo = () => {
    if (tipoUsuario === "PESQUISADOR") return "/cadastro-pesquisador";
    if (tipoUsuario === "EMPRESA") return "/cadastro-empresa";
    return "/login"; 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-[#990000] to-red-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-48 -translate-x-48"></div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center">
            <Image
              src="/images/logo_1.png"
              alt="Logo"
              width={120}
              height={120}
              quality={100}
              priority
            />
          </div>

          {status === "loading" && (
            <div className="text-center">
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
                    <svg
                      className="w-16 h-16 animate-spin text-[#990000]"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Verificando seu e-mail
              </h1>
              <p className="text-gray-600 text-lg">Isso não vai demorar...</p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="mb-8 flex justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-2xl">
                  <svg
                    className="w-16 h-16 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Tudo certo!
              </h1>
              <p className="text-gray-600 text-lg mb-8">{mensagem}</p>

              <button
                onClick={() => router.push(rotaPorTipo())}
                className="w-full bg-gradient-to-r from-[#b30000] to-[#660000] text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-2xl hover:scale-105 focus:ring-4 focus:ring-red-300"
              >
                Continuar Cadastro
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <div className="mb-8 flex justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-2xl">
                  <svg
                    className="w-16 h-16 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Ops, algo deu errado!
              </h1>
              <p className="text-gray-600 text-lg mb-8">{mensagem}</p>

              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-8">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-red-800 font-medium text-left">
                    O link pode ter expirado ou já foi utilizado anteriormente. Tente fazer login ou solicite um novo e-mail de verificação.
                  </p>
                </div>
              </div>

              <button
                onClick={() => router.push("/login")}
                className="w-full bg-[#990000] hover:bg-red-900 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                Ir para o Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
