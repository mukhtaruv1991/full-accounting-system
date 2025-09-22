import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

interface Account { id: string; name: string; code: string; }
interface JournalEntry { id?: string; date: string; description: string; debitAccountId: string; creditAccountId: string; amount: number; }

interface JournalEntryFormProps {
  entry: JournalEntry | null;
  accounts: Account[];
  onSave: (entryData: Omit<JournalEntry, 'id'>) => void;
  onCancel: () => void;
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({ entry, accounts, onSave, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    debitAccountId: '',
    creditAccountId: '',
    amount: '',
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (entry) {
      setFormData({
        date: new Date(entry.date).toISOString().split('T')[0],
        description: entry.description,
        debitAccountId: entry.debitAccountId,
        creditAccountId: entry.creditAccountId,
        amount: entry.amount.toString(),
      });
    }
  }, [entry]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (formData.debitAccountId === formData.creditAccountId) {
      setFormError(t('accounts_cannot_be_same'));
      return;
    }
    
    const amountValue = parseFloat(formData.amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setFormError('Amount must be a positive number.');
      return;
    }

    onSave({
      date: formData.date,
      description: formData.description,
      debitAccountId: formData.debitAccountId,
      creditAccountId: formData.creditAccountId,
      amount: amountValue,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField name="date" label={t('date')} type="date" value={formData.date} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12}>
          <TextField name="description" label={t('description')} value={formData.description} onChange={handleChange} fullWidth required multiline rows={2} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!formError && formData.debitAccountId === formData.creditAccountId}>
            <InputLabel>{t('debit_account')}</InputLabel>
            <Select name="debitAccountId" value={formData.debitAccountId} label={t('debit_account')} onChange={handleChange}>
              {accounts.map(acc => <MenuItem key={acc.id} value={acc.id}>{acc.name} ({acc.code})</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!formError && formData.debitAccountId === formData.creditAccountId}>
            <InputLabel>{t('credit_account')}</InputLabel>
            <Select name="creditAccountId" value={formData.creditAccountId} label={t('credit_account')} onChange={handleChange}>
              {accounts.map(acc => <MenuItem key={acc.id} value={acc.id}>{acc.name} ({acc.code})</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField name="amount" label={t('debit_amount')} type="number" value={formData.amount} onChange={handleChange} fullWidth required inputProps={{ step: "0.01", min: "0" }} />
        </Grid>
        {formError && <Grid item xs={12}><FormHelperText error>{formError}</FormHelperText></Grid>}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onCancel}>{t('cancel')}</Button>
          <Button type="submit" variant="contained">{t('save')}</Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default JournalEntryForm;
