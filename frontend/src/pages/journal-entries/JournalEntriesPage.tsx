import { useEffect, useState } from 'react'; // إزالة React من هنا
import { api } from '../../api/api';
import JournalEntryForm from '../../components/journal-entries/JournalEntryForm';

interface Account {
  id: string;
  name: string;
  code: string;
}

interface JournalEntry {
  id: string;
  date: string;
  description: string;
  debitAccountId: string;
  creditAccountId: string;
  debitAmount: number;
  creditAmount: number;
}

const JournalEntriesPage = () => {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]); // لجلب الحسابات لاستخدامها في النموذج
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJournalEntries();
    fetchAccountsForForm();
  }, []);

  const fetchJournalEntries = async () => {
    try {
      const data = await api.get('/journal-entries');
      setJournalEntries(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchAccountsForForm = async () => {
    try {
      const data = await api.get('/accounts');
      setAccounts(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSave = async (entryData: Omit<JournalEntry, 'id'>) => {
    try {
      if (editingEntry) {
        await api.put(`/journal-entries/${editingEntry.id}`, entryData);
      } else {
        await api.post('/journal-entries', entryData);
      }
      setEditingEntry(null);
      fetchJournalEntries();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/journal-entries/${id}`);
      fetchJournalEntries();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h2>Journal Entries</h2>
      {error && <p className="error-message">{error}</p>}

      <h3>{editingEntry ? 'Edit Journal Entry' : 'Add New Journal Entry'}</h3>
      <JournalEntryForm
        entry={editingEntry}
        accounts={accounts}
        onSave={handleSave}
        onCancel={() => setEditingEntry(null)}
      />

      <h3>All Journal Entries</h3>
      {journalEntries.length === 0 ? (
        <p>No journal entries found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Debit Account</th>
              <th>Credit Account</th>
              <th>Debit Amount</th>
              <th>Credit Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {journalEntries.map((entry) => (
              <tr key={entry.id}>
                <td>{new Date(entry.date).toLocaleDateString()}</td>
                <td>{entry.description}</td>
                <td>{accounts.find(acc => acc.id === entry.debitAccountId)?.name || entry.debitAccountId}</td>
                <td>{accounts.find(acc => acc.id === entry.creditAccountId)?.name || entry.creditAccountId}</td>
                <td>{entry.debitAmount.toFixed(2)}</td>
                <td>{entry.creditAmount.toFixed(2)}</td>
                <td>
                  <button onClick={() => handleEdit(entry)}>Edit</button>
                  <button onClick={() => handleDelete(entry.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default JournalEntriesPage;
