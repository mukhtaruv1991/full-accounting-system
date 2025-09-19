import React, { useState, useEffect } from 'react';

interface Item {
  id?: string;
  name: string;
  description?: string;
  price: number;
  cost: number;
}

interface ItemFormProps {
  item: Item | null;
  onSave: (itemData: Omit<Item, 'id'>) => void;
  onCancel: () => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ item, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [cost, setCost] = useState('');

  useEffect(() => {
    if (item) {
      setName(item.name || '');
      setDescription(item.description || '');
      setPrice(item.price.toString() || '');
      setCost(item.cost.toString() || '');
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setCost('');
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      description,
      price: parseFloat(price),
      cost: parseFloat(cost),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
      </div>
      <div>
        <label>Price:</label>
        <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div>
      <div>
        <label>Cost:</label>
        <input type="number" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} required />
      </div>
      <button type="submit">Save</button>
      {item && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
};

export default ItemForm;
