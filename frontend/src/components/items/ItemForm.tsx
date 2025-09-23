import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, Button, Grid } from '@mui/material';

interface Item { id?: string; name: string; description?: string; price: number; cost: number; }
interface ItemFormProps { item: Item | null; onSave: (itemData: Omit<Item, 'id'>) => void; onCancel: () => void; }

const ItemForm: React.FC<ItemFormProps> = ({ item, onSave, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', description: '', price: '', cost: '' });

  useEffect(() => {
    if (item) {
      setFormData({ name: item.name, description: item.description || '', price: item.price.toString(), cost: item.cost.toString() });
    } else {
      setFormData({ name: '', description: '', price: '', cost: '' });
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      cost: parseFloat(formData.cost) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}><TextField name="name" label={t('name')} value={formData.name} onChange={handleChange} fullWidth required /></Grid>
        <Grid item xs={12}><TextField name="description" label={t('description')} value={formData.description} onChange={handleChange} fullWidth multiline rows={2} /></Grid>
        <Grid item xs={12} sm={6}><TextField name="price" label={t('price')} type="number" value={formData.price} onChange={handleChange} fullWidth required inputProps={{ step: "0.01" }} /></Grid>
        <Grid item xs={12} sm={6}><TextField name="cost" label={t('cost')} type="number" value={formData.cost} onChange={handleChange} fullWidth required inputProps={{ step: "0.01" }} /></Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onCancel}>{t('cancel')}</Button>
          <Button type="submit" variant="contained">{t('save')}</Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ItemForm;
