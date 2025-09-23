import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, Button, Grid } from '@mui/material';

interface Supplier { id?: string; name: string; email?: string | null; phone?: string | null; }
interface SupplierFormProps { supplier: Supplier | null; onSave: (data: Omit<Supplier, 'id'>) => void; onCancel: () => void; }

const SupplierForm: React.FC<SupplierFormProps> = ({ supplier, onSave, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    if (supplier) {
      setFormData({ name: supplier.name, email: supplier.email || '', phone: supplier.phone || '' });
    } else {
      setFormData({ name: '', email: '', phone: '' });
    }
  }, [supplier]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid xs={12}><TextField name="name" label={t('name')} value={formData.name} onChange={handleChange} fullWidth required /></Grid>
        <Grid xs={12} sm={6}><TextField name="email" label={t('email')} type="email" value={formData.email} onChange={handleChange} fullWidth /></Grid>
        <Grid xs={12} sm={6}><TextField name="phone" label={t('phone')} value={formData.phone} onChange={handleChange} fullWidth /></Grid>
        <Grid xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onCancel}>{t('cancel')}</Button>
          <Button type="submit" variant="contained">{t('save')}</Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default SupplierForm;
