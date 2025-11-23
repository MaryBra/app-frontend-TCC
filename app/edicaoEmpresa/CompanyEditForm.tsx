"use client"
import React, { useEffect, useState } from 'react';
import { User, Camera } from 'lucide-react';
import MenuLateral from "../components/MenuLateral";
import { useSearchParams, useRouter } from 'next/navigation';

export default function CompanyEditForm() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id'); // ID da Empresa
    const router = useRouter();

    // --- ESTADOS PARA IMAGEM ---
    const [imagemPerfil, setImagemPerfil] = useState<string | null>(null);
    const [imagemAlterada, setImagemAlterada] = useState(false);
    const [arquivoImagem, setArquivoImagem] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        nomeRegistro: "",
        nomeComercial: "",
        cnpj: "",
        telefone: "",
        email: "",
        site: "",
        setor: "Desenvolvimento de Software",
        cep: "",
        logradouro: "",
        numeroEndereco: "",
        bairro: "",
        cidade: "",
        estado: "PR",
        frase: "",
        textoEmpresa: ""
    });

    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");
    const idUsuarioLogado = localStorage.getItem("usuarioId");

    // --- BUSCAR IMAGEM ATUAL ---
    const buscarImagemEmpresa = async () => {
        if (!id) return;
        try {
            // Ajuste a URL conforme seu Back-end. Assumindo padrão similar ao do pesquisador.
            const res = await fetch(`http://localhost:8080/api/empresas/${id}/imagem`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });

            if (res.ok) {
                const blob = await res.blob();
                if (blob.size > 0) {
                    const urlImagem = URL.createObjectURL(blob);
                    setImagemPerfil(urlImagem);
                }
            }
        } catch (error) {
            console.error("Erro ao buscar imagem da empresa:", error);
        }
    };

    // Buscar dados da empresa
    const buscarInfoEmpresa = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/empresas/listarEmpresa/${idUsuarioLogado}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            const data = await res.json();

            setFormData({
                nomeRegistro: data.nomeRegistro || "",
                nomeComercial: data.nomeComercial || "",
                cnpj: data.cnpj || "",
                telefone: data.telefone || "",
                email: data.email || "",
                site: data.site || "",
                setor: data.setor || "Desenvolvimento de Software",
                cep: data.cep || "",
                logradouro: data.logradouro || "",
                numeroEndereco: data.numeroEndereco || "",
                bairro: data.bairro || "",
                cidade: data.cidade || "",
                estado: data.estado || "PR",
                frase: data.frase || "",
                textoEmpresa: data.textoEmpresa || ""
            });
            
            // Após buscar os dados, busca a imagem
            buscarImagemEmpresa();

        } catch (error) {
            console.error("Erro ao buscar empresa:", error);
        }
    };

    useEffect(() => {
        if (id) buscarInfoEmpresa();
    }, [id]);

    // --- FUNÇÃO DE UPLOAD DA IMAGEM ---
    const atualizarFoto = async () => {
        if (!arquivoImagem || !id) return;

        const formDataImg = new FormData();
        formDataImg.append("file", arquivoImagem);

        const res = await fetch(`http://localhost:8080/api/empresas/${id}/imagem`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formDataImg,
        });

        if (!res.ok) {
            throw new Error("Falha ao atualizar imagem da empresa");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Máscaras (CNPJ, Telefone, CEP) omitidas para brevidade, mantêm-se iguais ao seu código original...
    const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       let valor = e.target.value.replace(/\D/g, "");
       if (valor.length > 14) valor = valor.slice(0, 14);
       valor = valor.replace(/^(\d{2})(\d)/, "$1.$2");
       valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
       valor = valor.replace(/\.(\d{3})(\d)/, ".$1/$2");
       valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
       setFormData(prev => ({ ...prev, cnpj: valor }));
    };

    const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       let value = e.target.value.replace(/\D/g, "");
       if (value.length > 11) value = value.slice(0, 11);
       value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
       value = value.replace(/(\d{5})(\d)/, "$1-$2");
       setFormData(prev => ({ ...prev, telefone: value }));
    };

    const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
       let valor = e.target.value.replace(/\D/g, "");
       if (valor.length > 8) valor = valor.slice(0, 8);
       let valorFormatado = valor;
       if (valor.length > 5) {
       valorFormatado = valor.replace(/^(\d{5})(\d)/, "$1-$2");
       }
       setFormData(prev => ({ ...prev, cep: valorFormatado }));
       if (valor.length === 8) {
       try {
           const res = await fetch(`https://viacep.com.br/ws/${valor}/json/`);
           const data = await res.json();
           if (!data.erro) {
           setFormData(prev => ({
               ...prev,
               logradouro: data.logradouro || "",
               bairro: data.bairro || "",
               cidade: data.localidade || "",
               estado: data.uf || ""
           }));
           } else {
           }
       } catch (err) {
           console.error("Erro ao buscar CEP:", err);
       }
       }
    };

    const handleCancel = () => {
        router.push(`/perfilEmpresa/${idUsuarioLogado}`);
    };

    // --- SAVE GERAL (TEXTO + IMAGEM) ---
    const handleSave = async () => {
        setLoading(true);
        try {
            // 1. Atualiza dados de texto
            const res = await fetch(`http://localhost:8080/api/empresas/alterarEmpresa/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Erro ao salvar dados da empresa");

            // 2. Se houve alteração de imagem, faz o upload
            if (imagemAlterada) {
                await atualizarFoto();
            }

            setTimeout(() => {
                router.push(`/perfilEmpresa/${idUsuarioLogado}`);
            }, 1000);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <MenuLateral />
            <div className="w-4/5 mx-auto bg-white rounded-lg shadow-sm">
                {/* Header */}
                <div className="flex items-center p-6 border-b border-gray-200">
                    
                    {/* --- ÁREA DA IMAGEM --- */}
                    <div className="relative group cursor-pointer mr-6">
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border border-gray-300">
                            {imagemPerfil ? (
                                <img 
                                    src={imagemPerfil} 
                                    alt="Logo da empresa" 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-10 h-10 text-gray-400" />
                            )}
                        </div>

                        {/* Overlay ao passar o mouse */}
                        <div 
                            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => document.getElementById("upload-foto-empresa")?.click()}
                        >
                            <Camera className="w-8 h-8 text-white" />
                        </div>

                        {/* Input Hidden */}
                        <input
                            type="file"
                            id="upload-foto-empresa"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const arquivo = e.target.files?.[0];
                                if (arquivo) {
                                    const url = URL.createObjectURL(arquivo);
                                    setImagemPerfil(url);
                                    setArquivoImagem(arquivo);
                                    setImagemAlterada(true);
                                }
                            }}
                        />
                    </div>
                    {/* --- FIM ÁREA DA IMAGEM --- */}

                    <h1 className="text-2xl font-semibold text-red-600">Editar Perfil da Empresa</h1>
                </div>

                {/* Form Content */}
                <div className="p-6 space-y-8">
                    {/* Informações Principais */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Informações Principais</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nome de Registro</label>
                                <input type="text" name="nomeRegistro" value={formData.nomeRegistro} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nome Comercial</label>
                                <input type="text" name="nomeComercial" value={formData.nomeComercial} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ</label>
                                <input type="text" name="cnpj" value={formData.cnpj} onChange={handleCNPJChange} className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                                <input type="tel" name="telefone" value={formData.telefone} onChange={handleTelefoneChange} className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Site</label>
                                <input type="url" name="site" value={formData.site} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Setor</label>
                                <select name="setor" value={formData.setor} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                                    <option value="Desenvolvimento de Software">Desenvolvimento de Software</option>
                                    <option value="Tecnologia da Informação">Tecnologia da Informação</option>
                                    <option value="Consultoria">Consultoria</option>
                                    <option value="Marketing Digital">Marketing Digital</option>
                                    <option value="E-commerce">E-commerce</option>
                                    <option value="Outros">Outros</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Informações de Endereço */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Informações de Endereço</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                                <input type="text" name="cep" value={formData.cep} onChange={handleCepChange} maxLength={9} className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Logradouro</label>
                                <input type="text" name="logradouro" value={formData.logradouro} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
                                <input type="text" name="numeroEndereco" value={formData.numeroEndereco} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                                <input type="text" name="bairro" value={formData.bairro} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                                <input type="text" name="cidade" value={formData.cidade} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                                <select name="estado" value={formData.estado} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                                    {/* Lista de Estados */}
                                    <option value="AC">AC</option><option value="AL">AL</option><option value="AP">AP</option><option value="AM">AM</option><option value="BA">BA</option><option value="CE">CE</option><option value="DF">DF</option><option value="ES">ES</option><option value="GO">GO</option><option value="MA">MA</option><option value="MT">MT</option><option value="MS">MS</option><option value="MG">MG</option><option value="PA">PA</option><option value="PB">PB</option><option value="PR">PR</option><option value="PE">PE</option><option value="PI">PI</option><option value="RJ">RJ</option><option value="RN">RN</option><option value="RS">RS</option><option value="RO">RO</option><option value="RR">RR</option><option value="SC">SC</option><option value="SP">SP</option><option value="SE">SE</option><option value="TO">TO</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Informações Gerais */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Informações Gerais</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Frase de Destaque</label>
                                <input type="text" name="frase" value={formData.frase} onChange={handleInputChange} placeholder="Frase que representa a empresa" className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição da Empresa</label>
                                <textarea name="textoEmpresa" value={formData.textoEmpresa} onChange={handleInputChange} rows={6} className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-vertical" placeholder="Descreva a empresa, seus valores, missão e diferencias..." />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botões */}
                <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
                    <button onClick={handleCancel} className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200">Cancelar</button>
                    <button onClick={handleSave} disabled={loading} className="px-6 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center gap-2">
                        {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                        {loading ? "Gravando..." : "Gravar"}
                    </button>
                </div>
            </div>

            {/* Overlay de loading geral */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
}