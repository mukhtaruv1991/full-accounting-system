import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Box } from '@mui/material';

interface Account { id?: string; name: string; code: string; type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense'; parentCode?: string; description?: string; isDebit: boolean; }
interface AccountFormProps { account: Account | null; onSave: (accountData: Omit<Account, 'id'>) => void; onCancel: () => void; }

const AccountForm: React.FC<AccountFormProps> = ({ account, onSave, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', code: '', type: 'Asset' as Account['type'], parentCode: '', description: '', isDebit: true });

  useEffect(() => {
    if (account) {
      setFormData({ name: account.name, code: account.code, type: account.type, parentCode: account.parentCode || '', description: account.description || '', isDebit: account.isDebit });
    } else {
      setFormData({ name: '', code: '', type: 'Asset', parentCode: '', description: '', isDebit: true });
    }
  }, [account]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid xs={12} sm={6}><TextField name="name" label={t('account_name')} value={formData.name} onChange={handleChange} fullWidth required /></Grid>
        <Grid xs={12} sm={6}><TextField name="code" label={t('account_code')} value={formData.code} onChange={handleChange} fullWidth required /></Grid>
        <Grid xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>{t('account_type')}</InputLabel>
            <Select name="type" value={formData.type} label={t('account_type')} onChange={handleChange}>
              <MenuItem value="Asset">{t('asset')}</MenuItem>
              <MenuItem value="Liability">{t('liability')}</MenuItem>
              <MenuItem value="Equity">{t('equity')}</MenuItem>
              <MenuItem value="Revenue">{t('revenue')}</MenuItem>
              <MenuItem value="Expense">{t('expense')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6}><TextField name="parentCode" label={t('parent_code')} value={formData.parentCode} onChange={handleChange} fullWidth /></Grid>
        <Grid xs={12}><TextField name="description" label={t('description')} value={formData.description} onChange={handleChange} fullWidth multiline rows={2} /></Grid>
        <Grid xs={12}><FormControlLabel control={<Checkbox name="isDebit" checked={formData.isDebit} onChange={handleChange} />} label={t('is_debit_nature')} /></Grid>
        <Grid xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onCancel}>{t('cancel')}</Button>
          <Button type="submit" variant="contained">{t('save')}</Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default AccountForm;
