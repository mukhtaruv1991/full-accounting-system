import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { localApi } from '../../api/localApi';
import CustomerForm from '../../components/customers/CustomerForm';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Customer { id: string; name: string; email?: string | null; phone?: string | null; }

const CustomersPage: React.FC = () => {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [error, setError] = useState('');

  const fetchCustomers = useCallback(async () => {
    try {
      const data = await localApi.get('customers');
      setCustomers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch customers');
    }
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const handleSave = async (customerData: Omit<Customer, 'id'>) => {
    try {
      if (editingCustomer) {
        await localApi.put('customers', editingCustomer.id, customerData);
      } else {
        await localApi.post('customers', customerData);
      }
      setIsFormVisible(false);
      setEditingCustomer(null);
      fetchCustomers();
    } catch (err: any) { setError(err.message); }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsFormVisible(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('confirm_delete'))) {
      try {
        await localApi.delete('customers', id);
        fetchCustomers();
      } catch (err: any) { setError(err.message); }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>{t('customers_management')}</Typography>
      {error && <Typography color="error">{error}</Typography>}

      {!isFormVisible && (
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditingCustomer(null); setIsFormVisible(true); }} sx={{ mb: 2 }}>
          {t('add_new_customer')}
        </Button>
      )}

      {isFormVisible && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6">{editingCustomer ? t('edit_customer') : t('add_new_customer')}</Typography>
          <CustomerForm customer={editingCustomer} onSave={handleSave} onCancel={() => setIsFormVisible(false)} />
        </Box>
      )}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('name')}</TableCell>
                <TableCell>{t('email')}</TableCell>
                <TableCell>{t('phone')}</TableCell>
                <TableCell align="right">{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email || 'N/A'}</TableCell>
                  <TableCell>{customer.phone || 'N/A'}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(customer)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(customer.id)} color="error"><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {customers.length === 0 && <Typography sx={{ p: 2, textAlign: 'center' }}>{t('no_customers_found')}</Typography>}
      </Paper>
    </Box>
  );
};

export default CustomersPage;
