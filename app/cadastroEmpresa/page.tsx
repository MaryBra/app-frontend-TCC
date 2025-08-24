"use client"

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

export default function Inicio() {
  const router = useRouter();

  // Aba ativa
  const [abaAtiva, setAbaAtiva] = useState("empresa");

  // Estados para cada campo
  const [nomeComercial, setEmpresa] = useState("");
  const [cnpj, setCNPJ] = useState("");
  const [nomeRegistro, setNomeRegistro] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [site, setSite] = useState("");
  const [setor, setSetor] = useState("");
  const [frase, setFrase] = useState("");
  const [textoEmpresa, setTextoEmpresa] = useState("");

  // Endereço
  const [logradouro, setLogradouro] = useState("");
  const [bairro, setBairro] = useState("");
  const [numeroEndereco, setNumero] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cep, setCep] = useState("");

  // Máscara para telefone
  const handleTelefoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
    setTelefone(value);
  };

  //Função que preenche as informações de endereço com base no cep
  const buscarCep = async (valor) => {
    const cepFormatado = valor.replace(/\D/g, ""); // remove não numéricos
    setCep(valor);

    if (cepFormatado.length === 8) { // só chama API se tiver 8 dígitos
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cepFormatado}/json/`);
        const data = await res.json();

        if (!data.erro) {
          setLogradouro(data.logradouro || "");
          setBairro(data.bairro || "");         // <- corrigido
          setCidade(data.localidade || "");     // <- cidade
          setEstado(data.uf || "");             // <- estado
        } else {
          alert("CEP não encontrado!");
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  // Função para enviar os dados ao backend
  const handleSubmit = async () => {
    const dados = {
      nomeComercial,
      nomeRegistro,
      cnpj,
      telefone,
      email,
      site,
      setor,
      frase,
      textoEmpresa,
      endereco: { logradouro, numeroEndereco, cidade, estado, cep, bairro }
    };

    try {
      const res = await fetch("/localhost:8080/api/empresas/salvarEmpresa", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      if (res.ok) {
        alert("Empresa cadastrada com sucesso!");
        router.push("/perfilEmpresa"); 
      } else {
        alert("Erro ao cadastrar a empresa.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro na requisição.");
    }
  };

  // Validação da primeira aba antes de prosseguir
  const handleNext = () => {
      if (!nomeComercial || !nomeRegistro || !cnpj || !telefone || !email || !setor) {
        alert("Preencha os campos obrigatórios da Empresa antes de continuar!");
        return;
      }
      setAbaAtiva("endereco");
    };

    const handleCNPJChange = (e) => {
    let valor = e.target.value.replace(/\D/g, ""); // remove tudo que não for número
    if (valor.length > 14) valor = valor.slice(0, 14); // limita 14 dígitos

    // aplica a máscara 00.000.000/0000-00
    valor = valor.replace(/^(\d{2})(\d)/, "$1.$2");
    valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    valor = valor.replace(/\.(\d{3})(\d)/, ".$1/$2");
    valor = valor.replace(/(\d{4})(\d)/, "$1-$2");

    setCNPJ(valor);
  };

  return (
    <div className="flex items-center justify-between h-screen bg-gray-100">
      {/* MENU LATERAL */}
      <div className="bg-[#990000] w-1/5 h-full flex flex-col items-center relative">
        <h2 className="text-white text-2xl font-bold text-center mt-20 mr-20">
          Criar Conta
        </h2>
        <div className="absolute top-1/2 transform -translate-y-1/2 flex flex-col items-start gap-6">
          {/* Aba Empresa */}
          <div 
            className="cursor-pointer"
            onClick={() => setAbaAtiva("empresa")}
          >
            <h2 className="text-white text-lg font-bold">
              Dados da Empresa
            </h2> 
            {abaAtiva === "empresa" && (
              <div className="bg-white h-0.5 w-full mt-1"></div>
            )}
          </div>

          {/* Aba Endereço */}
          <div 
            className="cursor-pointer"
            onClick={() => setAbaAtiva("endereco")}
          >
            <h2 className="text-white text-lg font-bold">
              Endereço
            </h2>
            {abaAtiva === "endereco" && (
              <div className="bg-white h-0.5 w-full mt-1"></div>
            )}
          </div>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="bg-white p-8 shadow-md w-4/5 h-full flex items-center justify-start flex-col overflow-y-auto">
        <Image
          src="/images/logo_1.png"
          alt="Logo"
          width={150}
          height={150}
          quality={100}
          priority
          className="drop-shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer"
        />

        {/* CONTEÚDO DA ABA EMPRESA */}
        {abaAtiva === "empresa" && (
          <div className="w-full flex flex-col items-center">
            {/* Nome de registro da empresa */}
            <div className="relative w-2/3 mt-8">
              <input
                type="text"
                value={nomeRegistro}
                onChange={(e) => setNomeRegistro(e.target.value)}
                placeholder=" "
                required
                className="peer w-full border-0 border-b-2 border-gray-500 bg-transparent
                          focus:border-red-700 focus:outline-none focus:ring-0
                          text-gray-700 py-2 px-2 transition-colors duration-300"
              />
              <label
                className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all
                          peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700
                          peer-placeholder-shown:top-2
                          peer-focus:-top-3.5 peer-focus:text-red-700 peer-focus:text-sm"
              >
                Nome de Registro *
              </label>
            </div>
            {/* Nome da Empresa */}
            <div className="relative w-2/3 mt-8">
              <input
                type="text"
                value={nomeComercial}
                onChange={(e) => setEmpresa(e.target.value)}
                placeholder=" "
                required
                className="peer w-full border-0 border-b-2 border-gray-500 bg-transparent
                          focus:border-red-700 focus:outline-none focus:ring-0
                          text-gray-700 py-2 px-2 transition-colors duration-300"
              />
              <label
                className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all
                          peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700
                          peer-placeholder-shown:top-2
                          peer-focus:-top-3.5 peer-focus:text-red-700 peer-focus:text-sm"
              >
                Nome Comercial *
              </label>
            </div>

            {/* CNPJ */}
            <div className="relative w-2/3 mt-8">
              <input
                type="text"
                value={cnpj}
                onChange={handleCNPJChange}
                placeholder=" "
                required
                className="peer w-full border-0 border-b-2 border-gray-500 bg-transparent
                          focus:border-red-700 focus:outline-none focus:ring-0
                          text-gray-700 py-2 px-2 transition-colors duration-300"
              />
              <label
                className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all
                          peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700
                          peer-placeholder-shown:top-2
                          peer-focus:-top-3.5 peer-focus:text-red-700 peer-focus:text-sm"
              >
                CNPJ *
              </label>
            </div>

            {/* Telefone + Email */}
            <div className="flex gap-4 mt-8 w-2/3">
              <div className="relative w-1/3">
                <input
                  type="text"
                  value={telefone}
                  onChange={handleTelefoneChange}
                  placeholder=" "
                  required
                  className="peer w-full border-0 border-b-2 border-gray-500 bg-transparent
                            focus:border-red-700 focus:outline-none focus:ring-0
                            text-gray-700 py-2 px-2 transition-colors duration-300"
                />
                <label
                  className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all
                            peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700
                            peer-placeholder-shown:top-2
                            peer-focus:-top-3.5 peer-focus:text-red-700 peer-focus:text-sm"
                >
                  Telefone *
                </label>
              </div>
              <div className="relative w-2/3">
                <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                required
                className="peer w-full border-0 border-b-2 border-gray-500 bg-transparent
                          focus:border-red-700 focus:outline-none focus:ring-0
                          text-gray-700 py-2 px-2 transition-colors duration-300"
              />
              <label
                className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all
                          peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700
                          peer-placeholder-shown:top-2
                          peer-focus:-top-3.5 peer-focus:text-red-700 peer-focus:text-sm"
              >
                Email *
              </label>
              </div>
            </div>

            {/* site */}
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
                className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all
                          peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700
                          peer-placeholder-shown:top-2
                          peer-focus:-top-3.5 peer-focus:text-red-700 peer-focus:text-sm"
              >
                Site
              </label>
            </div>

             {/* setor */}
            <div className="relative w-2/3 mt-8">
              <input
                type="text"
                value={setor}
                onChange={(e) => setSetor(e.target.value)}
                placeholder=" "
                required
                className="peer w-full border-0 border-b-2 border-gray-500 bg-transparent
                          focus:border-red-700 focus:outline-none focus:ring-0
                          text-gray-700 py-2 px-2 transition-colors duration-300"
              />
              <label
                className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all
                          peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700
                          peer-placeholder-shown:top-2
                          peer-focus:-top-3.5 peer-focus:text-red-700 peer-focus:text-sm"
              >
                Setor *
              </label>
            </div>

             {/* frase */}
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
                className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all
                          peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700
                          peer-placeholder-shown:top-2
                          peer-focus:-top-3.5 peer-focus:text-red-700 peer-focus:text-sm"
              >
                Frase
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

            {/* texto da empresa */}
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
                className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all
                          peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700
                          peer-placeholder-shown:top-2
                          peer-focus:-top-3.5 peer-focus:text-red-700 peer-focus:text-sm"
              >
                Descrição da Empresa
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

            {/* Botão de próximo */}
            <div className="flex justify-end mt-8 w-2/3">
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition"
              >
                Próximo
              </button>
            </div>
          </div>
        )}

        {/* CONTEÚDO DA ABA ENDEREÇO */}
        {abaAtiva === "endereco" && (
          <div className="w-full flex flex-col items-center">

            {/* CEP */}
            <div className="relative w-2/3 mt-8">
              <input
                type="text"
                value={cep}
                onChange={(e) => buscarCep(e.target.value)}
                maxLength={9} // formato 00000-000
                placeholder=" "
                required
                className="peer w-full border-0 border-b-2 border-gray-500 bg-transparent
                          focus:border-red-700 focus:outline-none focus:ring-0
                          text-gray-700 py-2 px-2 transition-colors duration-300"
              />
              <label
                className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all
                          peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700
                          peer-placeholder-shown:top-2
                          peer-focus:-top-3.5 peer-focus:text-red-700 peer-focus:text-sm"
              >
                CEP *
              </label>
            </div>

            {/* Logradouro */}
            <div className="flex gap-4 mt-8 w-2/3">
              <div className="relative w-3/4">
                <input
                  type="text"
                  value={logradouro}
                  onChange={(e) => setLogradouro(e.target.value)}
                  placeholder=" "
                  required
                  className="peer w-full border-0 border-b-2 border-gray-500 bg-transparent
                            focus:border-red-700 focus:outline-none focus:ring-0
                            text-gray-700 py-2 px-2 transition-colors duration-300"
                />
                <label
                  className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all
                            peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700
                            peer-placeholder-shown:top-2
                            peer-focus:-top-3.5 peer-focus:text-red-700 peer-focus:text-sm"
                >
                  Logradouro *
                </label>
              </div>
              <div className="relative w-1/4">
                <input
                  type="text"
                  value={numeroEndereco}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder=" "
                  required
                  className="peer w-full border-0 border-b-2 border-gray-500 bg-transparent
                            focus:border-red-700 focus:outline-none focus:ring-0
                            text-gray-700 py-2 px-2 transition-colors duration-300"
                />
                <label
                  className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all
                            peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700
                            peer-placeholder-shown:top-2
                            peer-focus:-top-3.5 peer-focus:text-red-700 peer-focus:text-sm"
                >
                  Número *
                </label>
              </div>
            </div>

            {/* Cidade + Estado */}
            <div className="flex gap-4 mt-8 w-2/3">
              <div className="relative w-1/3">
                  <input
                    type="text"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    placeholder=" "
                    required
                    className="peer w-full border-0 border-b-2 border-gray-500 bg-transparent
                              focus:border-red-700 focus:outline-none focus:ring-0
                              text-gray-700 py-2 px-2 transition-colors duration-300"
                  />
                  <label
                    className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all
                              peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700
                              peer-placeholder-shown:top-2
                              peer-focus:-top-3.5 peer-focus:text-red-700 peer-focus:text-sm"
                  >
                    Bairro *
                  </label>
              </div>

              <div className="relative w-1/3">
                <input
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  placeholder=" "
                  required
                  className="peer w-full border-0 border-b-2 border-gray-500 bg-transparent
                            focus:border-red-700 focus:outline-none focus:ring-0
                            text-gray-700 py-2 px-2 transition-colors duration-300"
                />
                <label
                  className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all
                            peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700
                            peer-placeholder-shown:top-2
                            peer-focus:-top-3.5 peer-focus:text-red-700 peer-focus:text-sm"
                >
                  Cidade *
                </label>
              </div>

              <div className="relative w-1/3">
                <input
                  type="text"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  placeholder=" "
                  required
                  className="peer w-full border-0 border-b-2 border-gray-500 bg-transparent
                            focus:border-red-700 focus:outline-none focus:ring-0
                            text-gray-700 py-2 px-2 transition-colors duration-300"
                />
                <label
                  className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all
                            peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700
                            peer-placeholder-shown:top-2
                            peer-focus:-top-3.5 peer-focus:text-red-700 peer-focus:text-sm">
                  Estado *
                </label>
              
              </div>
            </div>

            {/* Botão de cadastrar */}
            <div className="flex justify-end mt-8 w-2/3">
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition"
              >
                Cadastrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
