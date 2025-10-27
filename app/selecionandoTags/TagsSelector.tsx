"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FiSearch, FiX, FiArrowRight, FiAlertCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function TagsSelector() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tagsQuery = searchParams.get("tags");
    const idPesquisador = searchParams.get("idPesquisador");

    console.log("Id do pesquisador na tela de seleção de tags: " + idPesquisador);

    const [tagsSelecionadas, setTagsSelecionadas] = useState<string[]>([]);
    const [novaTag, setNovaTag] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (tagsQuery) {
        const tagsArray = tagsQuery.split(",").map((tag) => tag.trim());
        setTagsSelecionadas(tagsArray);
        }
        setIsLoading(false);
    }, [tagsQuery]);

    const handleAddTag = () => {
        const tagFormatada = novaTag.trim();

        if (tagFormatada === "") {
        setErro("Por favor, digite uma tag válida");
        return;
        }

        if (tagsSelecionadas.includes(tagFormatada)) {
        setErro("Esta tag já foi adicionada");
        return;
        }

        setTagsSelecionadas([...tagsSelecionadas, tagFormatada]);
        setNovaTag("");
        setErro("");
    };

    const handleRemoveTag = (tagParaRemover: string) => {
        setTagsSelecionadas(
        tagsSelecionadas.filter((tag) => tag !== tagParaRemover)
        );
        setErro("");
    };

    const handleContinuar = async () => {
        const jsonData = {
        pesquisador: { id: Number(idPesquisador) },
        listaTags: tagsSelecionadas,
        };
        const token = localStorage.getItem("token");
    
        try {
        const resposta = await fetch("http://localhost:8080/api/tags/salvarTag", {
            method: "POST",
            headers: { "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` },
            body: JSON.stringify(jsonData),
        });
    
        if (!resposta.ok) {
            throw new Error("Erro ao salvar as tags");
        }

        const data = await resposta.json(); // <- Aqui você pega o JSON com o id
        console.log("Tag salva com sucesso. ID retornado:", data.id);
        // Se tudo der certo, redireciona
        const tagsString = encodeURIComponent(tagsSelecionadas.join(","));
        router.push(`/telaPerfil?tags=${tagsString}&idTag=${data.id}`);

        } catch (error) {
        console.error("Erro ao salvar tags:", error);
        setErro("Não foi possível salvar as tags. Tente novamente.");
        }
    };

    const PulsePlaceholder = () => (
        <div className="flex space-x-2 animate-pulse">
        <div className="h-3 w-3 rounded-full bg-gray-300"></div>
        <div className="h-3 w-3 rounded-full bg-gray-300"></div>
        <div className="h-3 w-3 rounded-full bg-gray-300"></div>
        </div>
    );

    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
        >
        {/* Cabeçalho */}
        <div className="w-full max-w-4xl mb-6 sm:mb-8 lg:mb-10 text-center">
            <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4"
            >
            Escolha as tags que mais combinam com você!
            </motion.h1>

            <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm sm:text-base lg:text-lg text-gray-600 px-2 sm:px-0"
            >
            Elas foram geradas automaticamente a partir das palavras-chave
            encontradas no seu currículo e ajudam a destacar suas áreas de
            atuação. Você pode editá-las a qualquer momento, se desejar.
            </motion.p>
        </div>

        {/* Container principal */}
        <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl sm:rounded-2xl w-full max-w-4xl shadow-md sm:shadow-lg border border-gray-200"
        >
            {/* Campo de input */}
            <div className="mb-2 sm:mb-3">
            <motion.div whileHover={{ scale: 1.005 }} className="relative w-full">
                <input
                type="text"
                placeholder="Adicionar outras tags"
                value={novaTag}
                onChange={(e) => {
                    setNovaTag(e.target.value);
                    setErro("");
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                    }
                }}
                className={`w-full border-2 ${
                    erro ? "border-red-500" : "border-gray-200"
                } rounded-full px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg text-gray-900 focus:outline-none focus:ring-2 ${
                    erro ? "focus:ring-red-200" : "focus:ring-red-200"
                } pr-12 sm:pr-14 placeholder-gray-500 bg-white shadow-sm transition-all duration-300`}
                />
                <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddTag}
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-red-600 hover:text-red-700 cursor-pointer transition-colors duration-200"
                aria-label="Adicionar tag"
                >
                <FiSearch size={20} className="sm:w-6 sm:h-6" />
                </motion.button>
            </motion.div>

            {/* Mensagem de erro */}
            <AnimatePresence>
                {erro && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center mt-1 sm:mt-2 ml-3 sm:ml-4 text-red-600 text-xs sm:text-sm"
                >
                    <FiAlertCircle className="mr-1 w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{erro}</span>
                </motion.div>
                )}
            </AnimatePresence>
            </div>

            {/* Área de tags */}
            <div className="w-full min-h-40 sm:min-h-52 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl bg-gray-50 border-2 border-gray-200 transition-all duration-300 hover:border-gray-300">
            {isLoading ? (
                <div className="flex items-center justify-center h-32 sm:h-40">
                <PulsePlaceholder />
                </div>
            ) : (
                <AnimatePresence>
                {tagsSelecionadas.length > 0 ? (
                    <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
                    {tagsSelecionadas.map((tag) => (
                        <motion.div
                        key={tag}
                        layout
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: 20 }}
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                        }}
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 sm:gap-3 border-2 border-gray-200 rounded-full px-3 sm:px-4 md:px-5 py-1 sm:py-2 md:py-3 bg-white text-gray-800 text-sm sm:text-base font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                        >
                        <motion.span
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                        >
                            <FiX
                            size={14}
                            className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] text-red-600 cursor-pointer hover:text-red-800 transition-colors duration-200"
                            onClick={() => handleRemoveTag(tag)}
                            aria-label={`Remover tag ${tag}`}
                            />
                        </motion.span>
                        <span className="truncate max-w-[120px] sm:max-w-[150px] md:max-w-xs">
                            {tag}
                        </span>
                        </motion.div>
                    ))}
                    </div>
                ) : (
                    <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center h-32 sm:h-40"
                    >
                    <p className="text-gray-500 text-sm sm:text-base md:text-lg">
                        Adicione tags para começar...
                    </p>
                    </motion.div>
                )}
                </AnimatePresence>
            )}
            </div>
        </motion.div>

        {/* Botão continuar */}
        <motion.div
            className="flex justify-end w-full max-w-4xl mt-4 sm:mt-5 md:mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
        >
            <motion.button
            onClick={handleContinuar}
            disabled={tagsSelecionadas.length === 0}
            whileHover={
                tagsSelecionadas.length > 0
                ? {
                    scale: 1.03,
                    boxShadow: "0px 5px 15px rgba(176, 0, 0, 0.3)",
                    }
                : {}
            }
            whileTap={tagsSelecionadas.length > 0 ? { scale: 0.97 } : {}}
            className={`flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 md:px-10 py-2 sm:py-2.5 md:py-3 rounded-md font-semibold text-white text-base sm:text-lg transition-all duration-300 ${
                tagsSelecionadas.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#b00000] hover:bg-[#900000] cursor-pointer shadow-md"
            }`}
            aria-label="Continuar para o próximo passo"
            >
            Continuar
            <motion.span
                animate={tagsSelecionadas.length > 0 ? { x: [0, 5, 0] } : {}}
                transition={
                tagsSelecionadas.length > 0
                    ? {
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "easeInOut",
                    }
                    : {}
                }
            >
                <FiArrowRight size={18} className="sm:w-5 sm:h-5" />
            </motion.span>
            </motion.button>
        </motion.div>
        </motion.div>
    );
}