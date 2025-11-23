const TABS = [
  "Formações Acadêmicas",
  "Atuações Profissionais",
  "Artigos",
  "Livros",
  "Capítulos",
  "Trabalho em Eventos",
  "Projetos de Pesquisa",
  "Premiações",
  "Orientações",
];

export function PerfilAcademicoTabs({ active, onChange }: { active: string; onChange: (tab: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 mt-4 justify-center">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition
            ${active === tab
              ? "bg-[#990000] hover:bg-red-700 rounded-lg text-white shadow"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"}
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

