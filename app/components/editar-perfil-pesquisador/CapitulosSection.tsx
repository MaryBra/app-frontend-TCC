import { Trash2, Star, BookMarked } from "lucide-react";
import FormField from "../FormField";
import { PerfilAcademicoSectionLayout } from "./PerfilAcademicoSectionLayout";

export function CapitulosSection({ data, onAdd, onEdit, onDelete }: any) {

  return (
    <PerfilAcademicoSectionLayout title="Capítulos de Livros">
      {/* Botão adicionar novo */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => 
            onAdd({
              editora: "",
              paginaInicial: undefined,
              paginaFinal: undefined,
              tituloCapitulo: "",
              nomeLivro: "",
              ano: undefined,
              destaque: false,
            })
          }
          className="px-4 py-2 text-white rounded-lg shadow-md transition text-sm shadow bg-[#990000] hover:bg-red-700"
        >
          + Adicionar Capítulo
        </button>
      </div>

      {/* Empty State - Quando não há capítulos */}
      {data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4 mt-4">
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-4 rounded-full">
                <BookMarked size={48} className="text-red-700" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Nenhum capítulo cadastrado
            </h3>
            <p className="text-gray-600 text-sm">
              Adicione seus capítulos de livros para enriquecer seu perfil e destacar suas contribuições editoriais.
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

              {/* CAMPOS DO CAPÍTULO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-28">
                <FormField
                  label="Título do Capítulo"
                  value={item.tituloCapitulo}
                  onChange={(e) =>
                    onEdit(item.id, { ...item, tituloCapitulo: e.target.value })
                  }
                  required
                />

                <FormField
                  label="Nome do Livro"
                  value={item.nomeLivro}
                  onChange={(e) =>
                    onEdit(item.id, { ...item, nomeLivro: e.target.value })
                  }
                  required
                />

                <FormField
                  label="Editora"
                  value={item.editora}
                  onChange={(e) =>
                    onEdit(item.id, { ...item, editora: e.target.value })
                  }
                  required
                />

                <FormField
                  label="Ano de Publicação"
                  value={item.ano}
                  onChange={(e) =>
                    onEdit(item.id, { ...item, ano: e.target.value })
                  }
                  type="year"
                  required
                />

                <FormField
                  label="Página Inicial"
                  value={item.paginaInicial}
                  onChange={(e) =>
                    onEdit(item.id, { ...item, paginaInicial: e.target.value })
                  }
                  type="number"
                />

                <FormField
                  label="Página Final"
                  value={item.paginaFinal}
                  onChange={(e) =>
                    onEdit(item.id, { ...item, paginaFinal: e.target.value })
                  }
                  type="number"
                />

                <FormField
                  label="DOI do Livro"
                  value={item.doi}
                  onChange={(e) =>
                    onEdit(item.id, { ...item, doi: e.target.value })
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