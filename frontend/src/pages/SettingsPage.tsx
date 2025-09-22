import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../api/api';
import { localApi } from '../api/localApi';
import { Box, Typography, Paper, Button, CircularProgress, Alert, List, ListItem, ListItemText } from '@mui/material';
import * as crypto from 'crypto-browserify';

interface FoundUser {
  id: string;
  name: string;
  phone: string;
}

// Polyfill for crypto if not available
const getCrypto = () => {
  return window.crypto || (window as any).msCrypto || crypto;
};

const hashPhoneNumber = async (phone: string): Promise<string> => {
  const cryptoImpl = getCrypto();
  const msgUint8 = new TextEncoder().encode(phone);
  const hashBuffer = await cryptoImpl.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [foundUsers, setFoundUsers] = useState<FoundUser[]>([]);
  const [isSyncDone, setIsSyncDone] = useState(false);

  const handleSyncContacts = async () => {
    if (!('contacts' in navigator && 'select' in (navigator as any).contacts)) {
      setError('Contact Picker API is not supported on this browser.');
      return;
    }

    setLoading(true);
    setError('');
    setFoundUsers([]);
    setIsSyncDone(false);

    try {
      const contacts = await (navigator as any).contacts.select(['name', 'tel'], { multiple: true });
      if (contacts.length === 0) {
        setError('No contacts selected.');
        setLoading(false);
        return;
      }

      const phoneNumbers = contacts.flatMap((contact: any) => contact.tel || []);
      const hashedPhones = await Promise.all(phoneNumbers.map((phone: string) => hashPhoneNumber(phone.replace(/\s+/g, ''))));
      
      const matchedUsers = await api.post('/users/sync-contacts', { hashedPhones });
      
      setFoundUsers(matchedUsers);

      // Save matched users to local DB
      const db = await localApi.getDb();
      const tx = db.transaction('friends', 'readwrite');
      for (const user of matchedUsers) {
        await tx.store.put({ ...user, isFriend: true });
      }
      await tx.done;

    } catch (err: any) {
      setError(err.message || 'Failed to sync contacts.');
    } finally {
      setLoading(false);
      setIsSyncDone(true);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>{t('settings')}</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Contact Synchronization</Typography>
        <Button variant="contained" onClick={handleSyncContacts} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Sync Contacts'}
        </Button>
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          Find friends who are already using the app. Your contacts are hashed on your device for privacy.
        </Typography>
      </Box>

      {isSyncDone && (
        <Box>
          <Typography variant="h6">Found {foundUsers.length} Friends:</Typography>
          {foundUsers.length > 0 ? (
            <List>
              {foundUsers.map(user => (
                <ListItem key={user.id}>
                  <ListItemText primary={user.name} secondary={user.phone} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No contacts found on the platform.</Typography>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default SettingsPage;
