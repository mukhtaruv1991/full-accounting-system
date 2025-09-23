import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { localApi } from '../api/localApi';
import { Grid, Paper, Typography, Box, CircularProgress, Alert, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BookIcon from '@mui/icons-material/Book';
import { format, parseISO } from 'date-fns';

// --- Interfaces ---
interface SummaryData {
  totalSales: number;
  totalPurchases: number;
  customerCount: number;
  itemCount: number;
  monthlyData: { name: string; sales: number; purchases: number }[];
  recentActivities: any[];
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
        const [sales, purchases, customers, items, journalEntries] = await Promise.all([
          localApi.get('sales'),
          localApi.get('purchases'),
          localApi.get('customers'),
          localApi.get('items'),
          localApi.get('journal_entries'),
        ]);

        const totalSales = sales.reduce((acc: number, sale: any) => acc + sale.total, 0);
        const totalPurchases = purchases.reduce((acc: number, purchase: any) => acc + purchase.total, 0);

        // Process data for the chart
        const monthlyDataMap: { [key: string]: { sales: number; purchases: number } } = {};
        [...sales, ...purchases].forEach((trx: any) => {
          const month = format(parseISO(trx.date), 'MMM');
          if (!monthlyDataMap[month]) {
            monthlyDataMap[month] = { sales: 0, purchases: 0 };
          }
          if (trx.type === 'sale') {
            monthlyDataMap[month].sales += trx.total;
          } else {
            monthlyDataMap[month].purchases += trx.total;
          }
        });
        const monthlyData = Object.keys(monthlyDataMap).map(month => ({
          name: month,
          sales: monthlyDataMap[month].sales,
          purchases: monthlyDataMap[month].purchases,
        }));

        // Get recent activities
        const recentActivities = [...sales, ...purchases, ...journalEntries]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);

        setSummary({
          totalSales,
          totalPurchases,
          customerCount: customers.length,
          itemCount: items.length,
          monthlyData,
          recentActivities,
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
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}><PointOfSaleIcon color="primary" sx={{ fontSize: 40, mr: 2 }} /><Box><Typography color="text.secondary">{t('sales')}</Typography><Typography variant="h5" component="p">${summary?.totalSales.toFixed(2)}</Typography></Box></Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}><ShoppingCartIcon color="secondary" sx={{ fontSize: 40, mr: 2 }} /><Box><Typography color="text.secondary">{t('purchases')}</Typography><Typography variant="h5" component="p">${summary?.totalPurchases.toFixed(2)}</Typography></Box></Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}><PeopleIcon color="success" sx={{ fontSize: 40, mr: 2 }} /><Box><Typography color="text.secondary">{t('customers')}</Typography><Typography variant="h5" component="p">{summary?.customerCount}</Typography></Box></Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}><InventoryIcon color="warning" sx={{ fontSize: 40, mr: 2 }} /><Box><Typography color="text.secondary">{t('items')}</Typography><Typography variant="h5" component="p">{summary?.itemCount}</Typography></Box></Paper>
        </Grid>

        {/* Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>Monthly Performance</Typography>
            <ResponsiveContainer>
              <LineChart data={summary?.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="purchases" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: 300, overflowY: 'auto' }}>
            <Typography variant="h6" gutterBottom>Recent Activities</Typography>
            <List>
              {summary?.recentActivities.map((activity: any) => (
                <React.Fragment key={activity.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar>
                        {activity.type === 'sale' && <PointOfSaleIcon />}
                        {activity.type === 'purchase' && <ShoppingCartIcon />}
                        {!activity.type && <BookIcon />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.description || `${activity.type} invoice`}
                      secondary={`Amount: $${(activity.total || activity.amount).toFixed(2)} - ${format(parseISO(activity.date), 'PP')}`}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
