"use client";
import { useState } from "react";
import Image from "next/image";
import { LayoutDashboard, Settings, LogOut, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import ModalConfiguracoes from "./ModalConfiguracoes";

export default function MenuLateral() {
  const router = useRouter();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioId");
    localStorage.removeItem("tipo_usuario");
    router.push("/login");
  };

  return (
    <>
      <aside className="w-20 bg-white dark:bg-gray-800 fixed left-0 top-0 h-screen flex flex-col items-center py-4 shadow-md z-40 transition-colors duration-300">
        {/* Logo */}
        <div className="mb-10 cursor-pointer">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={50}
            height={50}
            quality={100}
            priority
            onClick={() => router.push("/home")}
            className="hover:scale-105 transition-transform duration-200"
          />
        </div>

        {/* Ícones do Menu */}
        <nav className="flex flex-col gap-6 mt-auto mb-4">
          <button
            className="text-gray-800 dark:text-gray-300 hover:text-custom-red dark:hover:text-red-400 transition-colors cursor-pointer"
            onClick={() => router.push("/home")}
            title="Início"
          >
            <Home size={28} />
          </button>
          <button
            className="text-gray-800 dark:text-gray-300 hover:text-custom-red dark:hover:text-red-400 transition-colors cursor-pointer"
            onClick={() => router.push("/home")}
            title="Dashboard"
          >
            <LayoutDashboard size={28} />
          </button>

          <hr className="border-gray-300 dark:border-gray-600 w-8 mx-auto" />

          <button
            className="text-gray-800 dark:text-gray-300 hover:text-custom-red dark:hover:text-red-400 transition-colors cursor-pointer"
            onClick={() => setIsSettingsOpen(true)}
            title="Configurações"
          >
            <Settings size={28} />
          </button>
          <button
            className="text-gray-800 dark:text-gray-300 hover:text-custom-red dark:hover:text-red-400 transition-colors cursor-pointer"
            onClick={handleLogout}
            title="Sair"
          >
            <LogOut size={28} />
          </button>
        </nav>
      </aside>

      <ModalConfiguracoes
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
