import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './components/PrivateRoute';
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
    if (loading) return; // Don't do anything while auth state is loading

    if (user) {
      if (!selectedCompany) {
        // If user is logged in but has no company selected, force to selection page
        if (memberships.length > 0 && location.pathname !== '/select-company') {
          navigate('/select-company', { replace: true });
        }
      } else {
        // If user has a company selected, but is on a public page, redirect to dashboard
        if (['/login', '/register', '/select-company'].includes(location.pathname)) {
          navigate('/dashboard', { replace: true });
        }
      }
    } else {
      // If user is not logged in, they can only be on login or register
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
      <Route path="/select-company" element={<CompanySelectionPage />} />

      {/* All main app routes are now protected by a single PrivateRoute */}
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
    </Routes>
  );
};

// Simplified PrivateRoute
const PrivateRoute: React.FC = () => {
  const { user, selectedCompany, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !selectedCompany) {
    // The logic in AppRouter should prevent this, but as a fallback:
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // This is a placeholder for the nested routes
  const { Outlet } = require('react-router-dom');
  return <Outlet />;
};


function App() {
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
              {/* ... other links */}
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
