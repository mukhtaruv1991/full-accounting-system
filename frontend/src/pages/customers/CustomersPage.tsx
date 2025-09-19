import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../../api/api';
import CustomerForm from '../../components/customers/CustomerForm';

interface Customer {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
}

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [error, setError] = useState('');

  const fetchCustomers = useCallback(async () => {
    try {
      const data = await api.get('/customers');
      setCustomers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch customers');
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSave = async (customerData: Omit<Customer, 'id'>) => {
    try {
      if (editingCustomer) {
        await api.put(`/customers/${editingCustomer.id}`, customerData);
      } else {
        await api.post('/customers', customerData);
      }
      setEditingCustomer(null);
      setIsFormVisible(false);
      fetchCustomers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsFormVisible(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await api.delete(`/customers/${id}`);
        fetchCustomers();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleAddNew = () => {
    setEditingCustomer(null);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setEditingCustomer(null);
    setIsFormVisible(false);
  };

  return (
    <div className="container">
      <h2>Customers Management</h2>
      {error && <p className="error-message">{error}</p>}

      {!isFormVisible && (
        <button onClick={handleAddNew} style={{ marginBottom: '1rem' }}>
          Add New Customer
        </button>
      )}

      {isFormVisible && (
        <div>
          <h3>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h3>
          <CustomerForm
            customer={editingCustomer}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}

      <hr style={{ margin: '2rem 0' }} />

      <h3>All Customers</h3>
      {customers.length === 0 ? (
        <p>No customers found. Click "Add New Customer" to start.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Email</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Phone</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{customer.name}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{customer.email || 'N/A'}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{customer.phone || 'N/A'}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  <button onClick={() => handleEdit(customer)}>Edit</button>
                  <button onClick={() => handleDelete(customer.id)} style={{ marginLeft: '5px' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomersPage;
