"use client";
import Image from "next/image";
import {
  Target,
  LayoutDashboard,
  Settings,
  LogOut,
  Search,
  Home,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function MenuLateral() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioId");
    localStorage.removeItem("tipo_usuario");
    router.push("/login");
  };

  return (
    <aside className="w-20 bg-white fixed left-0 top-0 h-screen flex flex-col items-center py-4 shadow-md z-40">
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
          className="text-black hover:text-[#990000] transition-colors cursor-pointer"
          onClick={() => router.push("/home")}
          title="Início"
        >
          <Home size={28} />
        </button>
        <button
          className="text-black hover:text-[#990000] transition-colors cursor-pointer"
          onClick={() => router.push("/home")}
          title="Dashboard"
        >
          <LayoutDashboard size={28} />
        </button>

        <hr className="border-gray-300 w-8 mx-auto" />

        <button
          className="text-black hover:text-[#990000] transition-colors cursor-pointer"
          onClick={() => router.push("/configuracoes")}
          title="Configurações"
        >
          <Settings size={28} />
        </button>
        <button
          className="text-black hover:text-[#990000] transition-colors cursor-pointer"
          onClick={handleLogout}
          title="Sair"
        >
          <LogOut size={28} />
        </button>
      </nav>
    </aside>
  );
}
