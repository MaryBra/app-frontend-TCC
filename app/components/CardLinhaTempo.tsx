import React from "react";

interface ItemLinhaDoTempo {
  id?: number;
  ano: number;
  titulo: string;
}

interface CardLinhaDoTempoProps {
  items: ItemLinhaDoTempo[];
  podeEditar?: boolean;
  onClickAdicionar?: () => void;
  onClickAcessar?: (item: ItemLinhaDoTempo) => void;
}

export function CardLinhaDoTempo({ 
  items, 
  podeEditar = false,
  onClickAdicionar,
  onClickAcessar
}: CardLinhaDoTempoProps) {
  
  // Altura fixa - mesma dos outros cards
  const alturaCard = "h-[400px]";
  
  // Estado vazio
  if (items.length === 0) {
    return (
      <div className={`flex-1 bg-white rounded-2xl shadow-lg p-6 ${alturaCard} flex flex-col`}>
        <div className="relative mb-4">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-gray-100 h-10 rounded-md"></div>
          <h2 className="relative z-10 text-center text-xl font-bold text-black tracking-wide">
            Linha do tempo - Destaques
          </h2>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="text-center mb-4">
            <p className="text-gray-500 text-sm mb-1">
              Nenhum destaque adicionado ainda
            </p>
            <p className="text-gray-400 text-xs">
              {podeEditar 
                ? "Destaque suas conquistas e marcos importantes da sua trajetória acadêmica"
                : "Este pesquisador ainda não adicionou destaques à linha do tempo"}
            </p>
          </div>
          
          {podeEditar && (
            <button 
              onClick={onClickAdicionar}
              className="bg-[#990000] hover:bg-red-700 text-white px-5 py-1.5 rounded-lg shadow-md transition text-sm"
            >
              Adicionar Destaques
            </button>
          )}
        </div>
      </div>
    );
  }

  // Lista com todos os itens
  return (
    <div className={`flex-1 bg-white rounded-2xl shadow-lg p-6 ${alturaCard} flex flex-col`}>
      <div className="relative mb-6">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-gray-100 h-10 rounded-md"></div>
        <h2 className="relative z-10 text-center text-xl font-bold text-black tracking-wide">
          Linha do tempo - Destaques
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="relative border-l-2 border-gray-300 ml-12 space-y-8 pr-6">
          {items.map((item, idx) => (
            <div key={item.id || idx} className="flex items-start gap-6">
              <div className="absolute w-5 h-5 bg-red-700 rounded-full -left-[11px] mt-1"></div>

              <div className="ml-8 flex-1 min-w-0 flex items-start justify-between gap-6">
                <div className="flex flex-col gap-1 flex-1">
                  <p className="text-lg font-bold text-black">{item.ano}</p>
                  <p className="text-sm text-gray-800 leading-relaxed break-words">
                    {item.titulo}
                  </p>
                </div>

                {onClickAcessar && (
                  <button 
                    onClick={() => onClickAcessar(item)}
                    className="bg-red-700 text-white text-xs px-3 py-1 rounded shadow hover:bg-red-800 transition flex-shrink-0 self-start"
                  >
                    Acessar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {items.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            {items.length} {items.length === 1 ? 'destaque' : 'destaques'} na linha do tempo
          </p>
        </div>
      )}
    </div>
  );
}