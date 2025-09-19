import React, { useState, useEffect } from 'react';

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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (customer) {
      setName(customer.name || '');
      setEmail(customer.email || '');
      setPhone(customer.phone || '');
    } else {
      setName('');
      setEmail('');
      setPhone('');
    }
  }, [customer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, email, phone });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Email (optional):</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Phone (optional):</label>
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default CustomerForm;
