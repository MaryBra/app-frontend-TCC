"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { TokenPayload } from "../types/auth.types";
import { jwtDecode } from "jwt-decode";

export default function ResearcherRegistration() {
    const [arquivo, setArquivo] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        setError(null);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.type === "text/xml" || file.name.endsWith(".xml")) {
            setArquivo(file);
            setError(null);
        } else {
            setError("Por favor, selecione um arquivo XML válido.");
        }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        if (file.type === "text/xml" || file.name.endsWith(".xml")) {
            setArquivo(file);
            setError(null);
        } else {
            setError("Por favor, selecione um arquivo XML válido.");
        }
        }
    };

    const enviarArquivo = async (e: React.FormEvent) => {
    e.preventDefault();


    const token = localStorage.getItem("token")
    console.log(token)

    if (!arquivo) {
        setError("Selecione um arquivo XML.");
        return;
    }

    setIsLoading(true);
    setError(null);

    try {
        const idSalvo = localStorage.getItem("usuarioId");
        console.log(idSalvo)

        if (!idSalvo || idSalvo === "null" || idSalvo === "undefined") {
            console.error("ID do usuário inválido no localStorage:", idSalvo);
            setError("Erro: ID do usuário não encontrado. Faça o login novamente.");
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        const email = localStorage.getItem("email") || ""
        console.log(email)
        formData.append("xml", arquivo);
        formData.append("usuarioEmail", email);
        // Faz upload do XML
        const respostaUpload = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData,
        });

        if (!respostaUpload.ok) {
        throw new Error("Erro ao enviar o arquivo para upload.");
        }

        // Lê o conteúdo de palavras-chave que o backend respondeu
        const resultadoUpload = await respostaUpload.json();
        const palavrasChave = resultadoUpload.keywords;

        const requisicaoTokenAtualizado = await fetch("http://localhost:8080/api/auth/refresh-token", {
            method: "POST",
            headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        })

        if (!requisicaoTokenAtualizado.ok) {
            throw new Error("Erro ao obter o novo token.");
        } 

        const data = await requisicaoTokenAtualizado.json();
        const novoToken = data.token;
        localStorage.setItem("token", novoToken)

        const payload = jwtDecode<TokenPayload>(novoToken)
        localStorage.setItem("id_usuario", String(payload.id_usuario))
        localStorage.setItem("tipo_usuario", payload.tipo_usuario)

        // Por fim, redireciona para a tela de tags com id + tags
        const tagsQuery = encodeURIComponent(palavrasChave.join(","));
        router.push(`/selecionandoTags?tags=${tagsQuery}`);

    } catch (error) {
        console.error("Erro no processo:", error);
        setError("Erro ao processar o arquivo ou salvar o pesquisador.");
    } finally {
        setIsLoading(false);
    }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen font-[family-name:var(--font-geist-sans)] bg-white">
        {/* Lado esquerdo */}
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center py-8 md:py-12 px-4"
        >
            <div className="w-full max-w-md flex flex-col items-center justify-center">
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="flex flex-col items-center"
            >
                <Image
                src="/images/logo_1.png"
                alt="Logo"
                width={200}
                height={200}
                quality={100}
                priority
                className="drop-shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                />
                <motion.p
                className="text-center mt-6 text-gray-700 text-xl md:text-2xl font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                >
                Faça o Upload do seu currículo Lattes para finalizar o seu cadastro
                </motion.p>
            </motion.div>
            </div>

            <motion.div
            className="w-full max-w-2xl flex justify-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            >
            <Image
                src="/images/ilustracao-importacao.png"
                alt="ilustracao-importacao"
                width={600}
                height={600}
                className="w-full max-w-md md:max-w-lg lg:max-w-xl h-auto object-contain transform hover:scale-105 transition-transform duration-500"
                quality={100}
                priority
            />
            </motion.div>
        </motion.div>

        {/* Lado direito */}
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-1/2 bg-gradient-to-br from-[#990000] to-[#660000] text-white flex flex-col items-center justify-center py-12 px-4"
        >
            <div className="w-full max-w-md flex flex-col items-center">
            <motion.h1
                className="text-2xl md:text-3xl font-bold mb-6 text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                Upload do Currículo Lattes (XML)
            </motion.h1>

            <form onSubmit={enviarArquivo} className="w-full max-w-sm">
                <input
                id="arquivo"
                type="file"
                accept=".xml"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
                />

                <motion.div
                className={`w-full p-8 rounded-xl border-2 border-dashed min-h-[250px] ${
                    isDragging ? "border-white bg-[#b30000]" : "border-[#ff9999]"
                } flex flex-col items-center justify-center cursor-pointer transition-all duration-300 mb-4`}
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                >
                <motion.div
                    animate={{ y: isDragging ? [0, -5, 0] : 0 }}
                    transition={{ repeat: isDragging ? Infinity : 0, duration: 1 }}
                >
                    <Image
                    src="/images/upload.png"
                    alt="curriculo-import"
                    width={120}
                    height={120}
                    className="mb-4"
                    />
                </motion.div>

                <p className="text-center text-lg font-medium mb-2">
                    {isDragging
                    ? "Solte seu arquivo aqui"
                    : "Arraste e solte ou clique para selecionar"}
                </p>
                <p className="text-center text-sm opacity-80">
                    Apenas arquivos XML são aceitos
                </p>
                </motion.div>

                {/* Mensagem de erro */}
                <AnimatePresence>
                {error && (
                    <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 w-full overflow-hidden"
                    >
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded">
                        <div className="flex items-center">
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                            />
                        </svg>
                        <span className="font-medium">{error}</span>
                        </div>
                    </div>
                    </motion.div>
                )}
                </AnimatePresence>

                {/* Arquivo selecionado */}
                <AnimatePresence>
                {arquivo && (
                    <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 overflow-hidden"
                    >
                    <div className="bg-[#b30000] rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center">
                        <svg
                            className="w-6 h-6 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <span className="truncate max-w-xs">{arquivo.name}</span>
                        </div>
                        <button
                        type="button"
                        onClick={() => setArquivo(null)}
                        className="text-white hover:text-gray-200 transition-colors duration-200 cursor-pointer"
                        >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                        </button>
                    </div>
                    </motion.div>
                )}
                </AnimatePresence>

                <motion.button
                type="submit"
                className={`w-full py-3 px-6 rounded-lg font-medium text-[#990000] bg-white hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center ${
                    !arquivo ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
                disabled={!arquivo || isLoading}
                whileHover={arquivo ? { scale: 1.02 } : {}}
                whileTap={arquivo ? { scale: 0.95 } : {}}
                >
                {isLoading ? (
                    <>
                    <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#990000]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        ></circle>
                        <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    Processando...
                    </>
                ) : (
                    "Enviar para a API"
                )}
                </motion.button>
            </form>
            </div>
        </motion.div>

        <style jsx global>{`
            .cursor-pointer {
            cursor: pointer;
            }
            .cursor-pointer:hover {
            cursor: pointer;
            }
            button,
            input[type="text"],
            .tag-item {
            transition: all 0.3s ease;
            }
        `}</style>
        </div>
    );
}