import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { localApi } from '../../api/localApi';
import JournalEntryForm from '../../components/journal-entries/JournalEntryForm';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface JournalEntry { id: string; date: string; description: string; debitAccountId: string; creditAccountId: string; amount: number; }
interface Account { id: string; name: string; }

const JournalEntriesPage: React.FC = () => {
  const { t } = useTranslation();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [error, setError] = useState('');

  const fetchEntries = useCallback(async () => {
    try {
      const data = await localApi.get('journal_entries');
      setEntries(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch journal entries');
    }
  }, []);

  const fetchAccounts = useCallback(async () => {
    try {
      const data = await localApi.get('accounts');
      setAccounts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch accounts');
    }
  }, []);

  useEffect(() => {
    fetchEntries();
    fetchAccounts();
  }, [fetchEntries, fetchAccounts]);

  const handleSave = async (entryData: Omit<JournalEntry, 'id'>) => {
    try {
      if (editingEntry) {
        await localApi.put('journal_entries', editingEntry.id, entryData);
      } else {
        await localApi.post('journal_entries', entryData);
      }
      setIsFormVisible(false);
      setEditingEntry(null);
      fetchEntries();
    } catch (err: any) { setError(err.message); }
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setIsFormVisible(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('confirm_delete'))) {
      try {
        await localApi.delete('journal_entries', id);
        fetchEntries();
      } catch (err: any) { setError(err.message); }
    }
  };

  const getAccountName = (accountId: string) => accounts.find(a => a.id === accountId)?.name || accountId;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>{t('journal_entries_management')}</Typography>
      {error && <Typography color="error">{error}</Typography>}

      {!isFormVisible && (
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditingEntry(null); setIsFormVisible(true); }} sx={{ mb: 2 }}>
          {t('add_new_journal_entry')}
        </Button>
      )}

      {isFormVisible && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6">{editingEntry ? t('edit_journal_entry') : t('add_new_journal_entry')}</Typography>
          <JournalEntryForm entry={editingEntry} accounts={accounts} onSave={handleSave} onCancel={() => setIsFormVisible(false)} />
        </Box>
      )}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('date')}</TableCell>
                <TableCell>{t('description')}</TableCell>
                <TableCell>{t('debit_account')}</TableCell>
                <TableCell>{t('credit_account')}</TableCell>
                <TableCell align="right">{t('debit_amount')}</TableCell>
                <TableCell align="right">{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id} hover>
                  <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell>{getAccountName(entry.debitAccountId)}</TableCell>
                  <TableCell>{getAccountName(entry.creditAccountId)}</TableCell>
                  <TableCell align="right">{entry.amount.toFixed(2)}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(entry)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(entry.id)} color="error"><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {entries.length === 0 && <Typography sx={{ p: 2, textAlign: 'center' }}>{t('no_journal_entries_found')}</Typography>}
      </Paper>
    </Box>
  );
};

export default JournalEntriesPage;
