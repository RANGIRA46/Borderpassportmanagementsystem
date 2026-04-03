import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "../ui/button";
import { useTranslationWithParams } from "./TranslationUtils";
import { motion } from "motion/react";

type ThemeMode = "light" | "dark" | "system";
type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [theme, setThemeState] = useState<Theme>("light");

  // Initialize theme from localStorage and system preference
  useEffect(() => {
    const savedThemeMode = (localStorage.getItem("border-system-theme-mode") as ThemeMode) || "system";
    setThemeModeState(savedThemeMode);

    // Determine actual theme based on mode
    let actualTheme: Theme = "light";
    if (savedThemeMode === "dark") {
      actualTheme = "dark";
    } else if (savedThemeMode === "system") {
      actualTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    setThemeState(actualTheme);
    applyTheme(actualTheme);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    root.style.transition = "background-color 0.3s ease, color 0.3s ease";

    if (newTheme === "dark") {
      root.classList.remove("light");
      root.classList.add("dark");
      document.body.style.backgroundColor = "#05070A";
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute("content", "#05070A");
      }
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      document.body.style.backgroundColor = "#FFFFFF";
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute("content", "#FFFFFF");
      }
    }
  };

  const toggleTheme = () => {
    setThemeModeState((prev) => {
      const modes: ThemeMode[] = ["system", "dark", "light"];
      const currentIndex = modes.indexOf(prev);
      const nextMode = modes[(currentIndex + 1) % modes.length];
      localStorage.setItem("border-system-theme-mode", nextMode);

      let newTheme: Theme = "light";
      if (nextMode === "dark") {
        newTheme = "dark";
      } else if (nextMode === "system") {
        newTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }

      setThemeState(newTheme);
      applyTheme(newTheme);
      return nextMode;
    });
  };

  const setThemeMode = (newMode: ThemeMode) => {
    setThemeModeState(newMode);
    localStorage.setItem("border-system-theme-mode", newMode);

    let newTheme: Theme = "light";
    if (newMode === "dark") {
      newTheme = "dark";
    } else if (newMode === "system") {
      newTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme, setThemeMode, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Advanced Theme Toggle Button Component
interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
  showTooltip?: boolean;
  expanded?: boolean;
}

export function ThemeToggle({ 
  className = "", 
  variant = "outline",
  size = "sm",
  showLabel = true,
  showTooltip = true,
  expanded = false
}: ThemeToggleProps) {
  const { theme, themeMode, toggleTheme } = useTheme();
  const { t } = useTranslationWithParams();

  const getThemeLabel = () => {
    switch (themeMode) {
      case "dark":
        return t('theme.darkMode', {}, 'Dark');
      case "light":
        return t('theme.lightMode', {}, 'Light');
      case "system":
        return t('theme.systemMode', {}, 'System');
      default:
        return 'Theme';
    }
  };

  const getThemeIcon = () => {
    switch (themeMode) {
      case "dark":
        return <Moon className="h-4 w-4" />;
      case "light":
        return <Sun className="h-4 w-4" />;
      case "system":
        return <Monitor className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  if (expanded) {
    return (
      <div className={`relative ${className}`}>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-blue-light/40 bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2 text-navy-dark">
              <Sun className="h-4 w-4" />
              <span className="text-sm font-medium">{t('theme.lightMode', {}, 'Light Mode')}</span>
            </div>
            <Button
              variant={themeMode === 'light' ? "default" : "outline"}
              size="sm"
              onClick={() => { /* setThemeMode('light'); */ }}
              className="flex items-center gap-2"
            >
              <Sun className="h-4 w-4" />
              <span className="text-sm">{themeMode === 'light' ? t('preferences.active', {}, 'Active') : 'Select'}</span>
            </Button>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-blue-light/40 bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2 text-navy-dark">
              <Moon className="h-4 w-4" />
              <span className="text-sm font-medium">{t('theme.darkMode', {}, 'Dark Mode')}</span>
            </div>
            <Button
              variant={themeMode === 'dark' ? "default" : "outline"}
              size="sm"
              onClick={() => { /* setThemeMode('dark'); */ }}
              className="flex items-center gap-2"
            >
              <Moon className="h-4 w-4" />
              <span className="text-sm">{themeMode === 'dark' ? t('preferences.active', {}, 'Active') : 'Select'}</span>
            </Button>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-blue-light/40 bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2 text-navy-dark">
              <Monitor className="h-4 w-4" />
              <span className="text-sm font-medium">{t('theme.systemMode', {}, 'System Mode')}</span>
            </div>
            <Button
              variant={themeMode === 'system' ? "default" : "outline"}
              size="sm"
              onClick={() => { /* setThemeMode('system'); */ }}
              className="flex items-center gap-2"
            >
              <Monitor className="h-4 w-4" />
              <span className="text-sm">{themeMode === 'system' ? t('preferences.active', {}, 'Active') : 'Select'}</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const label = getThemeLabel();

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant={variant}
        size={size}
        className={`gap-2 relative overflow-hidden group ${className}`}
        title={showTooltip ? label : undefined}
        onClick={toggleTheme}
      >
        <motion.div
          key={themeMode}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="relative z-10"
        >
          {getThemeIcon()}
        </motion.div>

        {showLabel && (
          <motion.span 
            className="hidden md:inline relative z-10"
            key={`label-${themeMode}`}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.span>
        )}
      </Button>
    </motion.div>
  );
}
