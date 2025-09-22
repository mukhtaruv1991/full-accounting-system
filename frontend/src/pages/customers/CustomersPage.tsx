import React, { useEffect, useState, useCallback } from 'react';
import { localApi } from '../../api/localApi';
import CustomerForm from '../../components/customers/CustomerForm';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface Customer {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
}

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [error, setError] = useState('');

  const fetchCustomers = useCallback(async () => {
    try {
      const data = await localApi.get('customers');
      setCustomers(data);
    } catch (err: any) {
      setError('Failed to load customers.');
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSave = async (customerData: Omit<Customer, 'id'>) => {
    try {
      if (editingCustomer) {
        await localApi.put('customers', editingCustomer.id, customerData);
      } else {
        await localApi.post('customers', customerData);
      }
      setIsFormVisible(false);
      fetchCustomers();
    } catch (err: any) {
      setError('Failed to save customer.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      try {
        await localApi.delete('customers', id);
        fetchCustomers();
      } catch (err: any) {
        setError('Failed to delete customer.');
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Customers Management
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!isFormVisible && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => { setEditingCustomer(null); setIsFormVisible(true); }}
          sx={{ mb: 2 }}
        >
          Add New Customer
        </Button>
      )}
      {isFormVisible && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</Typography>
          <CustomerForm customer={editingCustomer} onSave={handleSave} onCancel={() => setIsFormVisible(false)} />
        </Paper>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email || 'N/A'}</TableCell>
                <TableCell>{customer.phone || 'N/A'}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => { setEditingCustomer(customer); setIsFormVisible(true); }} color="primary"><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(customer.id)} color="error"><DeleteIcon /></IconButton>
                </TableCell>
              </tr>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CustomersPage;
