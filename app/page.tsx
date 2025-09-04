"use client"

import { useRouter } from "next/navigation";

export default function Inicio() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-700">Landing page</h1>
        <button
          onClick={() => router.push("/criarConta")}
          className="px-6 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition"
        >
          Criar conta
        </button>
         <button
          onClick={() => router.push("/login")}
          className="px-6 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
