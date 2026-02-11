import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Theme } from "@/types";

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme, event?: React.MouseEvent) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeProviderState>({
  theme: "system",
  setTheme: () => null,
  resolvedTheme: "light",
});

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem("projex-theme") as Theme) || "system";
  });

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem("projex-theme") as Theme | null;
    const current = stored || "system";
    return current === "system" ? getSystemTheme() : current;
  });

  const applyTheme = useCallback((newTheme: Theme) => {
    const root = document.documentElement;
    const resolved = newTheme === "system" ? getSystemTheme() : newTheme;

    root.classList.remove("light", "dark");
    root.classList.add(resolved);
    setResolvedTheme(resolved);
  }, []);

  const setTheme = useCallback(
    (newTheme: Theme, event?: React.MouseEvent) => {
      const resolved = newTheme === "system" ? getSystemTheme() : newTheme;

      // Skip transition if the resolved theme is the same
      if (resolved === resolvedTheme) {
        localStorage.setItem("projex-theme", newTheme);
        setThemeState(newTheme);
        return;
      }

      // Get click coordinates for the circular reveal
      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;

      if (event) {
        x = event.clientX;
        y = event.clientY;
      }

      // Calculate the maximum radius needed to cover the full viewport
      const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      // Use View Transitions API if available
      if (document.startViewTransition) {
        document.documentElement.classList.add("theme-transitioning");

        const transition = document.startViewTransition(() => {
          localStorage.setItem("projex-theme", newTheme);
          setThemeState(newTheme);
          applyTheme(newTheme);
        });

        transition.ready.then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${maxRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 500,
              easing: "ease-in-out",
              pseudoElement: "::view-transition-new(root)",
            },
          );
        });

        transition.finished.then(() => {
          document.documentElement.classList.remove("theme-transitioning");
        });
      } else {
        // Fallback for browsers without View Transitions API
        localStorage.setItem("projex-theme", newTheme);
        setThemeState(newTheme);
        applyTheme(newTheme);
      }
    },
    [applyTheme, resolvedTheme],
  );

  // Apply theme on mount (no transition)
  useEffect(() => {
    setTimeout(() => applyTheme(theme), 0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [theme, applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
