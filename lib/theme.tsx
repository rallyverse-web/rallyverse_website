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
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'color',
  toggleTheme: () => {},
  isColorTheme: true,
});

/** Read initial theme from <html data-theme="…"> already set by inline script. */
function getInitialTheme(): Theme {
  if (typeof document === 'undefined') return 'color';
  const attr = document.documentElement.getAttribute('data-theme');
  return attr === 'bw' ? 'bw' : 'color';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('color');

  useEffect(() => {
    // Sync React state with the data-theme the inline script already set
    const resolved = getInitialTheme();
    setTheme(resolved);
    document.documentElement.setAttribute('data-theme', resolved);
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

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        isColorTheme: theme === 'color',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  return useContext(ThemeContext);
}
