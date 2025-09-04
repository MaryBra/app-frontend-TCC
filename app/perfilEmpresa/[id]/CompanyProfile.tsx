"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import MenuLateral from "../../components/MenuLateral";

interface Empresa {
  id: number;
  nomeComercial: string;
  frase: string;
  cidade: string;
  estado: string;
  site: string;
  setor: string;
  telefone: string;
  email: string;
  textoEmpresa: string;
}

export default function CompanyProfile() {
    const router = useRouter();
    const { id } = useParams(); // pega o id da rota
    const [infoEmpresa, setInfoEmpresa] = useState<Empresa | null>(null);
    const [loading, setLoading] = useState(false); 

    const buscarInfoEmpresa = async () => {
        try {
        const res = await fetch(`http://localhost:8080/api/empresas/listarEmpresa/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        const data = await res.json();
        setInfoEmpresa(data);
        } catch (error) {
        console.error("Erro ao buscar empresa:", error);
        }
    };

    useEffect(() => {
        if (id) {
        buscarInfoEmpresa();
        }
    }, [id]);

    const handleEditar = () => {
        if(infoEmpresa){
        setLoading(true); // ativa loading
        setTimeout(() => {
            router.push(`/edicaoEmpresa?id=${infoEmpresa.id}`);
        }, 1000); // atraso pequeno só para mostrar o loading
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
        {/* Menu lateral fixo */}
        <MenuLateral />

        {/* Conteúdo principal */}
        <main className="flex-1 ml-20 overflow-y-auto">
            
            {/* Card principal da empresa */}
            <section className="bg-gray-300 shadow-md p-6 pl-20 flex flex-col md:flex-row gap-6 relative">
            
            {/* Imagem/ícone da empresa */}
            <div className="bg-purple-500 rounded-xl flex items-center justify-center w-full md:w-80 h-80 md:h-80 shadow">
                {/* Imagem de perfil da empresa */}
            </div>

            {/* Infos da empresa */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                {infoEmpresa && <h1 className="text-5xl font-bold text-gray-700 mb-2">{infoEmpresa.nomeComercial}</h1>}
                {infoEmpresa && <h2 className="text-2xl text-gray-700">{infoEmpresa.frase}</h2>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm text-white">
                    <div>
                    <p><span className="font-bold text-gray-700">Sede</span></p>
                    {infoEmpresa && <p className="text-gray-700 mb-2">📍{infoEmpresa.cidade}, {infoEmpresa.estado}</p>}
                    <p><span className="font-bold text-gray-700">Site</span></p>
                    {infoEmpresa && <p className="text-gray-700 mb-2">{infoEmpresa.site}</p>}
                    <p><span className="font-bold text-gray-700">Setor</span></p>
                    {infoEmpresa && <p className="text-gray-700">{infoEmpresa.setor}</p>}
                    </div>
                    <div>
                    <p><span className="font-bold text-gray-700">Telefone</span></p>
                    {infoEmpresa && <p className="text-gray-700 mb-2">{infoEmpresa.telefone}</p>}
                    <p><span className="font-bold text-gray-700">Email</span></p>
                    {infoEmpresa && <p className="text-gray-700">{infoEmpresa.email}</p>}
                    </div>
                </div>
                </div>

                {/* Botão */}
                <button className="bg-red-700 text-white px-4 py-2 mt-6 rounded-lg hover:bg-red-800 w-fit">
                Gerenciar Listas
                </button>
            </div>

            {/* Botão editar */}
            <button
                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-100"
                onClick={handleEditar}
                disabled={loading}
            >
                {loading ? "⏳" : "✏️"}
            </button>

            {/* Última atualização */}
            <span className="absolute bottom-4 right-6 text-xs text-gray-700">
                Última atualização há 7 horas
            </span>
            </section>

            {/* Seção Visão Geral */}
            <section className="bg-gray-100 p-12 pt-6">
            <h2 className="text-md font-semibold mb-4">Sobre a Empresa</h2>

            <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                {infoEmpresa && <p>
                {infoEmpresa.textoEmpresa}
                </p>}
                
            </div>
            </section>
        </main>
        {/* Overlay de loading */}
        {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
            </div>
        )}
        </div>
    );
}