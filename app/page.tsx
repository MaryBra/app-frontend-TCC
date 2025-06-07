"use client"; // Next.js directive para componentes que usam hooks (executam no cliente)

import { useState } from "react"; // Importa hook de estado
import { useRouter } from "next/navigation"; // Importa o hook de roteamento
import Image from "next/image";    // Componente otimizado de imagem do Next.js

export default function Home() {
  // Estado para armazenar o arquivo XML selecionado
  const [arquivo, setArquivo] = useState(null);
  const router = useRouter(); // Hook para navegar entre páginas

  // Função para enviar o arquivo para a API
  const enviarArquivo = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do form

    // Verifica se o usuário selecionou algum arquivo
    if (!arquivo) {
      alert("Selecione um arquivo XML.");
      return;
    }

    // Cria um FormData para enviar o arquivo
    const formData = new FormData();
    formData.append("xml", arquivo); // Adiciona o arquivo no campo 'xml'

    try {
      // Faz uma requisição POST para a API backend
      const resposta = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData,
      });

      // Recebe e exibe a resposta da API
      const resultado = await resposta.json();
      alert(resultado.mensagem);

      //simula o redirecionamento para a página de tags
      router.push("/selecionandoTags");
    } 
    catch (error) 
    {
      console.error("Erro ao enviar:", error);
      alert("Erro ao enviar o arquivo.");


      router.push("/selecionandoTags");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen font-[family-name:var(--font-geist-sans)]">
      {/** 
       * Layout principal
       * - flex-col no mobile (um em cima do outro)
       * - flex-row no desktop (lado a lado)
       */}

      {/* Lado direito no desktop — logo e texto */}
      <div className="bg-white w-full md:w-1/2 h-[50%] md:h-screen flex flex-col justify-between items-center">
        {/* Container branco */}

        {/* Topo - Logo e texto explicativo */}
        <div className="flex flex-col items-center mt-8 md:mt-32">
          <Image
            src="/images/logo_1.png"
            alt="Logo"
            width={150}
            height={150}
            quality={100}
            priority
          />
          <p className="text-center mt-4 px-4 text-base md:text-xl">
            Faça o Upload do seu currículo Lattes para finalizar o seu cadastro
          </p>
        </div>

        {/* Imagem ilustrativa no fundo da div */}
        <div className="mb-0 md:mb-0">
          <div className="mb-0 md:mb-0 flex justify-center">
            <Image
              src="/images/ilustracao-importacao.png"
              alt="ilustracao-importacao"
              width={400}
              height={400}
              className="w-[250px] md:w-[400px] lg:w-[600px] h-auto object-contain"
              quality={100}
              priority
            />
          </div>
        </div>
      </div>

      {/* Lado esquerdo no desktop — upload */}
      <div className="bg-[#990000] w-full md:w-1/2 h-[50%] md:h-screen text-white flex flex-col items-center justify-center">
        {/* Container vermelho */}

        {/* Título */}
        <h1 className="text-xl md:text-2xl mb-4 text-center px-4">
          Upload do Currículo Lattes (XML)
        </h1>

        {/* Formulário de envio */}
        <form onSubmit={enviarArquivo} className="flex flex-col items-center">
          {/* Input de arquivo escondido */}
          <input
            id="arquivo"
            type="file"
            accept=".xml"
            onChange={(e) => setArquivo(e.target.files[0])} // Atualiza o estado com o arquivo selecionado
            className="hidden"
          />

          {/* Label que funciona como botão para selecionar o arquivo */}
          <label htmlFor="arquivo" className="cursor-pointer">
            <Image
              src="/images/upload.png"
              alt="curriculo-import"
              width={100}
              height={100}
            />
          </label>

          {/* Exibe o nome do arquivo se houver arquivo selecionado */}
          {arquivo && (
            <p className="mt-2 text-sm text-center px-4">
              Arquivo selecionado: <span className="font-semibold">{arquivo.name}</span>
            </p>
          )}

          <br />

          {/* Botão de envio */}
          <button
            type="submit"
            className="bg-white text-[#990000] px-4 py-2 rounded"
          >
            Enviar para a API
          </button>
        </form>
      </div>
    </div>
  );
}
