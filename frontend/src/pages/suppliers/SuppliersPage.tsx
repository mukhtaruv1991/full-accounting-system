import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { localApi } from '../../api/localApi';
import SupplierForm from '../../components/suppliers/SupplierForm';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Supplier { id: string; name: string; email?: string | null; phone?: string | null; }

const SuppliersPage: React.FC = () => {
  const { t } = useTranslation();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [error, setError] = useState('');

  const fetchSuppliers = useCallback(async () => {
    try {
      const data = await localApi.get('suppliers');
      setSuppliers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch suppliers');
    }
  }, []);

  useEffect(() => { fetchSuppliers(); }, [fetchSuppliers]);

  const handleSave = async (supplierData: Omit<Supplier, 'id'>) => {
    try {
      if (editingSupplier) {
        await localApi.put('suppliers', editingSupplier.id, supplierData);
      } else {
        await localApi.post('suppliers', supplierData);
      }
      setIsFormVisible(false);
      setEditingSupplier(null);
      fetchSuppliers();
    } catch (err: any) { setError(err.message); }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsFormVisible(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('confirm_delete'))) {
      try {
        await localApi.delete('suppliers', id);
        fetchSuppliers();
      } catch (err: any) { setError(err.message); }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>{t('suppliers_management')}</Typography>
      {error && <Typography color="error">{error}</Typography>}

      {!isFormVisible && (
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditingSupplier(null); setIsFormVisible(true); }} sx={{ mb: 2 }}>
          {t('add_new_supplier')}
        </Button>
      )}

      {isFormVisible && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6">{editingSupplier ? t('edit_supplier') : t('add_new_supplier')}</Typography>
          <SupplierForm supplier={editingSupplier} onSave={handleSave} onCancel={() => setIsFormVisible(false)} />
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
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id} hover>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.email || 'N/A'}</TableCell>
                  <TableCell>{supplier.phone || 'N/A'}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(supplier)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(supplier.id)} color="error"><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {suppliers.length === 0 && <Typography sx={{ p: 2, textAlign: 'center' }}>{t('no_suppliers_found')}</Typography>}
      </Paper>
    </Box>
  );
};

export default SuppliersPage;
