import React, { useState, useEffect } from 'react';

interface Account {
  id: string;
  name: string;
  code: string;
}

interface JournalEntry {
  id?: string;
  date: string;
  description: string;
  debitAccountId: string;
  creditAccountId: string;
  debitAmount: number;
  creditAmount: number;
}

interface JournalEntryFormProps {
  entry: JournalEntry | null;
  accounts: Account[];
  onSave: (entryData: Omit<JournalEntry, 'id'>) => void;
  onCancel: () => void;
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({ entry, accounts, onSave, onCancel }) => {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [debitAccountId, setDebitAccountId] = useState('');
  const [creditAccountId, setCreditAccountId] = useState('');
  const [debitAmount, setDebitAmount] = useState('');
  const [creditAmount, setCreditAmount] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (entry) {
      setDate(new Date(entry.date).toISOString().split('T')[0] || '');
      setDescription(entry.description || '');
      setDebitAccountId(entry.debitAccountId || '');
      setCreditAccountId(entry.creditAccountId || '');
      setDebitAmount(entry.debitAmount.toString() || '');
      setCreditAmount(entry.creditAmount.toString() || '');
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setDebitAccountId('');
      setCreditAccountId('');
      setDebitAmount('');
      setCreditAmount('');
    }
  }, [entry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (parseFloat(debitAmount) !== parseFloat(creditAmount)) {
      setFormError('Debit amount must equal credit amount.');
      return;
    }

    if (debitAccountId === creditAccountId) {
      setFormError('Debit account and Credit account cannot be the same.');
      return;
    }

    onSave({
      date: new Date(date).toISOString(),
      description,
      debitAccountId,
      creditAccountId,
      debitAmount: parseFloat(debitAmount),
      creditAmount: parseFloat(creditAmount),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {formError && <p className="error-message">{formError}</p>}
      <div>
        <label>Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>
      <div>
        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
      </div>
      <div>
        <label>Debit Account:</label>
        <select value={debitAccountId} onChange={(e) => setDebitAccountId(e.target.value)} required>
          <option value="">Select an account</option>
          {accounts.map((acc: Account) => (
            <option key={acc.id} value={acc.id}>
              {acc.name} ({acc.code})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Credit Account:</label>
        <select value={creditAccountId} onChange={(e) => setCreditAccountId(e.target.value)} required>
          <option value="">Select an account</option>
          {accounts.map((acc: Account) => (
            <option key={acc.id} value={acc.id}>
              {acc.name} ({acc.code})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Debit Amount:</label>
        <input
          type="number"
          step="0.01"
          value={debitAmount}
          onChange={(e) => setDebitAmount(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Credit Amount:</label>
        <input
          type="number"
          step="0.01"
          value={creditAmount}
          onChange={(e) => setCreditAmount(e.target.value)}
          required
        />
      </div>
      <button type="submit">Save</button>
      {entry && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
};

export default JournalEntryForm;
