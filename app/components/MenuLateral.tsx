"use client"; // se estiver no app router
import Image from "next/image";
import { Target, LayoutDashboard, Settings, LogOut } from "lucide-react";

export default function MenuLateral() {
  return (
    <aside className="w-20 bg-white fixed left-0 top-0 h-screen flex flex-col items-center py-4 shadow-md">
      {/* Logo */}
      <div className="mb-10">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={50}
          height={50}
          quality={100}
          priority
        />
      </div>

      {/* Ícones do Menu */}
      <nav className="flex flex-col gap-6 mt-auto mb-4">
        <button className="text-black hover:text-gray-600">
          <Target size={28} />
        </button>
        <button className="text-black hover:text-gray-600">
          <LayoutDashboard size={28} />
        </button>

        <hr className="border-gray-300 w-8 mx-auto" />

        <button className="text-black hover:text-gray-600">
          <Settings size={28} />
        </button>
        <button className="text-black hover:text-gray-600">
          <LogOut size={28} />
        </button>
      </nav>
    </aside>
  );
}
