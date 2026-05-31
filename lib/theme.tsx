'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';

type Theme = 'color' | 'bw';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isColorTheme: boolean;
  isBWTheme: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'color',
  toggleTheme: () => {},
  isColorTheme: true,
  isBWTheme: false,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('color');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('rallyverse-theme') as Theme | null;
      const resolved: Theme = saved === 'bw' ? 'bw' : 'color';
      setTheme(resolved);
      document.documentElement.setAttribute('data-theme', resolved);
    } catch {
      document.documentElement.setAttribute('data-theme', 'color');
    }
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === 'color' ? 'bw' : 'color';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('rallyverse-theme', next);
    } catch {
      // localStorage unavailable — silent fail
    }
  };

  if (!mounted) {
    return (
      <div style={{ visibility: 'hidden' }}>
        {children}
      </div>
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        isColorTheme: theme === 'color',
        isBWTheme: theme === 'bw',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  return useContext(ThemeContext);
}
