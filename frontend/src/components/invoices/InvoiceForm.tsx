import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, TextField, Button, Grid, Autocomplete, Paper, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { localApi } from '../../api/localApi';

// Interfaces for our data models
interface Item { id: string; name: string; price: number; }
interface Customer { id: string; name: string; }
interface Supplier { id: string; name: string; }
interface InvoiceItem { itemId: string; name: string; quantity: number; price: number; total: number; }

interface InvoiceFormProps {
  invoiceType: 'sale' | 'purchase';
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoiceType }) => {
  // State for data fetched from local DB
  const [items, setItems] = useState<Item[]>([]);
  const [contacts, setContacts] = useState<(Customer | Supplier)[]>([]); // Contacts can be customers or suppliers
  
  // State for the form
  const [selectedContactId, setSelectedContactId] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([{ itemId: '', name: '', quantity: 1, price: 0, total: 0 }]);
  const [error, setError] = useState('');

  // Fetch initial data (items and contacts) from local DB
  const fetchData = useCallback(async () => {
    try {
      const itemsData = await localApi.get('items');
      const contactsData = await localApi.get(invoiceType === 'sale' ? 'customers' : 'suppliers');
      setItems(itemsData);
      setContacts(contactsData);
    } catch (err) {
      setError('Failed to load initial data. Please ensure you have added items and contacts.');
    }
  }, [invoiceType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleItemChange = (index: number, newItem: Item | null) => {
    const updatedItems = [...invoiceItems];
    const price = newItem ? (invoiceType === 'sale' ? newItem.price : 0) : 0; // Use item price for sales
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
    const newValue = value > 0 ? value : 0;
    
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
    setError('');
    if (!selectedContactId || invoiceItems.some(item => !item.itemId)) {
      setError('Please select a contact and ensure all items are selected.');
      return;
    }
    
    const totalAmount = invoiceItems.reduce((sum, item) => sum + item.total, 0);
    const invoiceData = {
      date: invoiceDate,
      totalAmount,
      status: 'Completed',
      items: invoiceItems.map(({ itemId, quantity, price }) => ({ itemId, quantity, price })),
      // Dynamically set customerId or supplierId
      ...(invoiceType === 'sale' ? { customerId: selectedContactId } : { supplierId: selectedContactId }),
    };

    try {
      await localApi.post(invoiceType === 'sale' ? 'sales' : 'purchases', invoiceData);
      alert('Invoice saved successfully!');
      // Reset form or navigate away
    } catch (err) {
      setError('Failed to save the invoice.');
    }
  };

  const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>New {invoiceType === 'sale' ? 'Sales' : 'Purchase'} Invoice</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>{invoiceType === 'sale' ? 'Customer' : 'Supplier'}</InputLabel>
            <Select
              value={selectedContactId}
              label={invoiceType === 'sale' ? 'Customer' : 'Supplier'}
              onChange={(e) => setSelectedContactId(e.target.value)}
            >
              {contacts.map(contact => (
                <MenuItem key={contact.id} value={contact.id}>{contact.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField type="date" label="Date" fullWidth variant="outlined" InputLabelProps={{ shrink: true }} value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} />
        </Grid>
      </Grid>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 200 }}>Item</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoiceItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Autocomplete
                    options={items}
                    getOptionLabel={(option) => option.name}
                    onChange={(e, value) => handleItemChange(index, value)}
                    renderInput={(params) => <TextField {...params} label="Select Item" variant="standard" />}
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
        <Button startIcon={<AddCircleOutlineIcon />} onClick={addItem}>Add Item</Button>
      </Box>

      <Box sx={{ mt: 3, textAlign: 'right' }}>
        <Typography variant="h6">Subtotal: {subtotal.toFixed(2)}</Typography>
        <Typography variant="h5">Total: {subtotal.toFixed(2)}</Typography>
      </Box>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined">Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSave}>Save Invoice</Button>
      </Box>
    </Paper>
  );
};

export default InvoiceForm;
