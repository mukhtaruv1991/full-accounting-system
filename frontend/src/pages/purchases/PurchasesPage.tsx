import { useEffect, useState } from 'react'; // إزالة React من هنا
import { api } from '../../api/api';
import PurchaseForm from '../../components/purchases/PurchaseForm'; // التأكد من المسار والاسم

interface Item {
  id: string;
  name: string;
  description?: string;
  price: number;
  cost: number;
}

interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface Purchase {
  id: string;
  date: string;
  supplierId: string;
  totalAmount: number;
  status: string;
}

const PurchasesPage = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [items, setItems] = useState<Item[]>([]); // قد لا نحتاجها هنا مباشرة لكن يمكن تمريرها للنموذج
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPurchases();
    fetchSuppliersAndItems();
  }, []);

  const fetchPurchases = async () => {
    try {
      const data = await api.get('/purchases');
      setPurchases(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchSuppliersAndItems = async () => {
    try {
      const supplierData = await api.get('/suppliers');
      setSuppliers(supplierData);
      const itemData = await api.get('/items'); // جلب الأصناف
      setItems(itemData);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSave = async (purchaseData: Omit<Purchase, 'id'>) => {
    try {
      if (editingPurchase) {
        await api.put(`/purchases/${editingPurchase.id}`, purchaseData);
      } else {
        await api.post('/purchases', purchaseData);
      }
      setEditingPurchase(null);
      fetchPurchases();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (purchase: Purchase) => {
    setEditingPurchase(purchase);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/purchases/${id}`);
      fetchPurchases();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h2>Purchases</h2>
      {error && <p className="error-message">{error}</p>}

      <h3>{editingPurchase ? 'Edit Purchase' : 'Add New Purchase'}</h3>
      <PurchaseForm
        purchase={editingPurchase}
        suppliers={suppliers}
        items={items} // تمرير الأصناف للنموذج
        onSave={handleSave}
        onCancel={() => setEditingPurchase(null)}
      />

      <h3>All Purchases</h3>
      {purchases.length === 0 ? (
        <p>No purchases found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Supplier</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => (
              <tr key={purchase.id}>
                <td>{new Date(purchase.date).toLocaleDateString()}</td>
                <td>{suppliers.find(s => s.id === purchase.supplierId)?.name || purchase.supplierId}</td>
                <td>{purchase.totalAmount.toFixed(2)}</td>
                <td>{purchase.status}</td>
                <td>
                  <button onClick={() => handleEdit(purchase)}>Edit</button>
                  <button onClick={() => handleDelete(purchase.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PurchasesPage;
