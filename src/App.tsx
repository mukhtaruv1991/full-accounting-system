import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import { NotificationToast } from './components/notifications/NotificationToast';

import HomePage from './pages/HomePage';
import AccountsPage from './pages/AccountsPage';
import ItemsPage from './pages/items/ItemsPage';
import CustomersPage from './pages/customers/CustomersPage';
import SuppliersPage from './pages/suppliers/SuppliersPage';
import SalesPage from './pages/sales/SalesPage';
import PurchasesPage from './pages/purchases/PurchasesPage';


function App() {
  return (
    <Router>
      <NotificationToast />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="/items" element={<ItemsPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/suppliers" element={<SuppliersPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/purchases" element={<PurchasesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
