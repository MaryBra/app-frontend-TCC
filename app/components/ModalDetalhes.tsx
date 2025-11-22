"use client";

import React from "react";
import { X } from "lucide-react";

interface ItemDetalhado {
  id: number;
  titulo: string;
  subtitulo: string;
  detalhes?: Record<string, any>;
  destaque?: boolean; 
}

interface ModalDetalhesProps {
  isOpen: boolean;
  onClose: () => void;
  titulo: string;
  items: ItemDetalhado[];
}

export function ModalDetalhes({
  isOpen,
  onClose,
  titulo,
  items,
}: ModalDetalhesProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <div className="relative bg-[#990000] text-white rounded-t-2xl p-6">
          <h2 className="text-2xl font-bold text-center pr-8">{titulo}</h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-red-800 rounded-full p-2 transition"
            aria-label="Fechar modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* CONTEÚDO */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Nenhum item encontrado para exibir.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.id ?? index}
                  className="relative bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition border border-gray-100"
                >
                    
                  {item.destaque && (
                    <div
                      aria-hidden
                      className="absolute top-3 bottom-3 left-0 w-1.5 rounded-r-md bg-[#990000]"
                    />
                  )}

                  {item.destaque && (
                    <span className="absolute top-3 right-3 bg-[#990000] text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm">
                      Destaque
                    </span>
                  )}

                  <div className={`${item.destaque ? "pl-5" : ""}`}>
                    
                    {/* Título e Subtítulo */}
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-5 h-5 bg-[#990000] rounded-full flex-shrink-0 mt-1"></div>

                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-black mb-1">
                          {item.titulo}
                        </h3>
                        <p className="text-sm text-gray-700">
                          {item.subtitulo}
                        </p>
                      </div>
                    </div>

                    {/* Detalhes */}
                    {item.detalhes && Object.keys(item.detalhes).length > 0 && (
                      <div className="ml-9 mt-3 pt-3 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {Object.entries(item.detalhes).map(([chave, valor]) => {
                            if (!valor || valor === "Não informado") return null;

                            return (
                              <div key={chave} className="text-sm">
                                <span className="font-semibold text-gray-800">
                                  {chave}:
                                </span>{" "}
                                <span className="text-gray-600">{valor}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="border-t border-gray-200 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
