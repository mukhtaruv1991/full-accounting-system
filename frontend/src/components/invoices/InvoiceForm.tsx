import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, TextField, Button, Grid, Autocomplete, Paper, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { localApi } from '../../api/localApi';

// Interfaces for our data models
interface Item { id: string; name: string; price: number; cost: number; }
interface Contact { id: string; name: string; }
interface InvoiceItem { itemId: string; name: string; quantity: number; price: number; total: number; }

interface InvoiceFormProps {
  invoiceType: 'sale' | 'purchase';
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoiceType }) => {
  const { t } = useTranslation();
  const [items, setItems] = useState<Item[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContactId, setSelectedContactId] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([{ itemId: '', name: '', quantity: 1, price: 0, total: 0 }]);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const itemsData = await localApi.get('items');
      const contactsData = await localApi.get(invoiceType === 'sale' ? 'customers' : 'suppliers');
      setItems(itemsData);
      setContacts(contactsData);
    } catch (err) {
      setError('Failed to load initial data.');
    }
  }, [invoiceType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleItemChange = (index: number, newItem: Item | null) => {
    const updatedItems = [...invoiceItems];
    const price = newItem ? (invoiceType === 'sale' ? newItem.price : newItem.cost) : 0;
    updatedItems[index] = {
      ...updatedItems[index],
      itemId: newItem ? newItem.id : '',
      name: newItem ? newItem.name : '',
      price: price,
      total: price * updatedItems[index].quantity,
    };
    setInvoiceItems(updatedItems);
  };

  const handleFieldChange = (index: number, field: 'quantity' | 'price', value: number) => {
    const updatedItems = [...invoiceItems];
    const item = updatedItems[index];
    const newValue = value >= 0 ? value : 0;
    item[field] = newValue;
    item.total = item.price * item.quantity;
    setInvoiceItems(updatedItems);
  };

  const addItem = () => {
    setInvoiceItems([...invoiceItems, { itemId: '', name: '', quantity: 1, price: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    const updatedItems = invoiceItems.filter((_, i) => i !== index);
    setInvoiceItems(updatedItems);
  };

  const handleSave = async () => {
    // Save logic will be implemented later
    alert('Save functionality is not yet implemented.');
  };

  const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>{t('new_invoice')}</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
        <FormControl fullWidth sx={{ flex: 1 }}>
          <InputLabel>{t(invoiceType === 'sale' ? 'customer' : 'supplier')}</InputLabel>
          <Select
            value={selectedContactId}
            label={t(invoiceType === 'sale' ? 'customer' : 'supplier')}
            onChange={(e) => setSelectedContactId(e.target.value)}
          >
            {contacts.map(contact => (
              <MenuItem key={contact.id} value={contact.id}>{contact.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField sx={{ flex: 1 }} type="date" label={t('date')} fullWidth variant="outlined" InputLabelProps={{ shrink: true }} value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} />
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('items')}</TableCell>
              <TableCell align="right">{t('quantity')}</TableCell>
              <TableCell align="right">{t('price')}</TableCell>
              <TableCell align="right">{t('total')}</TableCell>
              <TableCell align="right">{t('actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoiceItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell sx={{ minWidth: 200 }}>
                  <Autocomplete
                    options={items}
                    getOptionLabel={(option) => option.name}
                    onChange={(e, value) => handleItemChange(index, value)}
                    renderInput={(params) => <TextField {...params} label={t('select_item')} variant="standard" />}
                  />
                </TableCell>
                <TableCell>
                  <TextField type="number" value={item.quantity} onChange={(e) => handleFieldChange(index, 'quantity', parseInt(e.target.value, 10))} variant="standard" inputProps={{ min: 1, style: { textAlign: 'right' } }} />
                </TableCell>
                <TableCell>
                  <TextField type="number" value={item.price} onChange={(e) => handleFieldChange(index, 'price', parseFloat(e.target.value))} variant="standard" inputProps={{ step: "0.01", style: { textAlign: 'right' } }} />
                </TableCell>
                <TableCell align="right">{item.total.toFixed(2)}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => removeItem(index)} color="error"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <Button startIcon={<AddCircleOutlineIcon />} onClick={addItem}>{t('add_item')}</Button>
      </Box>

      <Box sx={{ mt: 3, textAlign: 'right' }}>
        <Typography variant="h6">{t('subtotal')}: {subtotal.toFixed(2)}</Typography>
        <Typography variant="h5">{t('total')}: {subtotal.toFixed(2)}</Typography>
      </Box>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined">{t('cancel')}</Button>
        <Button variant="contained" color="primary" onClick={handleSave}>{t('save_invoice')}</Button>
      </Box>
    </Paper>
  );
};

export default InvoiceForm;
