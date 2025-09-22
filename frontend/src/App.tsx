import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import pages directly
import DashboardPage from './pages/DashboardPage';
import AccountsPage from './pages/accounts/AccountsPage';
import JournalEntriesPage from './pages/journal-entries/JournalEntriesPage';
import ItemsPage from './pages/items/ItemsPage';
import SalesPage from './pages/sales/SalesPage';
import PurchasesPage from './pages/purchases/PurchasesPage';
import CustomersPage from './pages/customers/CustomersPage';
import SuppliersPage from './pages/suppliers/SuppliersPage';
import SettingsPage from './pages/SettingsPage'; // We will create this page

function App() {
  return (
    <Router>
      <nav style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', backgroundColor: '#1e40af', color: 'white' }}>
        <Link to="/" style={{ marginRight: '15px', fontWeight: 'bold', color: 'white' }}>Accounting System</Link>
        <div style={{ marginLeft: 'auto' }}>
          <Link to="/settings" style={{ color: 'white' }}>Settings</Link>
        </div>
      </nav>
      <div className="container" style={{ display: 'flex', marginTop: '20px' }}>
        <aside style={{ width: '20%', paddingRight: '20px', borderRight: '1px solid #eee' }}>
          <h3>Navigation</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li><Link to="/">Dashboard</Link></li>
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
            <Route path="/" element={<DashboardPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/journal-entries" element={<JournalEntriesPage />} />
            <Route path="/items" element={<ItemsPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/purchases" element={<PurchasesPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
