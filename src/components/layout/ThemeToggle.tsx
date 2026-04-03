import React, { useState, useEffect } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';

type ThemeMode = 'dark' | 'light' | 'system';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const [theme, setTheme] = useState<ThemeMode>('system');
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check system preference or local storage
    const savedTheme = localStorage.getItem('theme') as ThemeMode || 'system';
    setTheme(savedTheme);

    // Determine if should be dark
    let shouldBeDark = true;
    if (savedTheme === 'light') {
      shouldBeDark = false;
    } else if (savedTheme === 'system') {
      shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      shouldBeDark = true;
    }

    setIsDark(shouldBeDark);
    applyTheme(shouldBeDark);
  }, []);

  const applyTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#05070A';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#FFFFFF';
    }
  };

  const cycleTheme = () => {
    let newTheme: ThemeMode;
    
    // Cycle: system -> dark -> light -> system
    if (theme === 'system') {
      newTheme = 'dark';
      setIsDark(true);
      applyTheme(true);
    } else if (theme === 'dark') {
      newTheme = 'light';
      setIsDark(false);
      applyTheme(false);
    } else {
      newTheme = 'system';
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
      applyTheme(prefersDark);
    }

    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const getButtonTitle = () => {
    switch (theme) {
      case 'dark':
        return 'Current: Dark Mode (Click to cycle)';
      case 'light':
        return 'Current: Light Mode (Click to cycle)';
      case 'system':
        return `Current: System Mode (${isDark ? 'Dark' : 'Light'}) (Click to cycle)`;
    }
  };

  const getIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon size={20} color="var(--obsidian-blue)" />;
      case 'light':
        return <Sun size={20} color="#FCD34D" />;
      case 'system':
        return <Monitor size={20} color="var(--obsidian-light-gray)" />;
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className={`
        flex
        items-center
        justify-center
        w-12
        h-12
        rounded-full
        transition-all
        duration-200
        hover:shadow-lg
        active:scale-95
        ${isDark 
          ? 'bg-obsidian-slate border border-obsidian-border hover:border-obsidian-blue hover:bg-obsidian-border' 
          : 'bg-gray-200 border border-gray-300 hover:border-blue-500 hover:bg-gray-300'
        }
        ${className}
      `}
      title={getButtonTitle()}
      style={{
        backgroundColor: isDark ? 'var(--obsidian-slate)' : '#E5E7EB',
        borderColor: isDark ? 'var(--obsidian-border)' : '#D1D5DB',
      }}
    >
      {getIcon()}
    </button>
  );
};

export default ThemeToggle;

