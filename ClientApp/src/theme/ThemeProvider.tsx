import React, { createContext, useContext, useMemo, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from './muiTheme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    // Check localStorage first
    const stored = localStorage.getItem('theme-mode');
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'dark'; // Default to dark for SaaS look
  });

  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
    // Also update document class for Tailwind compatibility
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const contextValue = useMemo(
    () => ({
      mode,
      toggleTheme,
      setMode,
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
