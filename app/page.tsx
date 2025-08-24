"use client"

import { useRouter } from "next/navigation";

export default function Inicio() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-700">Bem-vindo!</h1>
        <p className="text-gray-600 mb-6">Clique no botão abaixo para editar seu perfil.</p>
        <button
          onClick={() => router.push("/perfilPesquisador")}
          className="px-6 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition"
        >
          Criar conta de pesquisador
        </button>
         <button
          onClick={() => router.push("/cadastroEmpresa")}
          className="px-6 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition"
        >
          Criar conta da empresa
        </button>
      </div>
    </div>
  );
}
