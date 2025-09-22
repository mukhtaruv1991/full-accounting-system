import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { localApi } from '../api/localApi';
import { Grid, Paper, Typography, Box, CircularProgress, Alert } from '@mui/material';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';

interface SummaryData {
  totalSales: number;
  totalPurchases: number;
  customerCount: number;
  itemCount: number;
}

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        setLoading(true);
        const [sales, purchases, customers, items] = await Promise.all([
          localApi.get('sales'),
          localApi.get('purchases'),
          localApi.get('customers'),
          localApi.get('items'),
        ]);

        const totalSales = sales.reduce((acc: number, sale: any) => acc + sale.total, 0);
        const totalPurchases = purchases.reduce((acc: number, purchase: any) => acc + purchase.total, 0);

        setSummary({
          totalSales,
          totalPurchases,
          customerCount: customers.length,
          itemCount: items.length,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>{t('dashboard')}</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <PointOfSaleIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography color="text.secondary">{t('sales')}</Typography>
              <Typography variant="h5" component="p">${summary?.totalSales.toFixed(2)}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <ShoppingCartIcon color="secondary" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography color="text.secondary">{t('purchases')}</Typography>
              <Typography variant="h5" component="p">${summary?.totalPurchases.toFixed(2)}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <PeopleIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography color="text.secondary">{t('customers')}</Typography>
              <Typography variant="h5" component="p">{summary?.customerCount}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <InventoryIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography color="text.secondary">{t('items')}</Typography>
              <Typography variant="h5" component="p">{summary?.itemCount}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {/* Chart and recent activities will be added here in the next step */}
    </Box>
  );
};

export default DashboardPage;
