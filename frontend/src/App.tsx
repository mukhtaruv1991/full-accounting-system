import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
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

const AuthStatus = () => {
  const { logout, user, selectedCompany } = useAuth();
  if (!user) {
    return <div style={{ marginLeft: 'auto' }}>You are not logged in.</div>;
  }
  return (
    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <span>
        {user.email} @ <strong>{selectedCompany?.company.name || 'No Company Selected'}</strong>
      </span>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user, memberships, selectedCompany } = useAuth();

  // If user is logged in but hasn't selected a company and has more than one option
  if (user && !selectedCompany && memberships.length > 1) {
    return <Navigate to="/select-company" replace />;
  }
  
  // If user is logged in and has a selected company, redirect from root to dashboard
  if (user && selectedCompany) {
     const currentPath = window.location.pathname;
     if (currentPath === '/' || currentPath === '/login' || currentPath === '/register') {
        return <Navigate to="/dashboard" replace />;
     }
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/select-company" element={<PrivateRoute><CompanySelectionPage /></PrivateRoute>} />
      <Route path="/" element={<h1>Welcome to the Accounting System</h1>} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/accounts" element={<PrivateRoute><AccountsPage /></PrivateRoute>} />
      <Route path="/journal-entries" element={<PrivateRoute><JournalEntriesPage /></PrivateRoute>} />
      <Route path="/items" element={<PrivateRoute><ItemsPage /></PrivateRoute>} />
      <Route path="/sales" element={<PrivateRoute><SalesPage /></PrivateRoute>} />
      <Route path="/purchases" element={<PrivateRoute><PurchasesPage /></PrivateRoute>} />
      <Route path="/customers" element={<PrivateRoute><CustomersPage /></PrivateRoute>} />
      <Route path="/suppliers" element={<PrivateRoute><SuppliersPage /></PrivateRoute>} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <nav style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ddd' }}>
          <Link to="/" style={{ marginRight: '15px' }}>Home</Link>
          <AuthStatus />
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
            <AppContent />
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
