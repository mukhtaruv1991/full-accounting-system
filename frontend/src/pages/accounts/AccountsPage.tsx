import React, { useEffect, useState, useCallback } from 'react';
import { localApi } from '../../api/localApi';
import AccountForm from '../../components/accounts/AccountForm';

interface Account {
  id: string;
  name: string;
  code: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  isDebit: boolean;
}

const AccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [error, setError] = useState('');

  const fetchAccounts = useCallback(async () => {
    try {
      const data = await localApi.get('accounts');
      setAccounts(data);
    } catch (err: any) {
      setError('Failed to load accounts from local database.');
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleSave = async (accountData: Omit<Account, 'id'>) => {
    try {
      if (editingAccount) {
        await localApi.put('accounts', editingAccount.id, accountData);
      } else {
        await localApi.post('accounts', accountData);
      }
      setEditingAccount(null);
      setIsFormVisible(false);
      fetchAccounts();
    } catch (err: any) {
      setError('Failed to save account.');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await localApi.delete('accounts', id);
        fetchAccounts();
      } catch (err: any) {
        setError('Failed to delete account.');
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h2>Accounts Management (Local)</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!isFormVisible && (
        <button onClick={() => { setEditingAccount(null); setIsFormVisible(true); }} style={{ marginBottom: '1rem' }}>
          Add New Account
        </button>
      )}

      {isFormVisible && (
        <div>
          <h3>{editingAccount ? 'Edit Account' : 'Add New Account'}</h3>
          <AccountForm
            account={editingAccount}
            onSave={handleSave}
            onCancel={() => setIsFormVisible(false)}
          />
        </div>
      )}

      <hr style={{ margin: '2rem 0' }} />

      <h3>All Accounts</h3>
      {accounts.length === 0 ? (
        <p>No accounts found. Add one to get started.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                  <button onClick={() => setEditingAccount(account)}>Edit</button>
                  <button onClick={() => handleDelete(account.id)} style={{ marginLeft: '5px' }}>Delete</button>
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
