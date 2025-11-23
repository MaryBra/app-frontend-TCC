import { Trash2, Star, GraduationCap } from "lucide-react";
import FormField from "../FormField";
import { PerfilAcademicoSectionLayout } from "./PerfilAcademicoSectionLayout";
import Dropdown from "../Dropdown";
import { label } from "framer-motion/client";

export function FormacoesSection({ data, onAdd, onEdit, onDelete }: any) {

    const opcoesNivel = [
        { label: "CURSO TÉCNICO PROFISSIONALIZANTE", value: "CURSO TÉCNICO PROFISSIONALIZANTE"},
        { label: "GRADUAÇÃO", value: "GRADUAÇÃO" },
        { label: "APERFEIÇOAMENTO", value: "APERFEIÇOAMENTO"},
        { label: "ESPECIALIZAÇÃO", value: "ESPECIALIZAÇÃO" },
        { label: "MESTRADO", value: "MESTRADO" },
        { label: "MESTRADO PROFISSIONALIZANTE", value: "MESTRADO PROFISSIONALIZANTE"},
        { label: "DOUTORADO", value: "DOUTORADO" },
        { label: "RESIDÊNCIA MÉDICA", value: "RESIDÊNCIA MÉDICA"},
        { label: "LIVRE DOCÊNCIA", value: "LIVRE DOCÊNCIA"},
        { label: "PÓS-DOUTORADO", value: "PÓS-DOUTORADO" },
    ];

    const opcoesStatus = [
        { label: "CONCLUÍDO", value: "CONCLUÍDO" },
        { label: "EM ANDAMENTO", value: "EM ANDAMENTO" },
    ];

  return (
    <PerfilAcademicoSectionLayout title="Formações Acadêmicas">
      {/* Botão adicionar novo */}
      <div className="flex justify-center pt-2">
        <button
        onClick={() => 
          onAdd({
            nivel: "",
            curso: "",
            instituicao: "",
            status: "EM ANDAMENTO",
            anoInicio: undefined,
            anoConclusao: undefined,
            tituloTrabalho: "",
            orientador: "",
            destaque: false,
          })
        }
        className="px-4 py-2 text-white rounded-lg shadow-md transition text-sm shadow bg-[#990000] hover:bg-red-700"
      >
        + Adicionar Formação Acadêmica
      </button>
      </div>

      {/* Empty State - Quando não há formações */}
      {data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4 mt-4">
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-4 rounded-full">
                <GraduationCap size={48} className="text-red-700" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Nenhuma formação acadêmica cadastrada
            </h3>
            <p className="text-gray-600 text-sm">
              Adicione suas formações acadêmicas para enriquecer seu perfil e destacar sua trajetória educacional.
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

              {/* CAMPOS DA FORMAÇÃO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-28">
                  <Dropdown
                      label="Nível"
                      value={item.nivel}
                      onChange={(value) => onEdit(item.id, { ...item, nivel: value })}
                      options={opcoesNivel}
                      required
                  />

                <FormField
                  label="Curso"
                  value={item.curso}
                  onChange={(e) =>
                    onEdit(item.id, { ...item, curso: e.target.value })
                  }
                  required
                />

                <FormField
                  label="Instituição"
                  value={item.instituicao}
                  onChange={(e) =>
                    onEdit(item.id, { ...item, instituicao: e.target.value })
                  }
                  required
                />

                <Dropdown
                  label="Status"
                  value={item.status}
                  onChange={(value) => onEdit(item.id, { ...item, status: value })}
                  options={opcoesStatus}
                  />

                <FormField
                  label="Ano Início"
                  value={item.anoInicio}
                  onChange={(e) =>
                    onEdit(item.id, { ...item, anoInicio: e.target.value })
                  }
                  type="year"
                />

                <FormField
                  label="Ano Conclusão"
                  value={item.anoConclusao}
                  onChange={(e) =>
                    onEdit(item.id, { ...item, anoConclusao: e.target.value })
                  }
                  type="year"
                />

                <FormField
                  label="Título do Trabalho"
                  value={item.tituloTrabalho}
                  onChange={(e) =>
                    onEdit(item.id, {
                      ...item,
                      tituloTrabalho: e.target.value,
                    })
                  }
                />

                <FormField
                  label="Orientador"
                  value={item.orientador}
                  onChange={(e) =>
                    onEdit(item.id, { ...item, orientador: e.target.value })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </PerfilAcademicoSectionLayout>
  );
}