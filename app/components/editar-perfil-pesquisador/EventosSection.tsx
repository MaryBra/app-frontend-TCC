import { Trash2, Star, Calendar } from "lucide-react";
import FormField from "../FormField";
import { PerfilAcademicoSectionLayout } from "./PerfilAcademicoSectionLayout";
import Dropdown from "../Dropdown";

export function EventosSection({ data, onAdd, onEdit, onDelete }: any) {

  const opcoesClassificacao = [
    { label: "Internacional", value: "INTERNACIONAL" },
    { label: "Nacional", value: "NACIONAL" },
    { label: "Regional", value: "REGIONAL" },
    { label: "Local", value: "LOCAL" },
  ];

  return (
    <PerfilAcademicoSectionLayout title="Trabalhos em Eventos">
      {/* Botão adicionar novo */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => 
            onAdd({
              titulo: "",
              ano: undefined,
              nomeEvento: "",
              cidadeEvento: "",
              classificacaoEvento: "",
              destaque: false,
            })
          }
          className="px-4 py-2 text-white rounded-lg shadow-md transition text-sm shadow bg-[#990000] hover:bg-red-700"
        >
          + Adicionar Trabalho em Evento
        </button>
      </div>

      {/* Empty State - Quando não há trabalhos em eventos */}
      {data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4 mt-4">
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-4 rounded-full">
                <Calendar size={48} className="text-red-700" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Nenhum trabalho em evento cadastrado
            </h3>
            <p className="text-gray-600 text-sm">
              Adicione seus trabalhos apresentados em eventos para enriquecer seu perfil e destacar sua participação científica.
            </p>
          </div>
        </div>
      )}

      {/* Listagem */}
      {data.length > 0 && (
        <div className="space-y-4 mt-4">
          {data.map((item: any) => (
            <div
              key={item.id}
              className="relative bg-gray-50 border border-gray-200 rounded-lg p-4"
            >
              {/* ÍCONES CENTRALIZADOS VERTICALMENTE */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4">

                {/* Botão de apagar */}
                <button
                  onClick={() => onDelete(item.id)}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition shadow"
                >
                  <Trash2 size={26} className="text-red-700" />
                </button>

                {/* Botão de destaque */}
                <button
                  onClick={() =>
                    onEdit(item.id, { ...item, destaque: !item.destaque })
                  }
                  className={`
                    w-12 h-12 flex items-center justify-center rounded-full bg-white shadow transition
                    hover:bg-gray-100
                    ${item.destaque ? "animate-pulse-star" : ""}
                  `}
                >
                  <Star
                    size={28}
                    className={`
                      transition-transform duration-300
                      ${item.destaque ? "text-yellow-400 scale-105" : "text-gray-300 scale-100"}
                    `}
                    fill={item.destaque ? "#FACC15" : "none"}
                  />
                </button>
              </div>

              {/* CAMPOS DO TRABALHO EM EVENTO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-28">
                <FormField
                  label="Título do Trabalho"
                  value={item.titulo}
                  onChange={(e) =>
                    onEdit(item.id, { ...item, titulo: e.target.value })
                  }
                  required
                />

                <FormField
                  label="Nome do Evento"
                  value={item.nomeEvento}
                  onChange={(e) =>
                    onEdit(item.id, { ...item, nomeEvento: e.target.value })
                  }
                  required
                />

                <Dropdown
                  label="Classificação do Evento"
                  value={item.classificacaoEvento}
                  onChange={(value) => onEdit(item.id, { ...item, classificacaoEvento: value })}
                  options={opcoesClassificacao}
                  required
                />

                <FormField
                  label="Cidade do Evento"
                  value={item.cidadeEvento}
                  onChange={(e) =>
                    onEdit(item.id, { ...item, cidadeEvento: e.target.value })
                  }
                />

                <FormField
                  label="Ano"
                  value={item.ano}
                  onChange={(e) =>
                    onEdit(item.id, { ...item, ano: e.target.value })
                  }
                  type="year"
                  required
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </PerfilAcademicoSectionLayout>
  );
}