import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { localApi } from '../api/localApi';
import {
  Box, Typography, Paper, Grid, FormControl, InputLabel, Select, MenuItem,
  TextField, Autocomplete, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

// --- Interfaces ---
interface Item { id: string; name: string; }
interface Contact { id: string; name: string; }
interface Invoice { id: string; date: string; contactId: string; type: 'sale' | 'purchase'; items: { itemId: string; price: number; }[]; }
interface PriceDataPoint { date: string; price: number; contactName: string; }

const PriceAnalysisPage: React.FC = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<Item[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceDataPoint[]>([]);
  const [error, setError] = useState('');

  // Fetch initial data for selectors
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsData, customersData, suppliersData] = await Promise.all([
          localApi.get('items'),
          localApi.get('customers'),
          localApi.get('suppliers'),
        ]);
        setItems(itemsData);
        setContacts([...customersData, ...suppliersData]);
      } catch (err: any) {
        setError('Failed to load initial data.');
      }
    };
    fetchData();
  }, []);

  // Memoized calculation to get price history when selectedItem changes
  const calculatePriceHistory = useMemo(async () => {
    if (!selectedItem) {
      setPriceHistory([]);
      return;
    }
    try {
      const sales: Invoice[] = await localApi.get('sales');
      const purchases: Invoice[] = await localApi.get('purchases');
      const allInvoices = [...sales, ...purchases];

      const history: PriceDataPoint[] = allInvoices
        .flatMap(invoice =>
          invoice.items
            .filter(item => item.itemId === selectedItem.id)
            .map(item => ({
              date: format(new Date(invoice.date), 'yyyy-MM-dd'),
              price: item.price,
              contactName: contacts.find(c => c.id === invoice.contactId)?.name || 'Unknown',
            }))
        )
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setPriceHistory(history);
    } catch (err: any) {
      setError('Failed to calculate price history.');
    }
  }, [selectedItem, contacts]);


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('price_analysis')}
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <Autocomplete
              options={items}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => setSelectedItem(newValue)}
              renderInput={(params) => <TextField {...params} label={t('select_item')} variant="outlined" />}
            />
          </Grid>
        </Grid>
      </Paper>

      {selectedItem && priceHistory.length > 0 && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Price History for: {selectedItem.name}
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="price" stroke="#8884d8" name="Price" />
            </LineChart>
          </ResponsiveContainer>
          <TableContainer sx={{ mt: 4 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('date')}</TableCell>
                  <TableCell>{t('contact')}</TableCell>
                  <TableCell align="right">{t('price')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {priceHistory.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{entry.contactName}</TableCell>
                    <TableCell align="right">{entry.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      {selectedItem && priceHistory.length === 0 && (
        <Typography sx={{ mt: 2 }}>No price history found for this item.</Typography>
      )}
    </Box>
  );
};

export default PriceAnalysisPage;
