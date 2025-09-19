import { useEffect, useState, useCallback } from 'react';
import { api } from '../../api/api';
import AccountForm from '../../components/accounts/AccountForm';

// تعريف أنواع البيانات
interface Account {
  id: string;
  name: string;
  code: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  parentCode?: string;
  description?: string;
  isDebit: boolean;
  createdAt: string;
}

type SortOrder = 'asc' | 'desc';

const AccountsPage = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [error, setError] = useState('');
  
  // -- حالات جديدة للبحث والفرز --
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // -- دالة لجلب البيانات مع معاملات البحث والفرز --
  const fetchAccounts = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        sortBy,
        sortOrder,
      });
      // استخدام api.get الذي قمنا بتعريفه
      const data = await api.get(`/accounts?${params.toString()}`);
      setAccounts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch accounts');
    }
  }, [searchTerm, sortBy, sortOrder]);

  // -- جلب البيانات عند تحميل الصفحة أو عند تغيير الفرز/البحث --
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAccounts();
    }, 500); // تأخير بسيط لتحسين الأداء عند الكتابة في حقل البحث
    return () => clearTimeout(timer);
  }, [fetchAccounts]);

  const handleSave = async (accountData: Omit<Account, 'id' | 'createdAt'>) => {
    try {
      if (editingAccount) {
        await api.put(`/accounts/${editingAccount.id}`, accountData);
      } else {
        await api.post('/accounts', accountData);
      }
      setEditingAccount(null);
      fetchAccounts(); // إعادة جلب البيانات بعد الحفظ
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await api.delete(`/accounts/${id}`);
        fetchAccounts(); // إعادة جلب البيانات بعد الحذف
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  // -- دالة لتغيير حالة الفرز --
  const handleSort = (column: keyof Account) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // -- دالة لعرض سهم الفرز --
  const renderSortArrow = (column: keyof Account) => {
    if (sortBy === column) {
      return sortOrder === 'asc' ? ' ▲' : ' ▼';
    }
    return '';
  };

  return (
    <div className="container">
      <h2>Accounts Management</h2>
      {error && <p className="error-message">{error}</p>}

      <h3>{editingAccount ? 'Edit Account' : 'Add New Account'}</h3>
      <AccountForm
        account={editingAccount}
        onSave={handleSave}
        onCancel={() => setEditingAccount(null)}
      />

      <hr style={{ margin: '2rem 0' }} />

      <h3>All Accounts</h3>
      <input
        type="text"
        placeholder="Search by name, code, or type..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', boxSizing: 'border-box' }}
      />
      
      {accounts.length === 0 ? (
        <p>No accounts found matching your criteria.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer', padding: '8px', border: '1px solid #ddd' }}>
                Name{renderSortArrow('name')}
              </th>
              <th onClick={() => handleSort('code')} style={{ cursor: 'pointer', padding: '8px', border: '1px solid #ddd' }}>
                Code{renderSortArrow('code')}
              </th>
              <th onClick={() => handleSort('type')} style={{ cursor: 'pointer', padding: '8px', border: '1px solid #ddd' }}>
                Type{renderSortArrow('type')}
              </th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{account.name}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{account.code}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{account.type}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  <button onClick={() => handleEdit(account)}>Edit</button>
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
