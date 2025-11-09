"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    // Tema padrão é light, só dark se explicitamente salvo como dark
    const shouldBeDark =
      savedTheme === "dark" || (!savedTheme && systemPrefersDark);

    setIsDarkMode(shouldBeDark);

    // Aplicar o tema ao HTML
    const html = document.documentElement;
    if (shouldBeDark) {
      html.classList.add("dark");
      html.style.colorScheme = "dark";
    } else {
      html.classList.remove("dark");
      html.style.colorScheme = "light";
      // Garantir que o tema light seja salvo como padrão se não houver preferência
      if (!savedTheme && !systemPrefersDark) {
        localStorage.setItem("theme", "light");
      }
    }
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

    // Disparar evento para sincronização
    window.dispatchEvent(
      new CustomEvent("themeChanged", {
        detail: { isDark: newDarkMode },
      })
    );
  };

  // Sincronizar tema entre abas
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme") {
        const newTheme = e.newValue;
        const shouldBeDark = newTheme === "dark";

        setIsDarkMode(shouldBeDark);

        const html = document.documentElement;
        if (shouldBeDark) {
          html.classList.add("dark");
          html.style.colorScheme = "dark";
        } else {
          html.classList.remove("dark");
          html.style.colorScheme = "light";
        }
      }
    };

    const handleThemeChanged = (e: CustomEvent) => {
      const { isDark } = e.detail;
      setIsDarkMode(isDark);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "themeChanged",
      handleThemeChanged as EventListener
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "themeChanged",
        handleThemeChanged as EventListener
      );
    };
  }, []);

  // Evitar hidratação incorreta
  if (!mounted) {
    return (
      <div className="bg-white dark:bg-gray-900 min-h-screen">{children}</div>
    );
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
