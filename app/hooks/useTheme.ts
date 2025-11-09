"use client";

import { useTheme as useThemeOriginal } from "../contexts/ThemeProvider";

// Hook wrapper para garantir compatibilidade
export const useTheme = useThemeOriginal;
