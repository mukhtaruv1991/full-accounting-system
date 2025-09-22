import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { localApi } from '../../api/localApi';
import AccountForm from '../../components/accounts/AccountForm';
import { Box, Typography, Button, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Account {
  id: string;
  name: string;
  code: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  isDebit: boolean;
  createdAt: string;
}

type SortableFields = keyof Account;

const AccountsPage: React.FC = () => {
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortableFields>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchAccounts = useCallback(async () => {
    try {
      const allAccounts: Account[] = await localApi.get('accounts');
      const filtered = allAccounts.filter(acc =>
        acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      filtered.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
      setAccounts(filtered);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch accounts');
    }
  }, [searchTerm, sortBy, sortOrder]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleSave = async (accountData: Omit<Account, 'id' | 'createdAt'>) => {
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
      setError(err.message);
    }
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setIsFormVisible(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('confirm_delete'))) {
      try {
        await localApi.delete('accounts', id);
        fetchAccounts();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleSort = (column: SortableFields) => {
    const isAsc = sortBy === column && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(column);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>{t('accounts_management')}</Typography>
      {error && <Typography color="error">{error}</Typography>}

      {!isFormVisible && (
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditingAccount(null); setIsFormVisible(true); }} sx={{ mb: 2 }}>
          {t('add_new_account')}
        </Button>
      )}

      {isFormVisible && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6">{editingAccount ? t('edit_account') : t('add_new_account')}</Typography>
          <AccountForm account={editingAccount} onSave={handleSave} onCancel={() => setIsFormVisible(false)} />
        </Box>
      )}

      <Paper>
        <Box sx={{ p: 2 }}>
          <TextField fullWidth variant="outlined" placeholder={t('search_accounts')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel active={sortBy === 'name'} direction={sortBy === 'name' ? sortOrder : 'asc'} onClick={() => handleSort('name')}>
                    {t('name')}
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel active={sortBy === 'code'} direction={sortBy === 'code' ? sortOrder : 'asc'} onClick={() => handleSort('code')}>
                    {t('code')}
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel active={sortBy === 'type'} direction={sortBy === 'type' ? sortOrder : 'asc'} onClick={() => handleSort('type')}>
                    {t('type')}
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id} hover>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>{account.code}</TableCell>
                  <TableCell>{account.type}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(account)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(account.id)} color="error"><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {accounts.length === 0 && <Typography sx={{ p: 2, textAlign: 'center' }}>{t('no_accounts_found')}</Typography>}
      </Paper>
    </Box>
  );
};

export default AccountsPage;
