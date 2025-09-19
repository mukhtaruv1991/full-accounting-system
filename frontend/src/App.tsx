import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider, useAuth } from './context/AuthContext'; // التأكد من استيراد useAuth

// استيراد صفحات الوحدات المالية الجديدة
import AccountsPage from './pages/accounts/AccountsPage';
import JournalEntriesPage from './pages/journal-entries/JournalEntriesPage';
import ItemsPage from './pages/items/ItemsPage';
import SalesPage from './pages/sales/SalesPage';
import PurchasesPage from './pages/purchases/PurchasesPage'; // تم إصلاح المسار والملف
import CustomersPage from './pages/customers/CustomersPage';
import SuppliersPage from './pages/suppliers/SuppliersPage';


const AuthStatus = () => {
  const { logout, user } = useAuth();
  return user ? (
    <div style={{ marginLeft: 'auto' }}>
      Welcome, {user.email}! <button onClick={logout}>Logout</button>
    </div>
  ) : (
    <div style={{ marginLeft: 'auto' }}>You are not logged in.</div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <nav style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ddd' }}>
          <Link to="/" style={{ marginRight: '15px' }}>Home</Link>
          <Link to="/login" style={{ marginRight: '15px' }}>Login</Link>
          <Link to="/register" style={{ marginRight: '15px' }}>Register</Link>
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
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<h1>Welcome to the Accounting System</h1>} />

              {/* المسارات المحمية */}
              <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
              <Route path="/accounts" element={<PrivateRoute><AccountsPage /></PrivateRoute>} />
              <Route path="/journal-entries" element={<PrivateRoute><JournalEntriesPage /></PrivateRoute>} />
              <Route path="/items" element={<PrivateRoute><ItemsPage /></PrivateRoute>} />
              <Route path="/sales" element={<PrivateRoute><SalesPage /></PrivateRoute>} />
              <Route path="/purchases" element={<PrivateRoute><PurchasesPage /></PrivateRoute>} />
              <Route path="/customers" element={<PrivateRoute><CustomersPage /></PrivateRoute>} />
              <Route path="/suppliers" element={<PrivateRoute><SuppliersPage /></PrivateRoute>} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
