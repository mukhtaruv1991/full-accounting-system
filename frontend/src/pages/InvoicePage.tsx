import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { localApi } from '../api/localApi';
import { v4 as uuidv4 } from 'uuid';
import {
  Box, Typography, Paper, Grid, TextField, Button, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Autocomplete, CircularProgress, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { format } from 'date-fns';

// --- Interfaces ---
interface Contact { id: string; name: string; }
interface Item { id: string; name: string; price: number; cost: number; }
interface InvoiceItem {
  id: string;
  itemId: string;
  quantity: number;
  price: number;
  total: number;
}
interface Invoice {
  id: string;
  type: 'sale' | 'purchase';
  date: string;
  contactId: string;
  items: InvoiceItem[];
  subtotal: number;
  total: number;
}

const InvoicePage: React.FC = () => {
  const { t } = useTranslation();
  const [invoiceType, setInvoiceType] = useState<'sale' | 'purchase'>('sale');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [customers, suppliers, itemsData] = await Promise.all([
        localApi.get('customers'),
        localApi.get('suppliers'),
        localApi.get('items'),
      ]);
      setContacts(invoiceType === 'sale' ? customers : suppliers);
      setItems(itemsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [invoiceType]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleAddItem = () => {
    setInvoiceItems([...invoiceItems, { id: uuidv4(), itemId: '', quantity: 1, price: 0, total: 0 }]);
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...invoiceItems];
    const currentItem = newItems[index];
    
    if (field === 'itemId') {
      const selectedItem = items.find(i => i.id === value);
      if (selectedItem) {
        currentItem.itemId = value;
        currentItem.price = invoiceType === 'sale' ? selectedItem.price : selectedItem.cost;
      }
    } else {
      (currentItem as any)[field] = value;
    }
    
    currentItem.total = currentItem.quantity * currentItem.price;
    newItems[index] = currentItem;
    setInvoiceItems(newItems);
  };

  const handleRemoveItem = (id: string) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== id));
  };

  const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);

  const handleSaveInvoice = async () => {
    // Logic to save the invoice will be added in the next step
    console.log({
      type: invoiceType,
      contactId: selectedContact?.id,
      date,
      items: invoiceItems,
      total: subtotal,
    });
    alert('Invoice saved to console! (Backend logic next)');
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>{t('new_invoice')}</Typography>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>{t('type')}</InputLabel>
            <Select value={invoiceType} label={t('type')} onChange={(e) => setInvoiceType(e.target.value as 'sale' | 'purchase')}>
              <MenuItem value="sale">{t('sales')}</MenuItem>
              <MenuItem value="purchase">{t('purchases')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Autocomplete
            options={contacts}
            getOptionLabel={(option) => option.name}
            value={selectedContact}
            onChange={(_, newValue) => setSelectedContact(newValue)}
            renderInput={(params) => <TextField {...params} label={t(invoiceType === 'sale' ? 'customer' : 'supplier')} />}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField type="date" label={t('date')} value={date} onChange={(e) => setDate(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
        </Grid>
      </Grid>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('item')}</TableCell>
              <TableCell align="right">{t('quantity')}</TableCell>
              <TableCell align="right">{t('price')}</TableCell>
              <TableCell align="right">{t('total')}</TableCell>
              <TableCell align="center">{t('actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoiceItems.map((invoiceItem, index) => (
              <TableRow key={invoiceItem.id}>
                <TableCell>
                  <Autocomplete
                    options={items}
                    getOptionLabel={(option) => option.name}
                    value={items.find(i => i.id === invoiceItem.itemId) || null}
                    onChange={(_, newValue) => handleItemChange(index, 'itemId', newValue?.id || '')}
                    renderInput={(params) => <TextField {...params} variant="standard" />}
                  />
                </TableCell>
                <TableCell>
                  <TextField type="number" value={invoiceItem.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} fullWidth variant="standard" inputProps={{ style: { textAlign: 'right' } }} />
                </TableCell>
                <TableCell>
                  <TextField type="number" value={invoiceItem.price} onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)} fullWidth variant="standard" inputProps={{ style: { textAlign: 'right' } }} />
                </TableCell>
                <TableCell align="right">${invoiceItem.total.toFixed(2)}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleRemoveItem(invoiceItem.id)} color="error"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button startIcon={<AddCircleOutlineIcon />} onClick={handleAddItem} sx={{ mt: 2 }}>
        {t('add_item')}
      </Button>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Box sx={{ width: 250 }}>
          <Typography variant="h6">Subtotal: ${subtotal.toFixed(2)}</Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Total: ${subtotal.toFixed(2)}</Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" color="primary" onClick={handleSaveInvoice}>
          {t('save_invoice')}
        </Button>
      </Box>
    </Paper>
  );
};

export default InvoicePage;
