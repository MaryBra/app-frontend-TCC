"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import MenuLateral from "../../components/MenuLateral";
import NotFound from "@/app/not-found";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

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
    const { id } = useParams(); 
    
    const [infoEmpresa, setInfoEmpresa] = useState<Empresa | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [naoEncontrado, setNaoEncontrado] = useState(false);
    const [imagemUrl, setImagemUrl] = useState<string | null>(null); 
    const [loading, setLoading] = useState(false); 
    
    const [podeEditar, setPodeEditar] = useState(false);

    const buscarImagem = async (idEmpresa: number) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:8080/api/empresas/${idEmpresa}/imagem`, {
                method: "GET",
                headers: { 
                    "Authorization": `Bearer ${token}` 
                }
            });

            if (res.ok) {
                const blob = await res.blob();
                if (blob.size > 0) {
                    const url = URL.createObjectURL(blob);
                    setImagemUrl(url);
                }
            }
        } catch (error) {
            console.error("Erro ao buscar imagem:", error);
        }
    };

    const buscarInfoEmpresa = async () => {
        const token = localStorage.getItem("token");
        
        if (!token) {
             return;
        }

        try {
            const res = await fetch(`http://localhost:8080/api/empresas/listarEmpresa/${id}`, {
                method: "GET",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                }
            });

            if (res.status === 404) {
                setCarregando(false)
                setNaoEncontrado(true);
                return;
            }

            if (res.ok) {
                const data = await res.json();
                console.log(data);
                setInfoEmpresa(data);
                setCarregando(false)

                if (data && data.id) {
                    buscarImagem(data.id);
                }

            } else {
                console.error("Erro ao buscar empresa");
            }
        } catch (error) {
            console.error("Erro ao buscar empresa:", error);
            setCarregando(false)
        }
    };

    useEffect(() => {
        if (id) {
            const idUsuarioLogado = localStorage.getItem("usuarioId");
            if (idUsuarioLogado && idUsuarioLogado === id) {
                setPodeEditar(true);
            } else {
                setPodeEditar(false);
            }

            buscarInfoEmpresa();
        }
    }, [id]);

    const handleEditar = () => {
        if(infoEmpresa){
            setLoading(true); 
            setTimeout(() => {
                router.push(`/edicaoEmpresa?id=${infoEmpresa.id}`);
            }, 1000); 
        }
    };

    if (carregando) {
          return (
            <div className="flex h-screen bg-gray-100">
              <MenuLateral />
              <main className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                  <LoadingSpinner></LoadingSpinner>
                </div>
              </main>
            </div>
          );
      }

    if (naoEncontrado) {
        return <NotFound/>
    }

    return (
        <div className="flex h-screen bg-gray-100">
        <MenuLateral />

        <main className="flex-1 ml-20 overflow-y-auto">
            
            <section className="bg-gray-300 shadow-md p-6 pl-20 flex flex-col md:flex-row gap-6 relative">
            
            {/* Área da Imagem de Perfil */}
            <div className="bg-purple-500 rounded-xl flex items-center justify-center w-full md:w-80 h-80 md:h-80 shadow overflow-hidden">
                {imagemUrl ? (
                    <img 
                        src={imagemUrl} 
                        alt="Perfil da Empresa" 
                        className="w-full h-full object-cover" 
                    />
                ) : (
                    // Fallback: Mostra a inicial ou ícone se não tiver foto
                    <span className="text-white text-6xl font-bold">
                        {infoEmpresa?.nomeComercial?.charAt(0).toUpperCase() || "E"}
                    </span>
                )}
            </div>

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
                
                {podeEditar && (
                    <div className="mt-auto flex gap-3 pt-4 justify-center lg:justify-start">
                        <Link
                            href="/gerenciarListas"
                            className="bg-[#990000] text-white px-4 py-1 rounded hover:bg-red-800 transition flex items-center justify-center"
                        >
                            Gerenciar Listas
                        </Link>
                    </div>
                )}
                
            </div>

            {/* Botão editar */}
            {podeEditar && (
                <button
                    className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-100"
                    onClick={handleEditar}
                    disabled={loading}
                >
                    {loading ? "⏳" : "✏️"}
                </button>
            )}

            <span className="absolute bottom-4 right-6 text-xs text-gray-700">
                Última atualização há 7 horas
            </span>
            </section>

            <section className="bg-gray-100 p-12 pt-6">
            <h2 className="text-md font-semibold text-gray-600 mb-4">Sobre a Empresa</h2>

            <div className="bg-white rounded-xl text-gray-600 shadow-md p-6 space-y-4">
                {infoEmpresa && <p>
                {infoEmpresa.textoEmpresa}
                </p>}
                
            </div>
            </section>
        </main>
        
        {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
            </div>
        )}
        </div>
    );
}