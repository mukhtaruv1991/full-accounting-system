import React, { useEffect, useState, useCallback } from 'react';
import { localApi } from '../../api/localApi';
import SupplierForm from '../../components/suppliers/SupplierForm';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface Supplier {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
}

const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [error, setError] = useState('');

  const fetchSuppliers = useCallback(async () => {
    try {
      const data = await localApi.get('suppliers');
      setSuppliers(data);
    } catch (err: any) {
      setError('Failed to load suppliers.');
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleSave = async (supplierData: Omit<Supplier, 'id'>) => {
    try {
      if (editingSupplier) {
        await localApi.put('suppliers', editingSupplier.id, supplierData);
      } else {
        await localApi.post('suppliers', supplierData);
      }
      setIsFormVisible(false);
      fetchSuppliers();
    } catch (err: any) {
      setError('Failed to save supplier.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      try {
        await localApi.delete('suppliers', id);
        fetchSuppliers();
      } catch (err: any) {
        setError('Failed to delete supplier.');
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Suppliers Management
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!isFormVisible && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => { setEditingSupplier(null); setIsFormVisible(true); }}
          sx={{ mb: 2 }}
        >
          Add New Supplier
        </Button>
      )}
      {isFormVisible && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</Typography>
          <SupplierForm supplier={editingSupplier} onSave={handleSave} onCancel={() => setIsFormVisible(false)} />
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
            {suppliers.map((supplier) => (
              <tr key={supplier.id}>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.email || 'N/A'}</TableCell>
                <TableCell>{supplier.phone || 'N/A'}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => { setEditingSupplier(supplier); setIsFormVisible(true); }} color="primary"><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(supplier.id)} color="error"><DeleteIcon /></IconButton>
                </TableCell>
              </tr>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SuppliersPage;
