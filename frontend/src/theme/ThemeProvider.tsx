import React, { createContext, useState, useMemo, ReactNode, useContext } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { useTranslation } from 'react-i18next';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  toggleColorMode: () => void; // Changed name for clarity
  mode: ThemeMode;
}

// Renamed for clarity to avoid conflict with MUI's ThemeContext
export const AppThemeContext = createContext<ThemeContextType>({
  toggleColorMode: () => {},
  mode: 'light',
});

interface AppThemeProviderProps {
  children: ReactNode;
}

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const { i18n } = useTranslation();

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode],
  );

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

  return (
    <AppThemeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </AppThemeContext.Provider>
  );
};

// This is the custom hook that was missing
export const useColorMode = () => useContext(AppThemeContext);
