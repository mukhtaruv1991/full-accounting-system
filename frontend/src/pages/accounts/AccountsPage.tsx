import { useEffect, useState } from 'react'; // إزالة React من هنا
import { api } from '../../api/api';
import AccountForm from '../../components/accounts/AccountForm';

interface Account {
  id: string;
  name: string;
  code: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  parentCode?: string;
  description?: string;
  isDebit: boolean;
}

const AccountsPage = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const data = await api.get('/accounts');
      setAccounts(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSave = async (accountData: Omit<Account, 'id'>) => {
    try {
      if (editingAccount) {
        await api.put(`/accounts/${editingAccount.id}`, accountData);
      } else {
        await api.post('/accounts', accountData);
      }
      setEditingAccount(null);
      fetchAccounts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/accounts/${id}`);
      fetchAccounts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h2>Accounts</h2>
      {error && <p className="error-message">{error}</p>}

      <h3>{editingAccount ? 'Edit Account' : 'Add New Account'}</h3>
      <AccountForm account={editingAccount} onSave={handleSave} onCancel={() => setEditingAccount(null)} />

      <h3>All Accounts</h3>
      {accounts.length === 0 ? (
        <p>No accounts found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td>{account.name}</td>
                <td>{account.code}</td>
                <td>{account.type}</td>
                <td>
                  <button onClick={() => handleEdit(account)}>Edit</button>
                  <button onClick={() => handleDelete(account.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AccountsPage;
