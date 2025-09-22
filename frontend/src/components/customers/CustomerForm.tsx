import React, { useState, useEffect } from 'react';
import { Box, TextField, Button } from '@mui/material';

interface Customer {
  id?: string;
  name: string;
  email?: string | null;
  phone?: string | null;
}

interface CustomerFormProps {
  customer: Customer | null;
  onSave: (customerData: Omit<Customer, 'id'>) => void;
  onCancel: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ customer, onSave, onCancel }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
      });
    } else {
      setFormData({ name: '', email: '', phone: '' });
    }
  }, [customer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Customer Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        variant="outlined"
        fullWidth
      />
      <TextField
        label="Email (Optional)"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        variant="outlined"
        fullWidth
      />
      <TextField
        label="Phone (Optional)"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        variant="outlined"
        fullWidth
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
        <Button onClick={onCancel} variant="outlined">Cancel</Button>
        <Button type="submit" variant="contained">Save</Button>
      </Box>
    </Box>
  );
};

export default CustomerForm;
