import React, { useEffect, useState, useCallback } from 'react';
import { localApi } from '../../api/localApi';
import AccountForm from '../../components/accounts/AccountForm';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Accounts Management (Local)
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {!isFormVisible && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => { setEditingAccount(null); setIsFormVisible(true); }}
          sx={{ mb: 2 }}
        >
          Add New Account
        </Button>
      )}

      {isFormVisible && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {editingAccount ? 'Edit Account' : 'Add New Account'}
          </Typography>
          <AccountForm
            account={editingAccount}
            onSave={handleSave}
            onCancel={() => setIsFormVisible(false)}
          />
        </Paper>
      )}

      <Typography variant="h5" component="h2" gutterBottom>
        All Accounts
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No accounts found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>{account.code}</TableCell>
                  <TableCell>{account.type}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => { setEditingAccount(account); setIsFormVisible(true); }} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(account.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AccountsPage;
