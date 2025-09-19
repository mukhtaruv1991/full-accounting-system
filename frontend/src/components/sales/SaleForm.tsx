import { useState, useEffect } from 'react';
import React from 'react';

interface Customer {
  id: string;
  name: string;
}

interface Item {
    id: string;
    name: string;
    price: number;
}

interface SaleFormProps {
  sale: { id: string; date: string; customerId: string; totalAmount: number; status: string } | null;
  customers: Customer[];
  items: Item[]; // تبقى هنا في الواجهة
  onSave: (data: { date: string; customerId: string; totalAmount: number; status: string }) => void;
  onCancel: () => void;
}

// تغيير 'items' إلى '_items' لتجاهل تحذير "never read"
const SaleForm: React.FC<SaleFormProps> = ({ sale, customers, items: _items, onSave, onCancel }) => {
  const [date, setDate] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [status, setStatus] = useState('Pending');

  useEffect(() => {
    if (sale) {
      setDate(new Date(sale.date).toISOString().split('T')[0] || '');
      setCustomerId(sale.customerId || '');
      setTotalAmount(sale.totalAmount.toString() || '');
      setStatus(sale.status || 'Pending');
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setCustomerId('');
      setTotalAmount('');
      setStatus('Pending');
    }
  }, [sale]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      date: new Date(date).toISOString(),
      customerId,
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
        <label>Customer:</label>
        <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
          <option value="">Select a customer</option>
          {customers.map((cust: Customer) => (
            <option key={cust.id} value={cust.id}>
              {cust.name}
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
            {_items.map(item => ( // هنا يمكنك استخدام _items إذا أردت تفعيل هذا الجزء
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
      {sale && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
};

export default SaleForm;
