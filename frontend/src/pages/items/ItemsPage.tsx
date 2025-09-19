import { useEffect, useState } from 'react'; // إزالة React من هنا
import { api } from '../../api/api';
import ItemForm from '../../components/items/ItemForm';

interface Item {
  id: string;
  name: string;
  description?: string;
  price: number;
  cost: number;
}

const ItemsPage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await api.get('/items');
      setItems(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSave = async (itemData: Omit<Item, 'id'>) => {
    try {
      if (editingItem) {
        await api.put(`/items/${editingItem.id}`, itemData);
      } else {
        await api.post('/items', itemData);
      }
      setEditingItem(null);
      fetchItems();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/items/${id}`);
      fetchItems();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h2>Items</h2>
      {error && <p className="error-message">{error}</p>}

      <h3>{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
      <ItemForm item={editingItem} onSave={handleSave} onCancel={() => setEditingItem(null)} />

      <h3>All Items</h3>
      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Cost</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.price.toFixed(2)}</td>
                <td>{item.cost.toFixed(2)}</td>
                <td>
                  <button onClick={() => handleEdit(item)}>Edit</button>
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ItemsPage;
