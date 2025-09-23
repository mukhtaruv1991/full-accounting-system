import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Box, IconButton, Tooltip, Menu, MenuItem, useTheme, CssBaseline
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LanguageIcon from '@mui/icons-material/Language';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';
import { useColorMode } from '../theme/ThemeProvider';
import NotificationBell from './notifications/NotificationBell'; // Import the new component

const drawerWidth = 240;

const AppLayout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();
  const theme = useTheme();
  const colorMode = useColorMode();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [langAnchorEl, setLangAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLangMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleLangMenuClose = (lang?: string) => {
    setLangAnchorEl(null);
    if (lang) {
      i18n.changeLanguage(lang);
    }
  };

  const navItems = [
    { text: 'dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { text: 'accounts', path: '/accounts', icon: <AccountBalanceWalletIcon /> },
    { text: 'customers', path: '/customers', icon: <PeopleIcon /> },
    { text: 'suppliers', path: '/suppliers', icon: <StoreIcon /> },
    { text: 'items', path: '/items', icon: <InventoryIcon /> },
    { text: 'invoices', path: '/invoices', icon: <ReceiptIcon /> },
  ];

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={NavLink} to={item.path} style={({ isActive }) => ({ backgroundColor: isActive ? 'rgba(0, 0, 0, 0.08)' : 'transparent' })}>
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
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {t('accounting_system')}
          </Typography>
          
          <NotificationBell /> {/* Add the notification bell here */}

          <Tooltip title={t('change_language')}>
            <IconButton color="inherit" onClick={handleLangMenuOpen}>
              <LanguageIcon />
            </IconButton>
          </Tooltip>
          <Menu anchorEl={langAnchorEl} open={Boolean(langAnchorEl)} onClose={() => handleLangMenuClose()}>
            <MenuItem onClick={() => handleLangMenuClose('en')}>English</MenuItem>
            <MenuItem onClick={() => handleLangMenuClose('ar')}>العربية</MenuItem>
          </Menu>

          <Tooltip title={t('toggle_theme')}>
            <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
              {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>

          <Tooltip title={t('logout')}>
            <IconButton color="inherit" onClick={logout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }}}>
          {drawer}
        </Drawer>
        <Drawer variant="permanent" sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }}} open>
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;
