import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "../ui/button";
import { useTranslationWithParams } from "./TranslationUtils";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";

type ThemeMode = "light" | "dark" | "auto";
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
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    // Check localStorage for saved theme preference
    const saved = localStorage.getItem("border-system-theme-mode");
    if (saved === "light" || saved === "dark" || saved === "auto") {
      return saved;
    }
    // Default to auto mode
    return "auto";
  });

  const [theme, setThemeState] = useState<Theme>("light");
  const [systemTheme, setSystemTheme] = useState<Theme>("light");

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const updateSystemTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    // Set initial system theme
    updateSystemTheme(mediaQuery);

    // Listen for changes
    mediaQuery.addEventListener("change", updateSystemTheme);

    return () => {
      mediaQuery.removeEventListener("change", updateSystemTheme);
    };
  }, []);

  // Update actual theme based on mode
  useEffect(() => {
    let actualTheme: Theme;
    
    if (themeMode === "auto") {
      actualTheme = systemTheme;
    } else {
      actualTheme = themeMode;
    }
    
    setThemeState(actualTheme);
  }, [themeMode, systemTheme]);

  // Apply theme to document root with smooth transitions
  useEffect(() => {
    const root = document.documentElement;
    
    // Add transition class for smooth theme changes
    root.style.transition = "background-color 0.3s ease, color 0.3s ease";
    
    // Remove both classes first
    root.classList.remove("light", "dark");
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Save mode to localStorage (not the computed theme)
    localStorage.setItem("border-system-theme-mode", themeMode);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", theme === "dark" ? "#121212" : "#f7fafe");
    } else {
      const meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.content = theme === "dark" ? "#121212" : "#f7fafe";
      document.head.appendChild(meta);
    }
  }, [theme, themeMode]);

  // Keyboard shortcut: Ctrl/Cmd + Shift + T
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "T") {
        e.preventDefault();
        const modes: ThemeMode[] = ["light", "dark", "auto"];
        const currentIndex = modes.indexOf(themeMode);
        const nextMode = modes[(currentIndex + 1) % modes.length];
        setThemeModeState(nextMode);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [themeMode]);

  const toggleTheme = () => {
    const modes: ThemeMode[] = ["light", "dark", "auto"];
    const currentIndex = modes.indexOf(themeMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setThemeModeState(nextMode);
  };

  const setThemeMode = (newMode: ThemeMode) => {
    setThemeModeState(newMode);
  };

  const setTheme = (newTheme: Theme) => {
    // When setting theme directly, switch to that specific mode
    setThemeModeState(newTheme);
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
  const { theme, themeMode, toggleTheme, setThemeMode } = useTheme();
  const { t } = useTranslationWithParams();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    toggleTheme();
    
    // Show toast notification
    const modeLabels = {
      light: t('theme.lightMode', {}, 'Light Mode'),
      dark: t('theme.darkMode', {}, 'Dark Mode'),
      auto: t('theme.autoMode', {}, 'Auto Mode')
    };
    
    const modes: ThemeMode[] = ["light", "dark", "auto"];
    const currentIndex = modes.indexOf(themeMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    
    toast.success(t('theme.switched', {}, 'Theme Changed'), {
      description: `${t('theme.nowUsing', {}, 'Now using')} ${modeLabels[nextMode]}`,
      duration: 2000,
    });
  };

  const handleModeSelect = (mode: ThemeMode) => {
    setThemeMode(mode);
    setIsOpen(false);
    
    const modeLabels = {
      light: t('theme.lightMode', {}, 'Light Mode'),
      dark: t('theme.darkMode', {}, 'Dark Mode'),
      auto: t('theme.autoMode', {}, 'Auto Mode')
    };
    
    toast.success(t('theme.switched', {}, 'Theme Changed'), {
      description: `${t('theme.nowUsing', {}, 'Now using')} ${modeLabels[mode]}`,
      duration: 2000,
    });
  };

  if (expanded) {
    // Expanded mode with all three options
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center gap-2 p-1 rounded-lg bg-blue-light/20 dark:bg-white/5 border border-blue-light/30 dark:border-white/10">
          <Button
            variant={themeMode === "light" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleModeSelect("light")}
            className={`flex items-center gap-2 transition-all ${
              themeMode === "light" 
                ? "bg-white dark:bg-blue-500 text-navy-dark dark:text-white shadow-md" 
                : "hover:bg-white/50 dark:hover:bg-white/10"
            }`}
          >
            <Sun className="h-4 w-4" />
            <span className="text-sm">{t('theme.light', {}, 'Light')}</span>
          </Button>
          
          <Button
            variant={themeMode === "dark" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleModeSelect("dark")}
            className={`flex items-center gap-2 transition-all ${
              themeMode === "dark" 
                ? "bg-navy-dark dark:bg-blue-500 text-white shadow-md" 
                : "hover:bg-white/50 dark:hover:bg-white/10"
            }`}
          >
            <Moon className="h-4 w-4" />
            <span className="text-sm">{t('theme.dark', {}, 'Dark')}</span>
          </Button>
          
          <Button
            variant={themeMode === "auto" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleModeSelect("auto")}
            className={`flex items-center gap-2 transition-all ${
              themeMode === "auto" 
                ? "bg-blue-medium dark:bg-blue-500 text-white shadow-md" 
                : "hover:bg-white/50 dark:hover:bg-white/10"
            }`}
          >
            <Monitor className="h-4 w-4" />
            <span className="text-sm">{t('theme.auto', {}, 'Auto')}</span>
          </Button>
        </div>
        
        {themeMode === "auto" && (
          <p className="text-xs text-navy-medium/60 dark:text-white/40 mt-1 text-center">
            {t('theme.followingSystem', {}, 'Following system')} ({theme === "dark" ? t('theme.dark', {}, 'Dark') : t('theme.light', {}, 'Light')})
          </p>
        )}
      </div>
    );
  }

  // Compact toggle button
  const getIcon = () => {
    switch (themeMode) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      case "auto":
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getLabel = () => {
    switch (themeMode) {
      case "light":
        return t('theme.lightMode', {}, 'Light');
      case "dark":
        return t('theme.darkMode', {}, 'Dark');
      case "auto":
        return t('theme.autoMode', {}, 'Auto');
    }
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant={variant}
        size={size}
        onClick={handleToggle}
        className={`gap-2 relative overflow-hidden group ${className}`}
        title={`${getLabel()} (Ctrl+Shift+T)`}
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        <motion.div
          key={themeMode}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 180, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          {getIcon()}
        </motion.div>
        
        {showLabel && (
          <motion.span 
            className="hidden md:inline relative z-10"
            key={`label-${themeMode}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {getLabel()}
          </motion.span>
        )}
      </Button>
    </motion.div>
  );
}