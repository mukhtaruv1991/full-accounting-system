import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, Typography, CircularProgress } from '@mui/material';
import { AppThemeProvider } from './theme/ThemeProvider';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CompanySelectionPage from './pages/CompanySelectionPage';
import DashboardPage from './pages/DashboardPage';
import AccountsPage from './pages/AccountsPage';
import CustomersPage from './pages/CustomersPage';
import SuppliersPage from './pages/SuppliersPage';
import ItemsPage from './pages/ItemsPage';
import InvoicePage from './pages/InvoicePage';
import PriceAnalysisPage from './pages/PriceAnalysisPage';

const AppRoutes: React.FC = () => {
  const { user, selectedCompany, loading, userMemberships } = useAuth();

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }

  if (user && !selectedCompany) {
    // If user is logged in but hasn't selected a company, show selection page
    return <CompanySelectionPage />;
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
      
      {/* Protected Routes */}
      <Route path="/" element={user && selectedCompany ? <AppLayout /> : <Navigate to="/login" />}>
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="accounts" element={<AccountsPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="suppliers" element={<SuppliersPage />} />
        <Route path="items" element={<ItemsPage />} />
        <Route path="invoices" element={<InvoicePage />} />
        <Route path="price-analysis" element={<PriceAnalysisPage />} />
        <Route path="*" element={<Typography>Page Not Found</Typography>} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AppThemeProvider>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </AppThemeProvider>
  );
}

export default App;
