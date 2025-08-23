"use client"

import { useRouter } from "next/navigation";

export default function Inicio() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-700">Tela de perfil da empresa</h1>
      </div>
    </div>
  );
}
