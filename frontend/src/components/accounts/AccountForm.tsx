import React, { useState, useEffect } from 'react';

interface Account {
  id?: string; // Optional for new accounts
  name: string;
  code: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  parentCode?: string;
  description?: string;
  isDebit: boolean;
}

interface AccountFormProps {
  account: Account | null;
  onSave: (accountData: Omit<Account, 'id'>) => void;
  onCancel: () => void;
}

const AccountForm: React.FC<AccountFormProps> = ({ account, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [type, setType] = useState<Account['type']>('Asset'); // Default type
  const [parentCode, setParentCode] = useState('');
  const [description, setDescription] = useState('');
  const [isDebit, setIsDebit] = useState(true);

  useEffect(() => {
    if (account) {
      setName(account.name || '');
      setCode(account.code || '');
      setType(account.type || 'Asset');
      setParentCode(account.parentCode || '');
      setDescription(account.description || '');
      setIsDebit(account.isDebit !== undefined ? account.isDebit : true);
    } else {
      setName('');
      setCode('');
      setType('Asset');
      setParentCode('');
      setDescription('');
      setIsDebit(true);
    }
  }, [account]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, code, type, parentCode, description, isDebit });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Code:</label>
        <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required />
      </div>
      <div>
        <label>Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value as Account['type'])}>
          <option value="Asset">Asset</option>
          <option value="Liability">Liability</option>
          <option value="Equity">Equity</option>
          <option value="Revenue">Revenue</option>
          <option value="Expense">Expense</option>
        </select>
      </div>
      <div>
        <label>Parent Code (optional):</label>
        <input type="text" value={parentCode} onChange={(e) => setParentCode(e.target.value)} />
      </div>
      <div>
        <label>Description (optional):</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
      </div>
      <div>
        <label>Is Debit:</label>
        <input type="checkbox" checked={isDebit} onChange={(e) => setIsDebit(e.target.checked)} />
      </div>
      <button type="submit">Save</button>
      {account && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
};

export default AccountForm;
