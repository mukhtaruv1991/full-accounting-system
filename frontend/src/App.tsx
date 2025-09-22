import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Button } from '@mui/material';
import { lightTheme, darkTheme } from './themes/theme';
import { useTranslation } from 'react-i18next';

// Import pages
import DashboardPage from './pages/DashboardPage';
import AccountsPage from './pages/accounts/AccountsPage';
// ... other page imports

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const { i18n } = useTranslation();

  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    // You might need to update theme direction as well if it doesn't update automatically
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* This resets CSS and applies background colors */}
      <Router>
        <nav style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', backgroundColor: theme.palette.primary.main, color: 'white' }}>
          <Link to="/" style={{ marginRight: '15px', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>
            {i18n.t('accounting_system_title', 'Accounting System')}
          </Link>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
            <Button variant="contained" onClick={toggleTheme}>
              {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
            </Button>
            <Button variant="contained" onClick={toggleLanguage}>
              {i18n.language === 'ar' ? 'English' : 'العربية'}
            </Button>
          </div>
        </nav>
        <div className="container" style={{ display: 'flex', marginTop: '20px' }}>
          <aside style={{ width: '20%', paddingRight: '20px', borderRight: `1px solid ${theme.palette.divider}` }}>
            <h3>{i18n.t('navigation', 'Navigation')}</h3>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              <li><Link to="/">{i18n.t('dashboard_title')}</Link></li>
              <li><Link to="/accounts">{i18n.t('accounts_title')}</Link></li>
              {/* ... other links */}
            </ul>
          </aside>
          <main style={{ flexGrow: 1, paddingLeft: '20px' }}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/accounts" element={<AccountsPage />} />
              {/* ... other routes */}
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
