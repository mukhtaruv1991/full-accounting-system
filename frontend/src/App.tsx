import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppThemeProvider } from './theme/ThemeProvider'; // Corrected import name
import AppLayout from './components/AppLayout'; // Corrected path
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import SelectCompanyPage from './pages/auth/SelectCompanyPage';
import DashboardPage from './pages/DashboardPage';
import AccountsPage from './pages/accounts/AccountsPage'; // Corrected path
import CustomersPage from './pages/customers/CustomersPage'; // Corrected path
import SuppliersPage from './pages/suppliers/SuppliersPage'; // Corrected path
import ItemsPage from './pages/items/ItemsPage'; // Corrected path
import SalesPage from './pages/sales/SalesPage'; // Corrected path
import PurchasesPage from './pages/purchases/PurchasesPage'; // Corrected path
import JournalEntriesPage from './pages/journal-entries/JournalEntriesPage'; // Corrected path
import InvoicePage from './pages/InvoicePage';
import RequestsPage from './pages/admin/RequestsPage';
import SettingsPage from './pages/SettingsPage';
import ChatListPage from './pages/chat/ChatListPage';
import ChatPage from './pages/chat/ChatPage';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, selectedCompany, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!selectedCompany) {
    return <Navigate to="/select-company" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AppThemeProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/select-company" element={<SelectCompanyPage />} />

            <Route path="/" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="accounts" element={<AccountsPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="suppliers" element={<SuppliersPage />} />
              <Route path="items" element={<ItemsPage />} />
              <Route path="sales" element={<SalesPage />} />
              <Route path="purchases" element={<PurchasesPage />} />
              <Route path="invoices/new" element={<InvoicePage />} />
              <Route path="journal-entries" element={<JournalEntriesPage />} />
              <Route path="admin/requests" element={<RequestsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="chats" element={<ChatListPage />} />
              <Route path="chat/:conversationId" element={<ChatPage />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AuthProvider>
      </Router>
    </AppThemeProvider>
  );
}

export default App;
