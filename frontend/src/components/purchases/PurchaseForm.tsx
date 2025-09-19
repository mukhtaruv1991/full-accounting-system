import React, { useState, useEffect } from 'react';

interface Supplier {
  id: string;
  name: string;
}

interface Item {
    id: string;
    name: string;
    price: number; // قد تحتاج إلى سعر الشراء هنا لاحقًا
}

interface Purchase {
  id: string;
  date: string;
  supplierId: string;
  totalAmount: number;
  status: string;
}

interface PurchaseFormProps {
  purchase: Purchase | null;
  suppliers: Supplier[];
  items: Item[]; // يمكن استخدامها لاحقًا لإضافة تفاصيل الشراء
  onSave: (data: Omit<Purchase, 'id'>) => void;
  onCancel: () => void;
}

// تغيير 'items' إلى '_items' لتجاهل تحذير "never read"
const PurchaseForm: React.FC<PurchaseFormProps> = ({ purchase, suppliers, items: _items, onSave, onCancel }) => {
  const [date, setDate] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [status, setStatus] = useState('Pending');

  useEffect(() => {
    if (purchase) {
      setDate(new Date(purchase.date).toISOString().split('T')[0] || '');
      setSupplierId(purchase.supplierId || '');
      setTotalAmount(purchase.totalAmount.toString() || '');
      setStatus(purchase.status || 'Pending');
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setSupplierId('');
      setTotalAmount('');
      setStatus('Pending');
    }
  }, [purchase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      date: new Date(date).toISOString(),
      supplierId,
      totalAmount: parseFloat(totalAmount),
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>
      <div>
        <label>Supplier:</label>
        <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} required>
          <option value="">Select a supplier</option>
          {suppliers.map((sup: Supplier) => (
            <option key={sup.id} value={sup.id}>
              {sup.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Total Amount:</label>
        <input
          type="number"
          step="0.01"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          required
        />
      </div>
      {/*
      // يمكن إضافة حقول لاختيار الأصناف والكميات هنا لاحقًا
      <div>
        <label>Items:</label>
        <select>
            <option value="">Select an item</option>
            {_items.map(item => ( // استخدام _items هنا إذا أردت تفعيل هذا الجزء
                <option key={item.id} value={item.id}>{item.name}</option>
            ))}
        </select>
      </div>
      */}
      <div>
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
      <button type="submit">Save</button>
      {purchase && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
};

export default PurchaseForm;
