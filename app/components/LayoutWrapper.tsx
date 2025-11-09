"use client";
import { ReactNode } from "react";
import MenuLateral from "./MenuLateral";
import { useSidebar } from "../contexts/SidebarContext";

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { isCollapsed, isMobile } = useSidebar();

  const mainMargin = isCollapsed
    ? isMobile
      ? "ml-0"
      : "md:ml-20"
    : "md:ml-64";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex transition-colors duration-300">
      <MenuLateral />
      <main
        className={`flex-1 transition-all duration-300 ${mainMargin} w-full min-h-screen bg-white dark:bg-gray-900`}
      >
        {children}
      </main>
    </div>
  );
}
