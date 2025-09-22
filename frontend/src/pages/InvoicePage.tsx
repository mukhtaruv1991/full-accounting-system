import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { localApi } from '../api/localApi';
import {
  Box, Typography, Button, Paper, Grid, TextField, Autocomplete,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
  Tabs, Tab, Alert, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';

// --- Interfaces ---
interface Contact { id: string; name: string; }
interface Item { id: string; name: string; price: number; cost: number; quantity: number; }
interface Invoice { id: string; date: string; contactId: string; totalAmount: number; type: InvoiceType; }
interface InvoiceItem { id: string; itemId: string; name: string; quantity: number; price: number; total: number; }
type InvoiceType = 'sale' | 'purchase';

const InvoicePage: React.FC = () => {
  const { t } = useTranslation();
  const [invoiceType, setInvoiceType] = useState<InvoiceType>('sale');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string>('');
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // --- Data Fetching ---
  const fetchContacts = useCallback(async (type: InvoiceType) => {
    try {
      const storeName = type === 'sale' ? 'customers' : 'suppliers';
      const data = await localApi.get(storeName);
      setContacts(data);
    } catch (err: any) { setError(err.message); }
  }, []);

  const fetchItems = useCallback(async () => {
    try {
      const data = await localApi.get('items');
      setItems(data);
    } catch (err: any) { setError(err.message); }
  }, []);

  const fetchInvoices = useCallback(async () => {
    try {
      const salesData = await localApi.get('sales');
      const purchasesData = await localApi.get('purchases');
      setInvoices([...salesData, ...purchasesData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (err: any) { setError(err.message); }
  }, []);

  useEffect(() => {
    fetchContacts(invoiceType);
    fetchItems();
    fetchInvoices();
  }, [invoiceType, fetchContacts, fetchItems, fetchInvoices]);

  // --- Invoice Items Logic ---
  const handleAddItem = (item: Item | null) => {
    if (item && !invoiceItems.find(i => i.itemId === item.id)) {
      const newItem: InvoiceItem = {
        id: uuidv4(),
        itemId: item.id,
        name: item.name,
        quantity: 1,
        price: invoiceType === 'sale' ? item.price : item.cost,
        total: invoiceType === 'sale' ? item.price : item.cost,
      };
      setInvoiceItems([...invoiceItems, newItem]);
    }
  };

  const handleItemChange = (id: string, field: 'quantity' | 'price', value: number) => {
    setInvoiceItems(invoiceItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        updatedItem.total = updatedItem.quantity * updatedItem.price;
        return updatedItem;
      }
      return item;
    }));
  };

  const handleRemoveItem = (id: string) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== id));
  };

  const subtotal = invoiceItems.reduce((acc, item) => acc + item.total, 0);

  const resetForm = () => {
    setSelectedContactId('');
    setInvoiceItems([]);
    setError('');
    setSuccess('');
  };

  // --- Main Save Logic (Placeholder for now) ---
  const handleSaveInvoice = async () => {
    setError('');
    setSuccess('');
    if (!selectedContactId || invoiceItems.length === 0) {
      setError('Please select a contact and add at least one item.');
      return;
    }
    // Logic will be added in the next step
    console.log("Saving Invoice:", {
      type: invoiceType,
      contactId: selectedContactId,
      items: invoiceItems,
      total: subtotal
    });
    setSuccess("Invoice ready to be saved (logic pending).");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>{t('invoices')}</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h5" gutterBottom>{t('new_invoice')}</Typography>
        <Tabs value={invoiceType} onChange={(e, newValue) => { setInvoiceType(newValue); resetForm(); }} sx={{ mb: 2 }}>
          <Tab label={t('sales')} value="sale" />
          <Tab label={t('purchases')} value="purchase" />
        </Tabs>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>{invoiceType === 'sale' ? t('customer') : t('supplier')}</InputLabel>
              <Select
                value={selectedContactId}
                label={invoiceType === 'sale' ? t('customer') : t('supplier')}
                onChange={(e) => setSelectedContactId(e.target.value)}
              >
                {contacts.map((contact) => (
                  <MenuItem key={contact.id} value={contact.id}>{contact.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label={t('date')} type="date" defaultValue={new Date().toISOString().split('T')[0]} fullWidth variant="outlined" InputLabelProps={{ shrink: true }} />
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom>{t('items')}</Typography>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('name')}</TableCell>
                <TableCell align="right">{t('quantity')}</TableCell>
                <TableCell align="right">{t('price')}</TableCell>
                <TableCell align="right">{t('total')}</TableCell>
                <TableCell align="right">{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoiceItems.map((invoiceItem) => (
                <TableRow key={invoiceItem.id}>
                  <TableCell>{invoiceItem.name}</TableCell>
                  <TableCell align="right"><TextField type="number" value={invoiceItem.quantity} onChange={(e) => handleItemChange(invoiceItem.id, 'quantity', parseFloat(e.target.value) || 0)} size="small" sx={{ width: '80px' }} /></TableCell>
                  <TableCell align="right"><TextField type="number" value={invoiceItem.price} onChange={(e) => handleItemChange(invoiceItem.id, 'price', parseFloat(e.target.value) || 0)} size="small" sx={{ width: '100px' }} /></TableCell>
                  <TableCell align="right">{invoiceItem.total.toFixed(2)}</TableCell>
                  <TableCell align="right"><IconButton onClick={() => handleRemoveItem(invoiceItem.id)} color="error"><DeleteIcon /></IconButton></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ my: 2 }}>
          <Autocomplete
            options={items}
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) => handleAddItem(newValue)}
            renderInput={(params) => <TextField {...params} label={t('add_item')} variant="outlined" />}
            value={null}
          />
        </Box>

        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <Typography variant="h6">{t('subtotal')}: {subtotal.toFixed(2)}</Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSaveInvoice}>{t('save_invoice')}</Button>
        </Box>
      </Paper>

      <Typography variant="h5" component="h2" gutterBottom>{t('recent_invoices')}</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('type')}</TableCell>
              <TableCell>{t('date')}</TableCell>
              <TableCell>{t('contact')}</TableCell>
              <TableCell align="right">{t('totalAmount')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell>{t(inv.type)}</TableCell>
                <TableCell>{new Date(inv.date).toLocaleDateString()}</TableCell>
                <TableCell>{contacts.find(c => c.id === inv.contactId)?.name || 'N/A'}</TableCell>
                <TableCell align="right">{inv.totalAmount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InvoicePage;
