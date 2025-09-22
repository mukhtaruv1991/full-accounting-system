import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Grid } from '@mui/material';
import StatCard from '../components/dashboard/StatCard';
import { localApi } from '../api/localApi';

// Import Icons
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import InventoryIcon from '@mui/icons-material/Inventory';

interface Stats {
  accounts: number;
  customers: number;
  suppliers: number;
  items: number;
}

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<Stats>({ accounts: 0, customers: 0, suppliers: 0, items: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [accounts, customers, suppliers, items] = await Promise.all([
          localApi.get('accounts'),
          localApi.get('customers'),
          localApi.get('suppliers'),
          localApi.get('items'),
        ]);
        setStats({
          accounts: accounts.length,
          customers: customers.length,
          suppliers: suppliers.length,
          items: items.length,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <Typography>{t('loading')}...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('dashboard')}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title={t('total_accounts')} value={stats.accounts} icon={<AccountBalanceWalletIcon fontSize="large" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title={t('total_customers')} value={stats.customers} icon={<PeopleIcon fontSize="large" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title={t('total_suppliers')} value={stats.suppliers} icon={<StoreIcon fontSize="large" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title={t('total_items')} value={stats.items} icon={<InventoryIcon fontSize="large" />} />
        </Grid>
      </Grid>
      {/* Future charts and summaries will be added here */}
    </Box>
  );
};

export default HomePage;
