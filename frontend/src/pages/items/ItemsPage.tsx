import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { localApi } from '../../api/localApi';
import ItemForm from '../../components/items/ItemForm';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Item { id: string; name: string; description?: string; price: number; cost: number; }

const ItemsPage: React.FC = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<Item[]>([]);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [error, setError] = useState('');

  const fetchItems = useCallback(async () => {
    try {
      const data = await localApi.get('items');
      setItems(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch items');
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleSave = async (itemData: Omit<Item, 'id'>) => {
    try {
      if (editingItem) {
        await localApi.put('items', editingItem.id, itemData);
      } else {
        await localApi.post('items', itemData);
      }
      setIsFormVisible(false);
      setEditingItem(null);
      fetchItems();
    } catch (err: any) { setError(err.message); }
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setIsFormVisible(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('confirm_delete'))) {
      try {
        await localApi.delete('items', id);
        fetchItems();
      } catch (err: any) { setError(err.message); }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>{t('items_management')}</Typography>
      {error && <Typography color="error">{error}</Typography>}

      {!isFormVisible && (
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditingItem(null); setIsFormVisible(true); }} sx={{ mb: 2 }}>
          {t('add_new_item')}
        </Button>
      )}

      {isFormVisible && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6">{editingItem ? t('edit_item') : t('add_new_item')}</Typography>
          <ItemForm item={editingItem} onSave={handleSave} onCancel={() => setIsFormVisible(false)} />
        </Box>
      )}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('name')}</TableCell>
                <TableCell>{t('description')}</TableCell>
                <TableCell align="right">{t('price')}</TableCell>
                <TableCell align="right">{t('cost')}</TableCell>
                <TableCell align="right">{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description || 'N/A'}</TableCell>
                  <TableCell align="right">{item.price.toFixed(2)}</TableCell>
                  <TableCell align="right">{item.cost.toFixed(2)}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(item)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(item.id)} color="error"><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {items.length === 0 && <Typography sx={{ p: 2, textAlign: 'center' }}>{t('no_items_found')}</Typography>}
      </Paper>
    </Box>
  );
};

export default ItemsPage;
