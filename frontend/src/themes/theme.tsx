import { createTheme, ThemeOptions } from '@mui/material/styles';

// Define the light theme options
const lightThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#1e40af', // Blue-900
    },
    secondary: {
      main: '#1d4ed8', // Blue-700
    },
    background: {
      default: '#f4f4f4',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Tajawal", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  direction: 'rtl', // Default to RTL for Arabic
};

// Define the dark theme options
const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#60a5fa', // Blue-400
    },
    secondary: {
      main: '#3b82f6', // Blue-500
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Tajawal", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  direction: 'rtl',
};

export const lightTheme = createTheme(lightThemeOptions);
export const darkTheme = createTheme(darkThemeOptions);
