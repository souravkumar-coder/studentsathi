import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Appearance, View, useColorScheme as useSystemColorScheme } from "react-native";
import { colorScheme as nativewindColorScheme, vars } from "nativewind";

import { SchemeColors, type ColorScheme } from "@/constants/theme";

type ThemeContextValue = {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleTheme: () => void;  // ✅ ADDED
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme() ?? "light";
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(systemScheme);

  const applyScheme = useCallback((scheme: ColorScheme) => {
    // NativeWind
    nativewindColorScheme.set(scheme);
    
    // React Native Appearance
    if (Appearance.setColorScheme) {
      Appearance.setColorScheme(scheme);
    }
    
    // ✅ WEB: document.documentElement par class aur dataset set karo
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      
      // Class toggle for CSS
      root.classList.remove("light", "dark");
      root.classList.add(scheme);
      
      // Dataset theme
      root.dataset.theme = scheme;
      
      // ✅ CSS Variables apply karo
      const palette = SchemeColors[scheme];
      Object.entries(palette).forEach(([token, value]) => {
        root.style.setProperty(`--color-${token}`, value);
      });
      
      // ✅ Background color set karo body par
      document.body.style.backgroundColor = palette.background;
      document.body.style.color = palette.foreground;
      
      // ✅ Meta theme color (mobile browsers)
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute('content', palette.primary);
      }
    }
  }, []);

  const setColorScheme = useCallback((scheme: ColorScheme) => {
    setColorSchemeState(scheme);
    applyScheme(scheme);
  }, [applyScheme]);

  // ✅ Toggle function
  const toggleTheme = useCallback(() => {
    setColorScheme(colorScheme === "light" ? "dark" : "light");
  }, [colorScheme, setColorScheme]);

  useEffect(() => {
    applyScheme(colorScheme);
  }, [applyScheme, colorScheme]);

  // ✅ System theme change listen karo
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme: newScheme }) => {
      if (newScheme) {
        setColorSchemeState(newScheme);
        applyScheme(newScheme);
      }
    });
    return () => subscription.remove();
  }, [applyScheme]);

  const themeVariables = useMemo(
    () =>
      vars({
        "color-primary": SchemeColors[colorScheme].primary,
        "color-background": SchemeColors[colorScheme].background,
        "color-surface": SchemeColors[colorScheme].surface,
        "color-foreground": SchemeColors[colorScheme].foreground,
        "color-muted": SchemeColors[colorScheme].muted,
        "color-border": SchemeColors[colorScheme].border,
        "color-success": SchemeColors[colorScheme].success,
        "color-warning": SchemeColors[colorScheme].warning,
        "color-error": SchemeColors[colorScheme].error,
      }),
    [colorScheme],
  );

  const value = useMemo(
    () => ({
      colorScheme,
      setColorScheme,
      toggleTheme,  // ✅ ADDED
    }),
    [colorScheme, setColorScheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <View style={[{ flex: 1 }, themeVariables]}>{children}</View>
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return ctx;
}