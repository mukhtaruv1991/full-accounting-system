import React, { useState, useEffect } from 'react';
import { Box, TextField, Button } from '@mui/material';

interface Item {
  id?: string;
  name: string;
  description?: string;
  price: number;
  cost: number;
}

interface ItemFormProps {
  item: Item | null;
  onSave: (itemData: Omit<Item, 'id'>) => void;
  onCancel: () => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({ name: '', description: '', price: '0', cost: '0' });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        price: String(item.price || 0),
        cost: String(item.cost || 0),
      });
    } else {
      setFormData({ name: '', description: '', price: '0', cost: '0' });
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost),
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField label="Item Name" name="name" value={formData.name} onChange={handleChange} required fullWidth />
      <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth multiline rows={2} />
      <TextField label="Price" name="price" type="number" value={formData.price} onChange={handleChange} required fullWidth />
      <TextField label="Cost" name="cost" type="number" value={formData.cost} onChange={handleChange} required fullWidth />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
        <Button onClick={onCancel} variant="outlined">Cancel</Button>
        <Button type="submit" variant="contained">Save</Button>
      </Box>
    </Box>
  );
};

export default ItemForm;
