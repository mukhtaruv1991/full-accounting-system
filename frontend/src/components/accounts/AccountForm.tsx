import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel } from '@mui/material';

interface Account {
  id?: string;
  name: string;
  code: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  parentCode?: string;
  description?: string;
  isDebit: boolean;
}

interface AccountFormProps {
  account: Account | null;
  onSave: (accountData: Omit<Account, 'id'>) => void;
  onCancel: () => void;
}

const AccountForm: React.FC<AccountFormProps> = ({ account, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Account, 'id'>>({
    name: '',
    code: '',
    type: 'Asset',
    parentCode: '',
    description: '',
    isDebit: true,
  });

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name || '',
        code: account.code || '',
        type: account.type || 'Asset',
        parentCode: account.parentCode || '',
        description: account.description || '',
        isDebit: account.isDebit !== undefined ? account.isDebit : true,
      });
    } else {
      // Reset form for new account
      setFormData({
        name: '',
        code: '',
        type: 'Asset',
        parentCode: '',
        description: '',
        isDebit: true,
      });
    }
  }, [account]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name as string]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
      <TextField
        label="Account Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        variant="outlined"
        fullWidth
      />
      <TextField
        label="Account Code"
        name="code"
        value={formData.code}
        onChange={handleChange}
        required
        variant="outlined"
        fullWidth
      />
      <FormControl fullWidth variant="outlined">
        <InputLabel>Type</InputLabel>
        <Select
          label="Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
        >
          <MenuItem value="Asset">Asset</MenuItem>
          <MenuItem value="Liability">Liability</MenuItem>
          <MenuItem value="Equity">Equity</MenuItem>
          <MenuItem value="Revenue">Revenue</MenuItem>
          <MenuItem value="Expense">Expense</MenuItem>
        </Select>
      </FormControl>
      <FormControlLabel
        control={<Checkbox checked={formData.isDebit} onChange={handleChange} name="isDebit" />}
        label="Is Debit Nature"
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
        <Button onClick={onCancel} variant="outlined">Cancel</Button>
        <Button type="submit" variant="contained">Save</Button>
      </Box>
    </Box>
  );
};

export default AccountForm;
