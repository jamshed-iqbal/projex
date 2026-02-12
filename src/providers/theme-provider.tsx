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
  toggleTheme: (event?: React.MouseEvent) => void;
}

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

const ThemeContext = createContext<ThemeProviderState>({
  theme: "light",
  setTheme: () => null,
  toggleTheme: () => null,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    return (localStorage.getItem("projex-theme") as Theme) || getSystemTheme();
  });

  const applyTheme = useCallback((newTheme: Theme) => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(newTheme);
  }, []);

  const setTheme = useCallback(
    (newTheme: Theme, event?: React.MouseEvent) => {
      // Skip transition if the theme is the same
      if (newTheme === theme) return;

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
    [applyTheme, theme],
  );

  const toggleTheme = useCallback(
    (event?: React.MouseEvent) => {
      setTheme(theme === "dark" ? "light" : "dark", event);
    },
    [theme, setTheme],
  );

  // Apply theme on mount (no transition)
  useEffect(() => {
    setTimeout(() => applyTheme(theme), 0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
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
