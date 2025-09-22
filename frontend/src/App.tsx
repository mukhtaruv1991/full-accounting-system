import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppThemeProvider, ThemeContext } from './theme/ThemeProvider';
import {
  AppBar, Toolbar, Typography, Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  IconButton, Tooltip, Select, MenuItem, FormControl
} from '@mui/material';

// Import Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BookIcon from '@mui/icons-material/Book';
import InventoryIcon from '@mui/icons-material/Inventory';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

// Import Pages
import HomePage from './pages/HomePage';
import AccountsPage from './pages/accounts/AccountsPage';
import JournalEntriesPage from './pages/journal-entries/JournalEntriesPage';
import ItemsPage from './pages/items/ItemsPage';
import SalesPage from './pages/sales/SalesPage';
import PurchasesPage from './pages/purchases/PurchasesPage';
import CustomersPage from './pages/customers/CustomersPage';
import SuppliersPage from './pages/suppliers/SuppliersPage';

const drawerWidth = 240;

const navItems = [
  { text: 'dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { text: 'accounts', path: '/accounts', icon: <AccountBalanceWalletIcon /> },
  { text: 'journal_entries', path: '/journal-entries', icon: <BookIcon /> },
  { text: 'items', path: '/items', icon: <InventoryIcon /> },
  { text: 'sales', path: '/sales', icon: <PointOfSaleIcon /> },
  { text: 'purchases', path: '/purchases', icon: <ShoppingCartIcon /> },
  { text: 'customers', path: '/customers', icon: <PeopleIcon /> },
  { text: 'suppliers', path: '/suppliers', icon: <StoreIcon /> },
];

const AppContent: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { mode, toggleTheme } = React.useContext(ThemeContext);

  const handleLanguageChange = (event: any) => {
    i18n.changeLanguage(event.target.value);
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={NavLink} to={item.path} style={({ isActive }) => ({
              backgroundColor: isActive ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
            })}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={t(item.text)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {t('home')}
          </Typography>
          
          <FormControl size="small" sx={{ m: 1, minWidth: 120 }}>
            <Select value={i18n.language} onChange={handleLanguageChange} sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' } }}>
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="ar">العربية</MenuItem>
            </Select>
          </FormControl>

          <Tooltip title="Toggle theme">
            <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {drawer}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/journal-entries" element={<JournalEntriesPage />} />
          <Route path="/items" element={<ItemsPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/purchases" element={<PurchasesPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
        </Routes>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <Router>
      <AppThemeProvider>
        <AppContent />
      </AppThemeProvider>
    </Router>
  );
}

export default App;
