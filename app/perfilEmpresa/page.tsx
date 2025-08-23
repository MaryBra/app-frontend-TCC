"use client"

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

export default function Inicio() {
  const router = useRouter();

  // Estados para cada campo
  const [empresa, setEmpresa] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [site, setSite] = useState("");
  const [setor, setSetor] = useState("");
  const [frase, setFrase] = useState("");
  const [textoEmpresa, setTextoEmpresa] = useState("");

  // Máscara para telefone
  const handleTelefoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
    setTelefone(value);
  };

  // Função para enviar os dados ao backend
  const handleSubmit = async () => {
    const dados = {
      empresa,
      endereco,
      telefone,
      email,
      site,
      setor,
      frase,
      textoEmpresa,
    };

    try {
      const res = await fetch("/api/salvarEmpresa", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      if (res.ok) {
        alert("Empresa cadastrada com sucesso!");
        router.push("/telaPerfilEmpresa"); 
      } else {
        alert("Erro ao cadastrar a empresa.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro na requisição.");
    }
  };

  return (
    <div className="flex items-center justify-between h-screen bg-gray-100">
      <div className="bg-[#990000] w-1/5 h-full flex flex-col items-center relative">
        <h2 className="text-white text-2xl font-bold text-center mt-20 mr-20">
          Criar Conta
        </h2>
        <div className="absolute top-1/2 transform -translate-y-1/2 flex flex-col items-center">
          <h2 className="text-white text-lg font-bold text-center">
            Dados da Empresa
          </h2>
          <div className="bg-white h-0.5 w-full mt-1"></div>
        </div>
      </div>

      <div className="bg-white p-8 shadow-md w-4/5 h-full flex items-center justify-start flex-col">
        <Image
          src="/images/logo_1.png"
          alt="Logo"
          width={150}
          height={150}
          quality={100}
          priority
          className="drop-shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer"
        />

        {/* Nome da Empresa */}
        <div className="relative w-2/3 mt-8">
          <input
            type="text"
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
            placeholder=" "
            className="peer w-full border-0 border-b-2 border-gray-500 bg-transparent
                       focus:border-red-700 focus:outline-none focus:ring-0
                       text-gray-700 py-2 px-2 transition-colors duration-300"
          />
          <label
            htmlFor="empresa"
            className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all
                       peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700
                       peer-placeholder-shown:top-2
                       peer-focus:-top-3.5 peer-focus:text-red-700 peer-focus:text-sm"
          >
            Nome Empresa
          </label>
        </div>

        {/* Endereço */}
        <div className="relative w-2/3 mt-8">
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            placeholder=" "
            className="peer w-full border-0 border-b-2 border-gray-500 bg-transparent
                       focus:border-red-700 focus:outline-none focus:ring-0
                       text-gray-700 py-2 px-2 transition-colors duration-300"
          />
          <label
            htmlFor="endereco"
            className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all
                       peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700
                       peer-placeholder-shown:top-2
                       peer-focus:-top-3.5 peer-focus:text-red-700 peer-focus:text-sm"
          >
            Endereço
          </label>
        </div>

        {/* Telefone e Email lado a lado */}
        <div className="flex gap-4 mt-8 w-2/3">
          {/* Telefone */}
          <div className="relative w-1/3">
            <input
              type="text"
              value={telefone}
              onChange={handleTelefoneChange}
              placeholder=""
              className="peer w-full border-0 border-b-2 border-gray-500 bg-transparent
                         focus:border-red-700 focus:outline-none focus:ring-0
                         text-gray-700 py-2 px-2 transition-colors duration-300"
            />
            <label
              htmlFor="telefone"
              className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all
                         peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700
                         peer-placeholder-shown:top-2
                         peer-focus:-top-3.5 peer-focus:text-red-700 peer-focus:text-sm"
            >
              Telefone
            </label>
          </div>

          {/* Email */}
          <div className="relative w-2/3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              className="peer w-full border-0 border-b-2 border-gray-500 bg-transparent
                         focus:border-red-700 focus:outline-none focus:ring-0
                         text-gray-700 py-2 px-2 transition-colors duration-300"
            />
            <label
              htmlFor="email"
              className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all
                         peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700
                         peer-placeholder-shown:top-2
                         peer-focus:-top-3.5 peer-focus:text-red-700 peer-focus:text-sm"
            >
              Email
            </label>
          </div>
        </div>

        {/* Site */}
        <div className="relative w-2/3 mt-8">
          <input
            type="text"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            placeholder=" "
            className="peer w-full border-0 border-b-2 border-gray-500 bg-transparent
                       focus:border-red-700 focus:outline-none focus:ring-0
                       text-gray-700 py-2 px-2 transition-colors duration-300"
          />
          <label
            htmlFor="site"
            className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all
                       peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700
                       peer-placeholder-shown:top-2
                       peer-focus:-top-3.5 peer-focus:text-red-700 peer-focus:text-sm"
          >
            Site
          </label>
        </div>

        {/* Setor */}
        <div className="relative w-2/3 mt-8">
          <input
            type="text"
            value={setor}
            onChange={(e) => setSetor(e.target.value)}
            placeholder=" "
            className="peer w-full border-0 border-b-2 border-gray-500 bg-transparent
                       focus:border-red-700 focus:outline-none focus:ring-0
                       text-gray-700 py-2 px-2 transition-colors duration-300"
          />
          <label
            htmlFor="setor"
            className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all
                       peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700
                       peer-placeholder-shown:top-2
                       peer-focus:-top-3.5 peer-focus:text-red-700 peer-focus:text-sm"
          >
            Setor
          </label>
        </div>

        {/* Frase de destaque */}
        <div className="relative w-2/3 mt-8">
          <input
            type="text"
            value={frase}
            onChange={(e) => setFrase(e.target.value)}
            placeholder=" "
            className="peer w-full border-0 border-b-2 border-gray-500 bg-transparent
                       focus:border-red-700 focus:outline-none focus:ring-0
                       text-gray-700 py-2 px-2 transition-colors duration-300"
          />
          <label
            htmlFor="frase"
            className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all
                       peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700
                       peer-placeholder-shown:top-2
                       peer-focus:-top-3.5 peer-focus:text-red-700 peer-focus:text-sm"
          >
            Frase de destaque
          </label>
          {/* Ícone de ? */}
            <div className="absolute right-0 top-0 mt-1 flex items-center">
                <span className="group relative cursor-pointer text-gray-500 font-bold text-lg">
                ?
                {/* Tooltip */}
                <span className="absolute bottom-full mb-2 w-80 left-1/2 -translate-x-1/2 
                                bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 
                                group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    Use esse campo para adicionar um texto complementar, um subtitulo que complemente o objetivo da sua empresa!
                </span>
                </span>
            </div>
        </div>

        {/* Texto sobre a empresa */}
        <div className="relative w-2/3 mt-8">
          <input
            type="text"
            value={textoEmpresa}
            onChange={(e) => setTextoEmpresa(e.target.value)}
            placeholder=" "
            className="peer w-full border-0 border-b-2 border-gray-500 bg-transparent
                       focus:border-red-700 focus:outline-none focus:ring-0
                       text-gray-700 py-2 px-2 transition-colors duration-300"
          />
          <label
            htmlFor="textoEmpresa"
            className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all
                       peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700
                       peer-placeholder-shown:top-2
                       peer-focus:-top-3.5 peer-focus:text-red-700 peer-focus:text-sm"
          >
            Descrição sobre a empresa
          </label>
          {/* Ícone de ? */}
            <div className="absolute right-0 top-0 mt-1 flex items-center">
                <span className="group relative cursor-pointer text-gray-500 font-bold text-lg">
                ?
                {/* Tooltip */}
                <span className="absolute bottom-full mb-2 w-80 left-1/2 -translate-x-1/2 
                                bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 
                                group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    Use esse campo para descrever a sua empresa, todas as informações que você gostaria que as pessoas vissem sobre.
                </span>
                </span>
            </div>
        </div>

        {/* Botão */}
        <div className="flex justify-end mt-8 w-2/3">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition"
          >
            Cadastrar
          </button>
        </div>
      </div>
    </div>
  );
}
