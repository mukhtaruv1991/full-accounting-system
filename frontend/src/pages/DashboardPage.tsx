import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { localApi } from '../api/localApi';
import { Box, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, startOfMonth } from 'date-fns';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';

// --- Interfaces ---
interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
}
interface Invoice { id: string; date: string; totalAmount: number; type: 'sale' | 'purchase'; }
interface JournalEntry { id: string; date: string; description: string; amount: number; }
type Activity = (Invoice | JournalEntry) & { activityType: 'Invoice' | 'Journal Entry' };

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon }) => (
  <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', height: '100%' }}>
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
  const [chartData, setChartData] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [sales, purchases, customers, items, journalEntries] = await Promise.all([
          localApi.get('sales'),
          localApi.get('purchases'),
          localApi.get('customers'),
          localApi.get('items'),
          localApi.get('journal_entries'),
        ]);

        // Calculate summaries
        const totalSales = sales.reduce((sum: number, inv: any) => sum + inv.totalAmount, 0);
        const totalPurchases = purchases.reduce((sum: number, inv: any) => sum + inv.totalAmount, 0);
        setSummary({ totalSales, totalPurchases, customerCount: customers.length, itemCount: items.length });

        // Process data for chart
        const monthlyData: { [key: string]: { sales: number; purchases: number } } = {};
        [...sales, ...purchases].forEach((inv: Invoice) => {
          const month = format(startOfMonth(new Date(inv.date)), 'yyyy-MM');
          if (!monthlyData[month]) {
            monthlyData[month] = { sales: 0, purchases: 0 };
          }
          if (inv.type === 'sale') {
            monthlyData[month].sales += inv.totalAmount;
          } else {
            monthlyData[month].purchases += inv.totalAmount;
          }
        });
        const formattedChartData = Object.keys(monthlyData).map(month => ({
          month,
          sales: monthlyData[month].sales,
          purchases: monthlyData[month].purchases,
        })).sort((a, b) => a.month.localeCompare(b.month));
        setChartData(formattedChartData);

        // Process recent activities
        const allActivities: Activity[] = [
          ...sales.map((inv: Invoice) => ({ ...inv, activityType: 'Invoice' as const })),
          ...purchases.map((inv: Invoice) => ({ ...inv, activityType: 'Invoice' as const })),
          ...journalEntries.map((je: JournalEntry) => ({ ...je, activityType: 'Journal Entry' as const, totalAmount: je.amount }))
        ];
        const sortedActivities = allActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setRecentActivities(sortedActivities.slice(0, 5));

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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
        {/* Summary Cards */}
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

        {/* Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom>Monthly Performance</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" name={t('sales')} stroke="#82ca9d" />
                <Line type="monotone" dataKey="purchases" name={t('purchases')} stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom>Recent Activities</Typography>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  {recentActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>
                        <Typography variant="body2">{activity.activityType === 'Invoice' ? (activity as Invoice).type : 'Journal'}</Typography>
                        <Typography variant="caption" color="text.secondary">{format(new Date(activity.date), 'PP')}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="bold">${activity.totalAmount.toFixed(2)}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
