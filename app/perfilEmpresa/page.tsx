"use client";

import { useRouter } from "next/navigation";
import MenuLateral from "../components/MenuLateral";

export default function Empresa() {
  const router = useRouter();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Menu lateral fixo */}
      <MenuLateral />

      {/* Conteúdo principal */}
      <main className="flex-1 ml-20 overflow-y-auto">
        
        {/* Card principal da empresa */}
        <section className="bg-gray-300 shadow-md p-6 pl-20 flex flex-col md:flex-row gap-6 relative">
          
          {/* Imagem/ícone da empresa */}
          <div className="bg-purple-500 rounded-xl flex items-center justify-center w-full md:w-80 h-80 md:h-80 shadow">
            {/* Imagem de perfil da empresa */}
          </div>

          {/* Infos da empresa */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h1 className="text-5xl font-bold text-gray-700 mb-2">Empresa de Tecnologia</h1>
              <h2 className="text-2xl text-gray-700">Frase de destaque que represente a empresa</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm text-white">
                <div>
                  <p><span className="font-bold text-gray-700">Sede</span></p>
                  <p className="text-gray-700 mb-2">📍Curitiba, PR</p>
                  <p><span className="font-bold text-gray-700">Site</span></p>
                  <p className="text-gray-700 mb-2">www.site.com.br</p>
                  <p><span className="font-bold text-gray-700">Setor</span></p>
                  <p className="text-gray-700">Desenvolvimento de Software</p>
                </div>
                <div>
                  <p><span className="font-bold text-gray-700">Telefone</span></p>
                  <p className="text-gray-700 mb-2">(41) 9999-9999</p>
                  <p><span className="font-bold text-gray-700">Email</span></p>
                  <p className="text-gray-700">email@email.com.br</p>
                </div>
              </div>
            </div>

            {/* Botão */}
            <button className="bg-red-700 text-white px-4 py-2 mt-6 rounded-lg hover:bg-red-800 w-fit">
              Gerenciar Listas
            </button>
          </div>

          {/* Botão editar (canto superior direito) */}
          <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-100" onClick={() => router.push("/edicaoEmpresa")}>
            ✏️
          </button>

          {/* Última atualização */}
          <span className="absolute bottom-4 right-6 text-xs text-gray-700">
            Última atualização há 7 horas
          </span>
        </section>

        {/* Seção Visão Geral */}
        <section className="bg-gray-100 p-12 pt-6">
          <h2 className="text-md font-semibold mb-4">Sobre a Empresa</h2>

          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <p>
              A <strong>InovaTech Solutions</strong> é uma empresa especializada no desenvolvimento de software
              sob medida, criada para transformar ideias em soluções digitais inovadoras. Nosso foco está em
              criar sistemas ágeis, intuitivos e escaláveis, que ajudam empresas a otimizar processos e alcançar
              melhores resultados.
            </p>
            <ul className="space-y-2 list-disc list-inside text-gray-700">
              <li>Desenvolvimento de aplicativos web e mobile personalizados.</li>
              <li>Integração de sistemas e automação de processos.</li>
              <li>Consultoria em tecnologia e transformação digital.</li>
              <li>Equipe especializada em metodologias ágeis.</li>
              <li>Suporte e manutenção contínua para garantir alta performance.</li>
              <li>Soluções escaláveis que crescem junto com o seu negócio.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
