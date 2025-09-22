import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './components/PrivateRoute'; // We import it from its file
import { AuthProvider, useAuth } from './context/AuthContext';
import CompanySelectionPage from './pages/CompanySelectionPage';

// Import financial module pages
import AccountsPage from './pages/accounts/AccountsPage';
import JournalEntriesPage from './pages/journal-entries/JournalEntriesPage';
import ItemsPage from './pages/items/ItemsPage';
import SalesPage from './pages/sales/SalesPage';
import PurchasesPage from './pages/purchases/PurchasesPage';
import CustomersPage from './pages/customers/CustomersPage';
import SuppliersPage from './pages/suppliers/SuppliersPage';

const AuthNav: React.FC = () => {
  const { user, logout, selectedCompany } = useAuth();

  if (!user) {
    return (
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    );
  }
  return (
    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <span>
        {user.email} @ <strong>{selectedCompany?.company.name || '...'}</strong>
      </span>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

// This component will handle all the routing logic
const AppRouter: React.FC = () => {
  const { user, memberships, selectedCompany, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    if (user) {
      if (!selectedCompany) {
        if (memberships.length > 0 && location.pathname !== '/select-company') {
          navigate('/select-company', { replace: true });
        }
      } else {
        if (['/login', '/register', '/select-company'].includes(location.pathname)) {
          navigate('/dashboard', { replace: true });
        }
      }
    } else {
      if (!['/login', '/register'].includes(location.pathname)) {
        navigate('/login', { replace: true });
      }
    }
  }, [user, selectedCompany, memberships, loading, navigate, location.pathname]);

  if (loading) {
    return <div>Loading Application...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* This route is now correctly handled by the PrivateRoute component */}
      <Route path="/select-company" element={<PrivateRoute><CompanySelectionPage /></PrivateRoute>} />

      {/* All main app routes are protected */}
      <Route path="/" element={<PrivateRoute />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="accounts" element={<AccountsPage />} />
        <Route path="journal-entries" element={<JournalEntriesPage />} />
        <Route path="items" element={<ItemsPage />} />
        <Route path="sales" element={<SalesPage />} />
        <Route path="purchases" element={<PurchasesPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="suppliers" element={<SuppliersPage />} />
      </Route>
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
    </Routes>
  );
};

// The simplified PrivateRoute is now only in its own file.
// We use Outlet for nested routes.
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <nav style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ddd' }}>
          <Link to="/" style={{ marginRight: '15px', fontWeight: 'bold' }}>Accounting System</Link>
          <AuthNav />
        </nav>
        <div className="container" style={{ display: 'flex', marginTop: '20px' }}>
          <aside style={{ width: '20%', paddingRight: '20px', borderRight: '1px solid #eee' }}>
            <h3>Navigation</h3>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/accounts">Accounts</Link></li>
              <li><Link to="/journal-entries">Journal Entries</Link></li>
              <li><Link to="/items">Items</Link></li>
              <li><Link to="/sales">Sales</Link></li>
              <li><Link to="/purchases">Purchases</Link></li>
              <li><Link to="/customers">Customers</Link></li>
              <li><Link to="/suppliers">Suppliers</Link></li>
            </ul>
          </aside>
          <main style={{ flexGrow: 1, paddingLeft: '20px' }}>
            <AppRouter />
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
