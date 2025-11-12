import React from "react";

interface ItemLista {
  id: number;
  titulo: string;
  subtitulo: string;
}

interface CardListaProps {
  titulo: string;
  items: ItemLista[];
  textoBotao?: string;
  onClickBotao?: () => void;
  podeEditar?: boolean;
  onClickAdicionar?: () => void;
}

export function CardLista({ 
  titulo, 
  items, 
  textoBotao = "Ver mais", 
  onClickBotao,
  podeEditar = false,
  onClickAdicionar
}: CardListaProps) {
  
  // Se a lista estiver vazia, mostra mensagem apropriada
  if (items.length === 0) {
    return (
      <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 h-fit">
        <div className="relative mb-4">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-gray-200 h-8 rounded-md"></div>
          <h2 className="relative z-10 text-center text-xl font-bold text-black tracking-wide">
            {titulo}
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center py-8 px-4">
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

  // Lista com itens
  return (
    <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 h-fit">
      <div className="relative mb-4">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-gray-200 h-8 rounded-md"></div>
        <h2 className="relative z-10 text-center text-xl font-bold text-black tracking-wide">
          {titulo}
        </h2>
      </div>

      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-6 bg-gray-50 rounded-xl p-3">
            <div className="w-4 h-4 bg-gray-400 rounded-full flex-shrink-0 self-center"></div>
            <div className="flex flex-col text-black leading-snug">
              <p className="font-bold text-sm">{item.titulo}</p>
              <p className="text-xs text-gray-700">{item.subtitulo}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex justify-end">
        <button 
          onClick={onClickBotao}
          className="bg-[#990000] hover:bg-red-700 text-white px-5 py-1.5 rounded-lg shadow-md transition text-sm"
        >
          {textoBotao}
        </button>
      </div>
    </div>
  );
}