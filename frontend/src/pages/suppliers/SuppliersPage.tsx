import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../../api/api';
import SupplierForm from '../../components/suppliers/SupplierForm';

interface Supplier {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
}

const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [error, setError] = useState('');

  const fetchSuppliers = useCallback(async () => {
    try {
      const data = await api.get('/suppliers');
      setSuppliers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch suppliers');
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleSave = async (supplierData: Omit<Supplier, 'id'>) => {
    try {
      if (editingSupplier) {
        await api.put(`/suppliers/${editingSupplier.id}`, supplierData);
      } else {
        await api.post('/suppliers', supplierData);
      }
      setEditingSupplier(null);
      setIsFormVisible(false);
      fetchSuppliers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsFormVisible(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await api.delete(`/suppliers/${id}`);
        fetchSuppliers();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleAddNew = () => {
    setEditingSupplier(null);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setEditingSupplier(null);
    setIsFormVisible(false);
  };

  return (
    <div className="container">
      <h2>Suppliers Management</h2>
      {error && <p className="error-message">{error}</p>}

      {!isFormVisible && (
        <button onClick={handleAddNew} style={{ marginBottom: '1rem' }}>
          Add New Supplier
        </button>
      )}

      {isFormVisible && (
        <div>
          <h3>{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</h3>
          <SupplierForm
            supplier={editingSupplier}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}

      <hr style={{ margin: '2rem 0' }} />

      <h3>All Suppliers</h3>
      {suppliers.length === 0 ? (
        <p>No suppliers found. Click "Add New Supplier" to start.</p>
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
            {suppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{supplier.name}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{supplier.email || 'N/A'}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{supplier.phone || 'N/A'}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  <button onClick={() => handleEdit(supplier)}>Edit</button>
                  <button onClick={() => handleDelete(supplier.id)} style={{ marginLeft: '5px' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SuppliersPage;
