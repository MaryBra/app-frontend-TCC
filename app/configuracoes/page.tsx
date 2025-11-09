"use client";

import LayoutWrapper from "../components/LayoutWrapper";
import { useState, useEffect } from "react";

export default function Configuracoes() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificacoes, setNotificacoes] = useState(true);
  const [emailMarketing, setEmailMarketing] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 🔥 ADICIONE ESTE USEEFFECT
  useEffect(() => {
    const html = document.documentElement;
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      html.classList.add("dark");
      html.style.colorScheme = "dark";
      document.body.style.backgroundColor = "#111827";
      setIsDarkMode(true);
    } else {
      html.classList.remove("dark");
      html.style.colorScheme = "light";
      document.body.style.backgroundColor = "#ffffff";
      setIsDarkMode(false);
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    const html = document.documentElement;
    if (newDarkMode) {
      html.classList.add("dark");
      html.style.colorScheme = "dark";
      document.body.style.backgroundColor = "#111827";
    } else {
      html.classList.remove("dark");
      html.style.colorScheme = "light";
      document.body.style.backgroundColor = "#ffffff";
    }

    localStorage.setItem("theme", newDarkMode ? "dark" : "light");

    // Disparar evento para sincronizar com outros componentes
    window.dispatchEvent(
      new CustomEvent("themeChanged", {
        detail: { isDark: newDarkMode },
      })
    );
  };

  // Sincronizar tema quando mudar em outras abas
  useEffect(() => {
    const handleThemeChanged = (e: CustomEvent) => {
      const { isDark } = e.detail;
      if (isDark !== isDarkMode) {
        setIsDarkMode(isDark);
      }
    };

    window.addEventListener(
      "themeChanged",
      handleThemeChanged as EventListener
    );

    return () => {
      window.removeEventListener(
        "themeChanged",
        handleThemeChanged as EventListener
      );
    };
  }, [isDarkMode]);

  if (!mounted) {
    return (
      <LayoutWrapper>
        <div className="p-4 md:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <div className="p-4 md:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-[#990000] dark:text-red-400 mb-6">
            Configurações
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
            <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Aparência
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    Modo Escuro
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Alterne entre modo claro e escuro
                  </p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isDarkMode ? "bg-[#990000]" : "bg-gray-300"
                  } cursor-pointer`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isDarkMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Notificações
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                      Notificações do sistema
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receba alertas sobre novas mensagens e atualizações
                    </p>
                  </div>
                  <button
                    onClick={() => setNotificacoes(!notificacoes)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notificacoes ? "bg-[#990000]" : "bg-gray-300"
                    } cursor-pointer`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificacoes ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                      Email marketing
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receba novidades e atualizações por email
                    </p>
                  </div>
                  <button
                    onClick={() => setEmailMarketing(!emailMarketing)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      emailMarketing ? "bg-[#990000]" : "bg-gray-300"
                    } cursor-pointer`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        emailMarketing ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Privacidade
              </h2>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <p className="font-medium text-gray-800 dark:text-white">
                    Exportar meus dados
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Baixe uma cópia dos seus dados pessoais
                  </p>
                </button>

                <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <p className="font-medium text-red-600 dark:text-red-400">
                    Excluir minha conta
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Remover permanentemente sua conta e dados
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
