import React, { createContext, useState, useMemo, ReactNode } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { useTranslation } from 'react-i18next';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  toggleTheme: () => void;
  mode: ThemeMode;
}

export const ThemeContext = createContext<ThemeContextType>({
  toggleTheme: () => {},
  mode: 'light',
});

interface AppThemeProviderProps {
  children: ReactNode;
}

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const { i18n } = useTranslation();

  const theme = useMemo(() => createTheme({
    direction: i18n.dir(),
    palette: {
      mode,
    },
    typography: {
      fontFamily: "'Cairo', sans-serif",
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      button: {
        fontWeight: 700,
        textTransform: 'none',
      }
    },
  }), [mode, i18n.dir()]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
