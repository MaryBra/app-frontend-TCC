"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function SelecionandoTags() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tagsQuery = searchParams.get("tags");

  const [tagsSelecionadas, setTagsSelecionadas] = useState([]);
  const [novaTag, setNovaTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (tagsQuery) {
      const tagsArray = tagsQuery.split(",").map((tag) => tag.trim());
      setTagsSelecionadas(tagsArray);
    }
  }, [tagsQuery]);

  const handleAddTag = () => {
    const tagFormatada = novaTag.trim();
    if (tagFormatada !== "" && !tagsSelecionadas.includes(tagFormatada)) {
      setTagsSelecionadas([...tagsSelecionadas, tagFormatada]);
      setNovaTag("");
      setError("");
    } else if (tagFormatada === "") {
      setError("Por favor, digite uma tag válida");
    }
  };

  const handleRemoveTag = (tagParaRemover) => {
    setTagsSelecionadas(
      tagsSelecionadas.filter((tag) => tag !== tagParaRemover)
    );
  };

  const handleContinuar = () => {
    if (tagsSelecionadas.length === 0) {
      setError("Selecione pelo menos uma tag para continuar");
      return;
    }

    setIsLoading(true);
    const tagsString = encodeURIComponent(tagsSelecionadas.join(","));
    setTimeout(() => {
      router.push(`/telaPerfil?tags=${tagsString}`);
    }, 500);
  };

  const handleVoltar = () => {
    router.back();
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen font-[family-name:var(--font-geist-sans)] bg-white">
      {/* Lado esquerdo - Conteúdo informativo */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center py-8 md:py-12 px-4"
      >
        <div className="w-full max-w-md flex flex-col items-center justify-center mb-8">
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
              className="drop-shadow-lg mb-8 transform hover:scale-105 transition-transform duration-300 cursor-pointer"
            />
            <motion.h1
              className="text-3xl md:text-4xl font-bold mb-2 text-center text-gray-800 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Personalize seu Perfil
            </motion.h1>
            <motion.div
              className="bg-white/80 p-6 rounded-xl border border-gray-200 max-w-md shadow-lg backdrop-blur-sm mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-gray-700 text-center">
                Essas tags foram geradas automaticamente a partir do seu
                currículo. Você pode adicionar novas ou remover as que não se
                aplicam.
              </p>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Image
            src="/images/ilustracao-importacao.png"
            alt="Ilustração de tags"
            width={500}
            height={400}
            className="w-full h-auto object-contain transform hover:scale-105 transition-transform duration-500"
            quality={100}
            priority
          />
        </motion.div>
      </motion.div>

      {/* Lado direito - Área de seleção de tags */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-1/2 bg-gradient-to-br from-[#990000] to-[#660000] text-white flex flex-col items-center justify-center py-12 px-4"
      >
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Suas Tags</h2>
            <p className="text-white/80 mb-4">
              Selecione as tags que melhor representam suas habilidades e
              interesses profissionais.
            </p>
          </motion.div>

          {/* Input para adicionar nova tag */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <div className="flex shadow-xl rounded-lg overflow-hidden">
              <input
                type="text"
                placeholder="Digite uma nova tag..."
                value={novaTag}
                onChange={(e) => {
                  setNovaTag(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-grow border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all text-white placeholder-white/50 hover:bg-white/15"
              />
              <motion.button
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.9)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddTag}
                className="bg-white text-[#990000] px-6 font-medium transition-all flex items-center justify-center cursor-pointer hover:bg-gray-100"
              >
                <span className="text-xl">+</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Mensagem de erro */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded flex items-center">
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
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Área de tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-8 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 min-h-[250px] shadow-inner"
          >
            <motion.h3
              className="text-lg font-semibold mb-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Tags Selecionadas
            </motion.h3>

            {tagsSelecionadas.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full py-8"
              >
                <svg
                  className="w-12 h-12 text-white/30 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <p className="text-white/50 italic">Nenhuma tag selecionada</p>
              </motion.div>
            ) : (
              <div className="flex flex-wrap gap-3 justify-center">
                <AnimatePresence>
                  {tagsSelecionadas.map((tag) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center bg-white text-[#990000] px-4 py-2 rounded-full shadow-md cursor-pointer hover:shadow-lg transition-all"
                    >
                      <span className="font-medium whitespace-nowrap">
                        {tag}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.3, color: "#800000" }}
                        whileTap={{ scale: 0.8 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveTag(tag);
                        }}
                        className="ml-2 font-bold text-lg transition-all cursor-pointer"
                      >
                        ×
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {/* Botões de ação */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex justify-between gap-4"
          >
            <motion.button
              onClick={handleVoltar}
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(255,255,255,0.15)",
              }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 text-white font-medium rounded-lg border border-white/30 transition-all flex items-center justify-center gap-2 cursor-pointer hover:border-white/50"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Voltar
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0 4px 14px rgba(255,255,255,0.3)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinuar}
              disabled={isLoading || tagsSelecionadas.length === 0}
              className={`flex-1 py-3 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                isLoading || tagsSelecionadas.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-white text-[#990000] hover:bg-gray-100 cursor-pointer"
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
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
                <>
                  Continuar
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
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </>
              )}
            </motion.button>
          </motion.div>
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
