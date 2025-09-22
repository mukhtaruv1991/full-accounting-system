import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { localApi } from '../api/localApi';
import { Box, Typography, Grid, Paper } from '@mui/material';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon }) => (
  <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
    {React.cloneElement(icon, { sx: { fontSize: 40, mr: 2, color: 'primary.main' } })}
    <Box>
      <Typography color="text.secondary">{title}</Typography>
      <Typography variant="h5" component="p">{value}</Typography>
    </Box>
  </Paper>
);

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalPurchases: 0,
    customerCount: 0,
    itemCount: 0,
  });
  const [loading, setLoading] = useState(true);

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

        const totalSales = sales.reduce((sum: number, inv: any) => sum + inv.totalAmount, 0);
        const totalPurchases = purchases.reduce((sum: number, inv: any) => sum + inv.totalAmount, 0);

        setSummary({
          totalSales,
          totalPurchases,
          customerCount: customers.length,
          itemCount: items.length,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
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
          <SummaryCard title={t('total_sales')} value={`$${summary.totalSales.toFixed(2)}`} icon={<PointOfSaleIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard title={t('total_purchases')} value={`$${summary.totalPurchases.toFixed(2)}`} icon={<ShoppingCartIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard title={t('customers')} value={summary.customerCount} icon={<PeopleIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard title={t('items')} value={summary.itemCount} icon={<InventoryIcon />} />
        </Grid>
      </Grid>
      {/* Chart and recent activities will be added here in the next steps */}
    </Box>
  );
};

export default DashboardPage;
