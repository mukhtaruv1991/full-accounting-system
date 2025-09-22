import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './theme/ThemeProvider';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import SelectCompanyPage from './pages/auth/SelectCompanyPage';
import DashboardPage from './pages/DashboardPage';
import AccountsPage from './pages/AccountsPage';
import CustomersPage from './pages/CustomersPage';
import SuppliersPage from './pages/SuppliersPage';
import ItemsPage from './pages/ItemsPage';
import SalesPage from './pages/SalesPage';
import PurchasesPage from './pages/PurchasesPage';
import JournalEntriesPage from './pages/JournalEntriesPage';
import InvoicePage from './pages/InvoicePage';
import RequestsPage from './pages/admin/RequestsPage'; // Import the new page
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
    <ThemeProvider>
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
              <Route path="admin/requests" element={<RequestsPage />} /> {/* Add the new route */}
              <Route path="settings" element={<SettingsPage />} />
              <Route path="chats" element={<ChatListPage />} />
            <Route path="chat/:conversationId" element={<ChatPage />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
