import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Grid, Autocomplete, Paper, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

// Dummy data for now
const dummyItems = [
  { id: 'item-1', name: 'Panadol', price: 5.00 },
  { id: 'item-2', name: 'Aspirin', price: 3.50 },
  { id: 'item-3', name: 'Vitamin C', price: 10.00 },
];

const InvoiceForm: React.FC = () => {
  const [invoiceItems, setInvoiceItems] = useState([{ itemId: '', quantity: 1, price: 0, total: 0 }]);

  const handleItemChange = (index: number, newItem: any) => {
    const updatedItems = [...invoiceItems];
    const itemPrice = newItem ? newItem.price : 0;
    updatedItems[index] = {
      ...updatedItems[index],
      itemId: newItem ? newItem.id : '',
      price: itemPrice,
      total: itemPrice * updatedItems[index].quantity,
    };
    setInvoiceItems(updatedItems);
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const updatedItems = [...invoiceItems];
    const newQuantity = quantity > 0 ? quantity : 1;
    updatedItems[index].quantity = newQuantity;
    updatedItems[index].total = updatedItems[index].price * newQuantity;
    setInvoiceItems(updatedItems);
  };

  const addItem = () => {
    setInvoiceItems([...invoiceItems, { itemId: '', quantity: 1, price: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    const updatedItems = invoiceItems.filter((_, i) => i !== index);
    setInvoiceItems(updatedItems);
  };

  const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>New Invoice</Typography>
      
      {/* DEFINITIVE FIX: Using Box with Flexbox instead of Grid */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
        <Box sx={{ flex: 1 }}>
          <TextField label="Customer / Supplier" fullWidth variant="outlined" />
        </Box>
        <Box sx={{ flex: 1 }}>
          <TextField type="date" label="Date" fullWidth variant="outlined" InputLabelProps={{ shrink: true }} defaultValue={new Date().toISOString().split('T')[0]} />
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
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
                    options={dummyItems}
                    getOptionLabel={(option) => option.name}
                    onChange={(e, value) => handleItemChange(index, value)}
                    renderInput={(params) => <TextField {...params} label="Select Item" variant="standard" />}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(index, parseInt(e.target.value, 10))}
                    variant="standard"
                    inputProps={{ min: 1, style: { textAlign: 'right' } }}
                  />
                </TableCell>
                <TableCell align="right">{item.price.toFixed(2)}</TableCell>
                <TableCell align="right">{item.total.toFixed(2)}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => removeItem(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <Button startIcon={<AddCircleOutlineIcon />} onClick={addItem}>
          Add Item
        </Button>
      </Box>

      <Box sx={{ mt: 3, textAlign: 'right' }}>
        <Typography variant="h6">Subtotal: {subtotal.toFixed(2)}</Typography>
        <Typography variant="h5">Total: {subtotal.toFixed(2)}</Typography>
      </Box>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined">Cancel</Button>
        <Button variant="contained" color="primary">Save Invoice</Button>
      </Box>
    </Paper>
  );
};

export default InvoiceForm;
