"use client";
import Image from "next/image";
import {
  Home,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users,
  Bookmark,
  Search,
  Building,
  Moon,
  Sun,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { useSidebar } from "../contexts/SidebarContext";
import { useUser } from "../contexts/UserContext";

// Hook seguro para tema
const useThemeSafe = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    const shouldBeDark = savedTheme === "dark";
    setIsDarkMode(shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    const html = document.documentElement;
    if (newDarkMode) {
      html.classList.add("dark");
      html.style.colorScheme = "dark";
    } else {
      html.classList.remove("dark");
      html.style.colorScheme = "light";
    }

    localStorage.setItem("theme", newDarkMode ? "dark" : "light");

    // Disparar evento para sincronizar com outros componentes
    window.dispatchEvent(
      new CustomEvent("themeChanged", {
        detail: { isDark: newDarkMode },
      })
    );
  };

  return { isDarkMode, toggleTheme, mounted };
};

export default function MenuLateral() {
  const router = useRouter();
  const pathname = usePathname();
  const { isCollapsed, isMobile, toggleSidebar } = useSidebar();
  const { userData, logout } = useUser();
  const { isDarkMode, toggleTheme, mounted } = useThemeSafe();

  // Sincronizar tema quando mudar em outras abas
  useEffect(() => {
    const handleThemeChanged = (e: CustomEvent) => {
      const { isDark } = e.detail;
      // Atualizar o estado local se necessário
      if (isDark !== isDarkMode) {
        toggleTheme(); // Isso vai atualizar o estado
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
  }, [isDarkMode, toggleTheme]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const isProfileActive = () => {
    return (
      pathname.includes("/perfil") ||
      pathname.includes("/telaPerfil") ||
      pathname.includes("/telaEdicao")
    );
  };

  const baseMenuItems = [
    { icon: Home, label: "Início", path: "/home", active: isActive("/home") },
    {
      icon: Search,
      label: "Buscar",
      path: "/buscar",
      active: isActive("/buscar"),
    },
    {
      icon: Users,
      label: "Pesquisadores",
      path: "/pesquisadores",
      active: isActive("/pesquisadores"),
    },
  ];

  const pesquisadorMenuItems = [
    {
      icon: Bookmark,
      label: "Listas",
      path: "/gerenciarListas",
      active: isActive("/gerenciarListas"),
    },
    {
      icon: User,
      label: "Meu Perfil",
      path: "/telaPerfil",
      active: isProfileActive(),
    },
  ];

  const empresaMenuItems = [
    {
      icon: Building,
      label: "Minha Empresa",
      path: "/perfilEmpresa",
      active:
        pathname.includes("/perfilEmpresa") ||
        pathname.includes("/edicaoEmpresa"),
    },
  ];

  const menuItems = [
    ...baseMenuItems,
    ...(userData?.tipo === "empresa" ? empresaMenuItems : pesquisadorMenuItems),
  ];

  const settingsItems = [
    {
      icon: Settings,
      label: "Configurações",
      path: "/configuracoes",
      active: isActive("/configuracoes"),
    },
  ];

  const handleNavigation = (path: string) => {
    const validPaths = [
      "/home",
      "/buscar",
      "/pesquisadores",
      "/gerenciarListas",
      "/telaPerfil",
      "/perfilEmpresa",
      "/configuracoes",
    ];

    if (validPaths.includes(path)) {
      router.push(path);
    } else {
      router.push("/home");
    }

    if (isMobile) {
      toggleSidebar();
    }
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  if (!mounted) {
    return (
      <div className="fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 shadow-lg z-40 w-20 md:w-20 flex flex-col border-r border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center justify-center p-4 border-b border-gray-200 dark:border-gray-700 min-h-[73px]">
          <div className="animate-pulse bg-gray-300 dark:bg-gray-600 w-10 h-10 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Sidebar */}
      <div
        className={`
        fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 shadow-lg z-40
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-0 md:w-20" : "w-64"}
        ${isMobile && !isCollapsed ? "w-64" : ""}
        flex flex-col border-r border-gray-200 dark:border-gray-700
        overflow-hidden
      `}
      >
        {/* Header com Logo e Botão de Toggle */}
        <div
          className={`flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 min-h-[73px] ${
            isCollapsed ? "px-2" : ""
          }`}
        >
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-lg font-semibold text-gray-800 dark:text-white">
                LaVerse
              </span>
            </div>
          )}

          {isCollapsed && (
            <div className="flex justify-center w-full">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
            </div>
          )}

          {!isMobile && !isCollapsed && (
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
            >
              <ChevronLeft
                size={16}
                className="text-gray-600 dark:text-gray-300"
              />
            </button>
          )}

          {!isMobile && isCollapsed && (
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors absolute -right-3 top-8 cursor-pointer"
            >
              <ChevronRight
                size={16}
                className="text-gray-600 dark:text-gray-300"
              />
            </button>
          )}

          {isMobile && !isCollapsed && (
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
            >
              <ChevronLeft
                size={16}
                className="text-gray-600 dark:text-gray-300"
              />
            </button>
          )}
        </div>

        {/* Menu Items Principal */}
        <nav className="flex-1 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center transition-all duration-200
                  ${
                    item.active
                      ? "text-[#990000] dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-r-2 border-[#990000] dark:border-red-400"
                      : "text-gray-600 dark:text-gray-300 hover:text-[#990000] dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }
                  ${
                    isCollapsed
                      ? "justify-center px-2 py-4"
                      : "justify-start px-4 py-3 mb-1"
                  }
                `}
                title={isCollapsed ? item.label : ""}
              >
                <Icon size={24} className="flex-shrink-0" />
                {!isCollapsed && (
                  <span className="ml-3 font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Separador */}
        {!isCollapsed && (
          <div className="px-4 py-2">
            <hr className="border-gray-200 dark:border-gray-700" />
          </div>
        )}

        {/* Menu Items de Configurações e Sair */}
        <div className="mt-auto">
          {/* Toggle de Tema */}
          <button
            onClick={handleThemeToggle}
            className={`
              w-full flex items-center text-gray-600 dark:text-gray-300 
              hover:text-[#990000] dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200
              ${
                isCollapsed
                  ? "justify-center px-2 py-4"
                  : "justify-start px-4 py-3 mb-1"
              }
            `}
            title={
              isCollapsed ? (isDarkMode ? "Modo Claro" : "Modo Escuro") : ""
            }
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            {!isCollapsed && (
              <span className="ml-3 font-medium">
                {isDarkMode ? "Modo Claro" : "Modo Escuro"}
              </span>
            )}
          </button>

          {/* Menu Items de Configurações */}
          <nav className="py-2">
            {settingsItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    w-full flex items-center transition-all duration-200
                    ${
                      item.active
                        ? "text-[#990000] dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-r-2 border-[#990000] dark:border-red-400"
                        : "text-gray-600 dark:text-gray-300 hover:text-[#990000] dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }
                    ${
                      isCollapsed
                        ? "justify-center px-2 py-4"
                        : "justify-start px-4 py-3 mb-1"
                    }
                  `}
                  title={isCollapsed ? item.label : ""}
                >
                  <Icon size={24} className="flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="ml-3 font-medium">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Botão Sair */}
          <div
            className={`border-t border-gray-200 dark:border-gray-700 ${
              isCollapsed ? "p-2" : "p-4"
            }`}
          >
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center text-gray-600 dark:text-gray-300 
                hover:text-[#990000] dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200
                rounded-lg
                ${
                  isCollapsed
                    ? "justify-center px-2 py-4"
                    : "justify-start px-4 py-3"
                }
              `}
              title={isCollapsed ? "Sair" : ""}
            >
              <LogOut size={24} className="flex-shrink-0" />
              {!isCollapsed && <span className="ml-3 font-medium">Sair</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay para mobile quando sidebar está aberta */}
      {!isCollapsed && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden cursor-pointer"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
