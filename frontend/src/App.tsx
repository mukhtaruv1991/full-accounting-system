import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, Typography } from '@mui/material';
import { AppThemeProvider } from './theme/ThemeProvider';
import AppLayout from './components/layout/AppLayout';

// Import all pages
import DashboardPage from './pages/DashboardPage';
import AccountsPage from './pages/AccountsPage';
import CustomersPage from './pages/CustomersPage';
import SuppliersPage from './pages/SuppliersPage';
import ItemsPage from './pages/ItemsPage';
import InvoicePage from './pages/InvoicePage';
import PriceAnalysisPage from './pages/PriceAnalysisPage';

function App() {
  return (
    <AppThemeProvider>
      <CssBaseline />
      <Router>
        <Routes>
          {/* AppLayout is the parent for all main pages */}
          <Route path="/" element={<AppLayout />}>
            {/* The default page shown inside the layout */}
            <Route index element={<DashboardPage />} />
            
            {/* All other pages */}
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="accounts" element={<AccountsPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="suppliers" element={<SuppliersPage />} />
            <Route path="items" element={<ItemsPage />} />
            <Route path="invoices" element={<InvoicePage />} />
            <Route path="price-analysis" element={<PriceAnalysisPage />} />
            
            {/* Fallback for any other route */}
            <Route path="*" element={<Typography>Page Not Found</Typography>} />
          </Route>
        </Routes>
      </Router>
    </AppThemeProvider>
  );
}

export default App;
