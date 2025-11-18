"use client";

import React, { useState } from "react";

interface ItemLista {
  id: number;
  titulo: string;
  subtitulo: string;
}

interface CardListaProps {
  titulo: string;
  items: ItemLista[];
  textoBotao?: string;
  // onClickBotao?: () => void;
  podeEditar?: boolean;
  onClickAdicionar?: () => void;
}

export function CardLista({ 
  titulo, 
  items, 
  textoBotao = "Ver tudo", 
  // onClickBotao,
  podeEditar = false,
  onClickAdicionar
}: CardListaProps) {

  const [mostrarTodos, setMostrarTodos] = useState(false);
  
  // Altura fixa para todos os cards - equivalente a card com 3 itens
  const alturaFixa = "h-[400px]"; // Ajuste este valor conforme necessário

  const alturaDinamica = (items.length > 0 && mostrarTodos) ? "h-auto" : alturaFixa;
  
  if (items.length === 0) {
    return (
      <div className={`flex-1 bg-white rounded-2xl shadow-lg p-6 ${alturaFixa} flex flex-col`}>
        <div className="relative mb-4">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-gray-100 h-10 rounded-md"></div>
          <h2 className="relative z-10 text-center text-xl font-bold text-black tracking-wide">
            {titulo}
          </h2>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="text-center mb-4">
            <p className="text-gray-500 text-sm mb-1">
              {podeEditar 
                ? `Nenhum item adicionado ainda`
                : `Este pesquisador não adicionou informações sobre ${titulo.toLowerCase()}`
              }
            </p>
            <p className="text-gray-400 text-xs">
              {podeEditar && `Adicione informações sobre ${titulo.toLowerCase()} ao seu perfil`}
            </p>
          </div>
          
          {podeEditar && (
            <button 
              onClick={onClickAdicionar}
              className="bg-[#990000] hover:bg-red-700 text-white px-5 py-1.5 rounded-lg shadow-md transition text-sm"
            >
              Adicionar {titulo}
            </button>
          )}
        </div>
      </div>
    );
  }

  const itemsExibidos = mostrarTodos ? items : items.slice(0, 3);
  const mostrarBotaoVerTudo = items.length > 3 && !mostrarTodos;
  
  return (
    <div className={`flex-1 bg-white rounded-2xl shadow-lg p-6 ${alturaDinamica} flex flex-col`}>
      <div className="relative mb-4">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-gray-100 h-10 rounded-md"></div>
        <h2 className="relative z-10 text-center text-xl font-bold text-black tracking-wide">
          {titulo}
        </h2>
      </div>

      <div className="flex-1 overflow-hidden">
        <ul className="space-y-2">
          {itemsExibidos.map((item, index) => (
            <li key={item.id ?? index} className="flex items-center gap-6 bg-gray-50 rounded-xl p-3">
              <div className="w-4 h-4 bg-gray-400 rounded-full flex-shrink-0 self-center"></div>
              <div className="flex flex-col text-black leading-snug">
                <p className="font-bold text-sm">{item.titulo}</p>
                <p className="text-xs text-gray-700">{item.subtitulo}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {mostrarBotaoVerTudo && (
        <div className="mt-4 flex justify-end">
          <button 
            onClick={() => setMostrarTodos(true)}
            className="bg-[#990000] hover:bg-red-700 text-white px-5 py-1.5 rounded-lg shadow-md transition text-sm"
          >
            {textoBotao}
          </button>
        </div>
      )}
    </div>
  );
}