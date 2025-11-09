import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "./contexts/SidebarContext";
import { UserProvider } from "./contexts/UserContext";
import ThemeProvider from "./contexts/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LaVerse",
  description: "Plataforma de pesquisa unificada",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  
                  // Tema padrão é light - só dark se explicitamente salvo como dark
                  var isDark = savedTheme === 'dark';
                  
                  // Se não tem tema salvo, usar preferência do sistema
                  if (!savedTheme && systemPrefersDark) {
                    isDark = true;
                    localStorage.setItem('theme', 'dark');
                  } else if (!savedTheme) {
                    isDark = false;
                    localStorage.setItem('theme', 'light');
                  }
                  
                  // Aplicar tema imediatamente
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                    document.body.classList.add('dark');
                    document.body.style.backgroundColor = '#111827';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                    document.body.classList.remove('dark');
                    document.body.style.backgroundColor = '#ffffff';
                  }
                  
                  // Forçar repaint para garantir que as cores sejam aplicadas
                  document.body.style.display = 'none';
                  document.body.offsetHeight; // Trigger reflow
                  document.body.style.display = '';
                } catch (e) {
                  console.log('Erro ao aplicar tema:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <UserProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
