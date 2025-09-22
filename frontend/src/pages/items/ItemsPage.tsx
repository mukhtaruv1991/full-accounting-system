import React, { useEffect, useState, useCallback } from 'react';
import { localApi } from '../../api/localApi';
import ItemForm from '../../components/items/ItemForm';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface Item {
  id: string;
  name: string;
  description?: string;
  price: number;
  cost: number;
}

const ItemsPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [error, setError] = useState('');

  const fetchItems = useCallback(async () => {
    try {
      const data = await localApi.get('items');
      setItems(data);
    } catch (err: any) {
      setError('Failed to load items.');
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSave = async (itemData: Omit<Item, 'id'>) => {
    try {
      if (editingItem) {
        await localApi.put('items', editingItem.id, itemData);
      } else {
        await localApi.post('items', itemData);
      }
      setIsFormVisible(false);
      fetchItems();
    } catch (err: any) {
      setError('Failed to save item.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      try {
        await localApi.delete('items', id);
        fetchItems();
      } catch (err: any) {
        setError('Failed to delete item.');
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>Items Management</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!isFormVisible && (
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditingItem(null); setIsFormVisible(true); }} sx={{ mb: 2 }}>
          Add New Item
        </Button>
      )}
      {isFormVisible && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>{editingItem ? 'Edit Item' : 'Add New Item'}</Typography>
          <ItemForm item={editingItem} onSave={handleSave} onCancel={() => setIsFormVisible(false)} />
        </Paper>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.price.toFixed(2)}</TableCell>
                <TableCell>{item.cost.toFixed(2)}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => { setEditingItem(item); setIsFormVisible(true); }} color="primary"><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(item.id)} color="error"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ItemsPage;
