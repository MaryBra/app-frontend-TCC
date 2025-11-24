"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm fixed w-full top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image
                src="/images/logo_1.png"
                alt="Logo"
                width={150}
                height={150}
                quality={100}
                priority
                className="drop-shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => router.push("/")}
              />
            </div>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className={`transition-all duration-1000 ${
              mounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* 404 Illustration */}
            <div className="mb-8">
              <h1 className="text-9xl font-bold text-[#990000]">
                404
              </h1>
            </div>

            {/* Error Message */}
            <h2
              className={`text-4xl font-bold text-gray-900 mb-4 transition-all duration-1000 delay-200 ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              Página não encontrada
            </h2>

            <p
              className={`text-xl text-gray-600 mb-8 max-w-2xl mx-auto transition-all duration-1000 delay-300 ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              Desculpe, não conseguimos encontrar a página que você está
              procurando. A página pode ter sido movida, excluída ou nunca
              existiu.
            </p>

            {/* Action Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-500 ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-6 py-3 border-2 border-[#990000] text-[#990000] rounded-lg hover:bg-[#990000] hover:text-white transition-all duration-300 hover:shadow-lg"
              >
                <ArrowLeft className="w-5 h-5" />
                Voltar
              </button>

              <button
                onClick={() => router.push("/")}
                className="flex items-center gap-2 px-6 py-3 bg-[#990000] text-white rounded-lg hover:bg-red-800 transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <Home className="w-5 h-5" />
                Ir para Início
              </button>
            </div>

            {/* Helpful Links */}
            <div
              className={`mt-16 p-8 bg-white rounded-lg shadow-md transition-all duration-1000 delay-700 ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <h3 className="text-xl font-bold text-[#990000] mb-4">
                Talvez você esteja procurando por:
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-left">
                <button
                  onClick={() => router.push("/login")}
                  className="p-4 border border-gray-200 rounded-lg hover:border-[#990000] hover:shadow-md transition-all duration-300 text-gray-700 hover:text-[#990000]"
                >
                  <div className="font-semibold mb-1">Fazer Login</div>
                  <div className="text-sm text-gray-500">
                    Acesse sua conta
                  </div>
                </button>

                <button
                  onClick={() => router.push("/criarConta")}
                  className="p-4 border border-gray-200 rounded-lg hover:border-[#990000] hover:shadow-md transition-all duration-300 text-gray-700 hover:text-[#990000]"
                >
                  <div className="font-semibold mb-1">Criar Conta</div>
                  <div className="text-sm text-gray-500">
                    Cadastre-se na plataforma
                  </div>
                </button>

                <button
                  onClick={() => {
                    router.push("/");
                    setTimeout(() => {
                      document
                        .getElementById("contato")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                  className="p-4 border border-gray-200 rounded-lg hover:border-[#990000] hover:shadow-md transition-all duration-300 text-gray-700 hover:text-[#990000]"
                >
                  <div className="font-semibold mb-1">Fale Conosco</div>
                  <div className="text-sm text-gray-500">
                    Entre em contato
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}