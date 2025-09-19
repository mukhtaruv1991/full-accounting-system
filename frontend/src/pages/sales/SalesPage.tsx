import { useEffect, useState } from 'react'; // إزالة React من هنا
import { api } from '../../api/api';
import SaleForm from '../../components/sales/SaleForm';

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface Item {
  id: string;
  name: string;
  description?: string;
  price: number;
  cost: number;
}

interface Sale {
  id: string;
  date: string;
  customerId: string;
  totalAmount: number;
  status: string;
}

const SalesPage = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<Item[]>([]); // لجلب الأصناف لاستخدامها في النموذج
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSales();
    fetchCustomersAndItems();
  }, []);

  const fetchSales = async () => {
    try {
      const data = await api.get('/sales');
      setSales(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchCustomersAndItems = async () => {
    try {
      const customerData = await api.get('/customers');
      setCustomers(customerData);
      const itemData = await api.get('/items');
      setItems(itemData);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSave = async (saleData: Omit<Sale, 'id'>) => {
    try {
      if (editingSale) {
        await api.put(`/sales/${editingSale.id}`, saleData);
      } else {
        await api.post('/sales', saleData);
      }
      setEditingSale(null);
      fetchSales();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (sale: Sale) => {
    setEditingSale(sale);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/sales/${id}`);
      fetchSales();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h2>Sales</h2>
      {error && <p className="error-message">{error}</p>}

      <h3>{editingSale ? 'Edit Sale' : 'Add New Sale'}</h3>
      <SaleForm
        sale={editingSale}
        customers={customers}
        items={items}
        onSave={handleSave}
        onCancel={() => setEditingSale(null)}
      />

      <h3>All Sales</h3>
      {sales.length === 0 ? (
        <p>No sales found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td>{new Date(sale.date).toLocaleDateString()}</td>
                <td>{customers.find(c => c.id === sale.customerId)?.name || sale.customerId}</td>
                <td>{sale.totalAmount.toFixed(2)}</td>
                <td>{sale.status}</td>
                <td>
                  <button onClick={() => handleEdit(sale)}>Edit</button>
                  <button onClick={() => handleDelete(sale.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SalesPage;
