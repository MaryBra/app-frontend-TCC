"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Lightbulb } from "lucide-react";
import { CircleHelp } from "lucide-react";
import { Workflow } from "lucide-react";
import { SearchCheck } from "lucide-react";
import { CircleUser } from "lucide-react";
import { Earth } from "lucide-react";

export default function Inicio() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  const sections = [
    "hero",
    "projeto",
    "como-funciona",
    "beneficios",
    "video",
    "integrantes",
    "contato",
  ];

  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: "-10% 0px -10% 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: true,
          }));

          const sectionIndex = sections.indexOf(entry.target.id);
          if (sectionIndex !== -1) {
            setCurrentSection(sectionIndex);
          }
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollToNext = () => {
    const nextIndex = (currentSection + 1) % sections.length;
    scrollToSection(sections[nextIndex]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Dots */}
      <div className="fixed bottom-3 left-1/2 transform -translate-x-1/2 z-50">
        {sections.map((section, index) => (
          <button
            key={section}
            onClick={() => scrollToSection(section)}
            className={`w-3 h-3 rounded-full transition-all duration-300 mr-1 ${
              currentSection === index
                ? "bg-[#990000] scale-125"
                : "bg-gray-400 hover:bg-gray-600"
            }`}
            title={section.charAt(0).toUpperCase() + section.slice(1)}
          />
        ))}
      </div>

      {/* Scroll to Next Button */}
      <button
        onClick={scrollToNext}
        className="fixed bottom-6 right-6 bg-[#990000] text-white p-3 rounded-full shadow-lg hover:bg-red-800 transition-all duration-300 hover:scale-110 z-50"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      {/* Header */}
      <header className="bg-white shadow-sm fixed w-full top-0 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image
                src="/images/logo_1.png"
                alt="Logo"
                width={150}
                height={150}
                quality={100}
                priority
                className="drop-shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer mx-auto"
              />
            </div>
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => scrollToSection("projeto")}
                className="text-gray-800 hover:text-[#990000] transition-colors"
              >
                Projeto
              </button>
              <button
                onClick={() => scrollToSection("integrantes")}
                className="text-gray-800 hover:text-[#990000] transition-colors"
              >
                Integrantes
              </button>
              <button
                onClick={() => scrollToSection("contato")}
                className="text-gray-800 hover:text-[#990000] transition-colors"
              >
                Contato
              </button>
            </nav>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push("/login")}
                className="px-4 py-2 border-2 border-[#990000] text-[#990000] rounded hover:bg-[#990000] hover:text-white transition-all duration-300"
              >
                Entrar
              </button>
              <button
                onClick={() => router.push("/criarConta")}
                className="px-4 py-2 bg-[#990000] text-white rounded hover:bg-red-800 transition-all duration-300 hover:shadow-lg"
              >
                Cadastro
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="hero"
        className="bg-white py-20 pt-20 min-h-screen flex items-center"
      >
        <div className="mx-auto w-full pr-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div
              className={`lg:w-1/2 lg:pr-12 transition-all duration-1000 ${
                isVisible.hero
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              <Image
                src="/images/note.png"
                alt="Logo"
                width={1048}
                height={1048}
                quality={100}
                priority
                className="drop-shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer mx-auto"
              />
            </div>
            <div
              className={`lg:w-1/2 mt-10 lg:mt-0 transition-all duration-1000 delay-300 ${
                isVisible.hero
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }`}
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-6 mr-20">
                Plataforma de pesquisa unificada para pesquisadores e empresas
              </h1>
              <p className="text-gray-700 mb-8 mr-20">
                Conectamos pesquisadores e empresas com um único ecossistema a
                busca por talentos, inovação e oportunidades.
              </p>
              <button className="bg-[#990000] text-white px-8 py-3 rounded-lg hover:bg-red-800 transition-all duration-300  hover:shadow-lg hover:scale-105">
                Veja como funciona!
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Projeto Section */}
      <section
        id="projeto"
        className="bg-gray-50 py-20 min-h-screen flex items-center"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <h2
            className={`text-3xl mb-8 font-bold text-center text-[#990000] transition-all duration-1000 ${
              isVisible.projeto
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            Projeto
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div
              className={`transition-all duration-1000 delay-300 ${
                isVisible.projeto
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              <div className="flex items-start mb-6 group">
                <div className="bg-[#990000] p-2 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 mt-1 group-hover:scale-110 transition-transform duration-300">
                  <CircleHelp />
                </div>
                <div>
                  <h3 className="text-2xl text-[#990000] mb-2">
                    O que é a plataforma?
                  </h3>
                  <p className="text-gray-700">
                    A plataforma conecta pesquisadores especializados com
                    empresas que buscam soluções inovadoras através de um
                    sistema de pesquisa por palavra-chave, facilitando a
                    comunicação e colaboração entre ambos os lados.
                  </p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="bg-[#990000] p-2 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 mt-1 group-hover:scale-110 transition-transform duration-300">
                  <Lightbulb />
                </div>
                <div>
                  <h3 className="text-2xl  text-[#990000] mb-2">
                    Por que criamos essa solução?
                  </h3>
                  <p className="text-gray-700">
                    Identificamos a necessidade de uma ponte entre o
                    conhecimento acadêmico e as demandas do mercado. Nossa
                    plataforma oferece uma solução eficiente para conectar
                    talentos especializados com empresas que buscam inovação e
                    soluções específicas.
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`transition-all duration-1000 delay-500 ${
                isVisible.projeto
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }`}
            >
              <Image
                src="/images/note2.png"
                alt="Logo"
                width={400}
                height={400}
                quality={100}
                priority
                className="drop-shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Como a plataforma resolve isso? */}
      <section
        id="como-funciona"
        className="bg-[#990000] py-20 min-h-screen flex items-center"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <h2
            className={`text-3xl font-bold text-white mb-4 transition-all duration-1000 ${
              isVisible["como-funciona"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            Como a plataforma resolve isso?
          </h2>
          <p
            className={`text-red-50 mb-12 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
              isVisible["como-funciona"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            Nossa plataforma atua como intermediária entre pesquisadores e
            empresas, facilitando encontros estratégicos que geram valor real
            para ambos os lados através de funcionalidades específicas.
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: <Workflow className="w-14 h-14" />,
                title: "Integração Inteligente",
                desc: "Encontre especialistas através de palavras-chave relacionadas à sua área de interesse.",
              },
              {
                icon: <SearchCheck className="w-14 h-14" />,
                title: "Busca Avançada",
                desc: "Utilize filtros específicos para encontrar o perfil ideal para seu projeto.",
              },
              {
                icon: <CircleUser className="w-14 h-14" />,
                title: "Perfil Completo",
                desc: "Visualize informações detalhadas sobre formação, experiência e projetos.",
              },
              {
                icon: <Earth className="w-14 h-14" />,
                title: "Conexão Direta",
                desc: "Conecte-se diretamente com pesquisadores através de nossa plataforma.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`bg-white p-8 rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-500 ${
                  isVisible["como-funciona"]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${400 + index * 100}ms` }}
              >
                <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-gray-200 transition-colors duration-300">
                  <span className="text-5xl text-[#990000]">{item.icon}</span>
                </div>
                <h3 className="font-bold mb-2 text-xl text-[#990000]">
                  {item.title}
                </h3>
                <p className="text-md text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por que usar a plataforma? */}
      <section
        id="beneficios"
        className="bg-white py-20 min-h-screen flex items-center relative overflow-hidden"
      >
        <div className="w-full">
          <h2
            className={`text-3xl font-bold text-center text-[#990000] transition-all duration-1000 ${
              isVisible.beneficios
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            Por que usar a plataforma?
          </h2>

          {/* Imagem de fundo */}
          <div
            className={`absolute top-10 -translate-x-1/2 z-0 transition-all duration-1000 delay-300 ${
              isVisible.beneficios
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <Image
              src="/images/fundo.png"
              alt="Logo"
              width={400}
              height={400}
              quality={100}
              priority
              className="drop-shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer"
            />
          </div>

          {/* Conteúdo principal */}
          <div className="relative flex justify-center z-10">
            <div className="lg:w-2/3 lg:mb-20 mt-20 mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div
                  className={`bg-[#990000] text-white p-12 rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-500 ${
                    isVisible.beneficios
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: "500ms" }}
                >
                  <h3 className="text-xl font-bold mb-4">Para Pesquisadores</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Aumente a visibilidade do seu trabalho</li>
                    <li>• Encontre oportunidades de colaboração</li>
                    <li>• Monetize seu conhecimento especializado</li>
                    <li>
                      • Conecte-se com empresas do seu setor e diversifique sua
                      carreira
                    </li>
                    <li>• Amplie suas redes de pesquisa e suas áreas</li>
                  </ul>
                </div>

                <div
                  className={`bg-[#990000] text-white p-12 rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-500 ${
                    isVisible.beneficios
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: "700ms" }}
                >
                  <h3 className="text-xl font-bold mb-4">Para Empresas</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Tenha acesso rápido aos melhores especialistas</li>
                    <li>
                      • Encontre soluções customizadas para problemas
                      específicos
                    </li>
                    <li>• Acelere processos de inovação</li>
                    <li>• Reduza custos com consultorias externas</li>
                    <li>
                      • Mantenha-se atualizado com as últimas pesquisas e
                      inovações
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section
        id="video"
        className="bg-[#990000] py-20 min-h-screen flex items-center"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <p
            className={`text-red-50 mb-8 transition-all duration-1000 ${
              isVisible.video
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            Assista ao tutorial completo de como se cadastrar na plataforma
            abaixo
          </p>
          <h2
            className={`text-2xl font-bold text-white mb-12 transition-all duration-1000 delay-200 ${
              isVisible.video
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            Como exportar o meu curriculo lattes para o LaVerse?
          </h2>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            <div
              className={`w-96 h-64 rounded-lg overflow-hidden shadow-lg transition-all duration-500 hover:scale-105 ${
                isVisible.video
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/3ZnC4DTshc4"
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div
              className={`text-center max-w-md transition-all duration-1000 delay-600 ${
                isVisible.video
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }`}
            >
              <h3 className="text-xl font-bold text-white mb-4">
                🔒 Segurança garantida:{" "}
                <span className="font-normal">
                  Seus dados sensíveis são protegidos e utilizados apenas para
                  fins de conexão entre pesquisadores e empresas, em
                  conformidade com a LGPD.
                </span>
              </h3>
              <Image
                src="/images/video.png"
                alt="Logo"
                width={250}
                height={250}
                quality={100}
                priority
                className="drop-shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Integrantes */}
      <section
        id="integrantes"
        className="bg-white py-20 min-h-screen flex items-center"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <h2
            className={`text-3xl font-bold text-center mb-16 text-[#990000] transition-all duration-1000 ${
              isVisible.integrantes
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            Integrantes
          </h2>

          <div
            className={`bg-[#990000] p-8  mb-8 hover:shadow-xl transition-all duration-500 ${
              isVisible.integrantes
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="flex justify-center space-x-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="text-center group">
                  <div className="w-24 h-24 bg-white rounded-full mx-auto mb-2 group-hover:scale-110 transition-transform duration-300"></div>
                  <p className="text-white text-sm">Integrante {i}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-start">
            <div
              className={`max-w-2xl transition-all duration-1000 delay-500 ${
                isVisible.integrantes
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              <p className="text-gray-700 mb-4 mt-10 text-lg font-bold">
                O projeto foi desenvolvido por um grupo de estudantes
                comprometidos em criar soluções inovadoras que conectem a
                pesquisa acadêmica ao mercado. Cada integrante contribuiu com
                suas habilidades para tornar essa plataforma possível.
              </p>
            </div>
            <div
              className={`bg-[#990000] p-8  mb-8 hover:shadow-xl transition-all duration-500 ${
                isVisible.integrantes
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <div className="flex justify-center space-x-8">
                {[1].map((i) => (
                  <div key={i} className="text-center group">
                    <div className="w-24 h-24 bg-white rounded-full mx-auto mb-2 group-hover:scale-110 transition-transform duration-300"></div>
                    <p className="text-white text-sm">Orientador</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section
        id="contato"
        className="bg-gray-50 py-20 min-h-screen flex flex-col justify-between"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <h2
            className={`text-3xl font-bold mb-8 text-[#990000] transition-all duration-1000 ${
              isVisible.contato
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            Contato
          </h2>
          <div className="max-w-2xl mx-auto">
            <p
              className={`text-gray-700 mb-12 transition-all duration-1000 delay-200 ${
                isVisible.contato
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              Tem interesse em conhecer mais sobre o projeto ou falar com a
              nossa equipe? Estamos disponíveis para tirar dúvidas, receber
              sugestões e compartilhar mais detalhes sobre a plataforma.
            </p>

            <div
              className={`flex justify-center transition-all duration-1000 delay-400 ${
                isVisible.contato
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95"
              }`}
            >
              <Image
                src="/images/contato.png"
                alt="Logo"
                width={400}
                height={400}
                quality={100}
                priority
                className="drop-shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer dentro da seção */}
        <div className="bg-[#990000] text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="flex items-center justify-center gap-2 mb-4">
              <span className="text-xl">✉️</span> projetolaverse@gmail.com
            </p>
            <p className="text-sm text-red-200">
              © 2025 Todos os direitos reservados. Este projeto é resultado do
              Trabalho de Conclusão de Curso desenvolvido pelos alunos da
              Universidade Positiva.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
