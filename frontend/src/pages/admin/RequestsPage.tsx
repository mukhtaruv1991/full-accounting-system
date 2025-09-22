import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../api/api';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, CircularProgress, Alert, Chip
} from '@mui/material';

interface JoinRequest {
  id: string;
  user: { id: string; name: string; email: string; };
  role: 'admin' | 'member' | 'customer' | 'supplier';
  status: 'pending' | 'approved' | 'rejected';
}

const RequestsPage: React.FC = () => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get('/company/join-requests');
      setRequests(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch join requests.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleRequest = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      await api.put(`/company/join-requests/${requestId}`, { status });
      // Refresh the list after action
      fetchRequests();
    } catch (err: any) {
      setError(err.message || `Failed to ${status} request.`);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const pendingRequests = requests.filter(r => r.status === 'pending');

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>{t('join_requests')}</Typography>
      {pendingRequests.length === 0 ? (
        <Typography>{t('no_pending_requests')}</Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('user_name')}</TableCell>
                <TableCell>{t('email')}</TableCell>
                <TableCell>{t('requested_role')}</TableCell>
                <TableCell align="center">{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.user.name}</TableCell>
                  <TableCell>{request.user.email}</TableCell>
                  <TableCell><Chip label={request.role} size="small" /></TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => handleRequest(request.id, 'approved')}
                    >
                      {t('approve')}
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleRequest(request.id, 'rejected')}
                    >
                      {t('reject')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default RequestsPage;
