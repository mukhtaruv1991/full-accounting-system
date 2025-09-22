import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { AppThemeProvider } from './theme/ThemeProvider';
import AppLayout from './components/layout/AppLayout';
import AccountsPage from './pages/AccountsPage';
import CustomersPage from './pages/CustomersPage';
import SuppliersPage from './pages/SuppliersPage';
import ItemsPage from './pages/ItemsPage';
import InvoicePage from './pages/InvoicePage';
import PriceAnalysisPage from './pages/PriceAnalysisPage'; // Import the new page

function App() {
  return (
    <AppThemeProvider>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Typography>Welcome to your Dashboard!</Typography>} />
            <Route path="accounts" element={<AccountsPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="suppliers" element={<SuppliersPage />} />
            <Route path="items" element={<ItemsPage />} />
            <Route path="invoices" element={<InvoicePage />} />
            <Route path="price-analysis" element={<PriceAnalysisPage />} /> {/* Add the new route */}
            {/* Other main routes will go here */}
          </Route>
        </Routes>
      </Router>
    </AppThemeProvider>
  );
}

export default App;
