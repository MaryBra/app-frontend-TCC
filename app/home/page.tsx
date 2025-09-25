"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MenuLateral from "../components/MenuLateral";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Search, User, Heart } from "lucide-react";
import { Bookmark } from "lucide-react";



export default function Home() {
  const router = useRouter();

  // Simulação de usuário logado (fictício)
  const usuario = {
    nome: "Malu Oliveira",
    tipoPerfil: "pesquisador", // pode ser "empresa" ou "pesquisador"
  };

  // Mock - Recomendações (simulação de dados do backend)
  const [recomendacoes, setRecomendacoes] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    const mockData = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      nome: `Usuário ${i + 1}`,
      area: "Análise de Sistemas",
      tags: ["Suporte Técnico", "Banco de Dados"],
    }));
    setRecomendacoes(mockData);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Menu lateral fixo */}
      <MenuLateral />

      {/* Conteúdo principal */}
      <div className="flex-1 ml-20 p-6 overflow-y-auto pl-20 pr-20">
        {/* Barra Superior */}
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow-md w-1/2">
            <Search className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Buscar por recrutador, pesquisa..."
              className="flex-1 outline-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow-md">
              <img
                src="/images/user.png"
                alt="user"
                className="w-8 rounded-full mr-2"
              />
              <span className="mr-2">{usuario.nome}</span>
              <button
                className="bg-[#990000] text-white px-3 py-1 rounded-md shadow-md hover:bg-red-700 cursor-pointer"
                onClick={() =>
                  router.push(
                    usuario.tipoPerfil === "empresa"
                      ? "/perfilEmpresa"
                      : "/perfilPesquisador"
                  )
                }
              >
                Ver Perfil
              </button>
            </div>
          </div>
        </header>

        {/* Card de Boas-vindas */}
        <div className="bg-white rounded-xl shadow-md p-6 flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-[#990000]">
              Bem vinda, <span className="text-black">{usuario.nome}</span>
            </h1>
            <p className="text-bold text-[#990000] font-semibold text-lg">
              Tenha um ótimo dia!
            </p>
          </div>
          <img
            src="/images/boasvindas.png"
            alt="Boas vindas"
            className="w-68 mr-20"
          />
        </div>

        {/* Recomendações */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-md">Recomendações</h2>
            <button className="px-3 py-1 bg-white shadow-md rounded-lg hover:bg-gray-200">
              Ver mais
            </button>
          </div>

          {/* Carrossel com setas */}
          <div className="relative">
            <Swiper
              spaceBetween={20}
              slidesPerView={4}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              modules={[Navigation]}
              className="pb-6"
            >
              {recomendacoes.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center relative">
                    {/* Botões de coração */}
                    <div className="absolute top-3 right-3 flex gap-2">
                      
                      <button className="p-1 rounded-full bg-gray-100 hover:bg-blue-100">
                        <Bookmark className="w-5 h-5 text-gray-500 hover:text-blue-600" />
                      </button>
                      <button className="p-1 rounded-full bg-gray-100 hover:bg-red-100">
                        <Heart className="w-5 h-5 text-gray-500 hover:text-red-600" />
                      </button>
                    </div>

                    <img
                      src="/images/user.png"
                      alt="user"
                      className="w-20 rounded-full mb-3"
                    />
                    <h3 className="font-semibold">{item.nome}</h3>
                    <p className="text-gray-500 text-sm mb-4">{item.area}</p>
                    <div className="flex gap-2 mt-2 flex-wrap justify-center">
                      {item.tags.map((tag: string, idx: string) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-200 px-2 py-1 rounded-full border border-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="bg-gray-200 w-full h-0.5 my-3"></div>

                    {/* Botão contato que abre modal */}
                    <button
                      className="text-[#990000] font-semibold hover:underline"
                      onClick={() => {
                        setSelectedUser(item);
                        setModalOpen(true);
                      }}
                    >
                      Contato
                    </button>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Botões de navegação customizados */}
            <div className="absolute top-1/2 -left-6 z-10 cursor-pointer bg-gray-200 text-gray-700 px-2 py-1 rounded-full shadow hover:bg-white transition">
              ←
            </div>
            <div className="absolute top-1/2 -right-6 z-10 cursor-pointer bg-gray-200 text-gray-700 px-2 py-1 rounded-full shadow hover:bg-white transition">
              →
            </div>
          </div>
        </section>
      </div>

      {/* Modal de contato */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold text-[#990000] mb-4">
              Contato com {selectedUser?.nome}
            </h2>
            <p className="mb-4 text-gray-600">
              Aqui você pode abrir o chat ou enviar mensagem para{" "}
              {selectedUser?.nome}.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </button>
              <button className="px-4 py-2 bg-[#990000] text-white rounded-lg hover:bg-red-700">
                Enviar Mensagem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
