import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../api/api';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

interface MembershipRequest {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const MembershipRequestsPage: React.FC = () => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState<MembershipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get('/memberships/requests');
      setRequests(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleUpdateRequest = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      await api.put(`/memberships/requests/${requestId}`, { status });
      // Refresh the list after update
      fetchRequests();
    } catch (err: any) {
      setError(err.message || 'Failed to update request');
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('membership_requests')}
      </Typography>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('user_name')}</TableCell>
                <TableCell>{t('user_email')}</TableCell>
                <TableCell>{t('request_date')}</TableCell>
                <TableCell>{t('status')}</TableCell>
                <TableCell align="right">{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">{t('no_pending_requests')}</TableCell>
                </TableRow>
              ) : (
                requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>{req.user.name}</TableCell>
                    <TableCell>{req.user.email}</TableCell>
                    <TableCell>{format(new Date(req.createdAt), 'PPpp')}</TableCell>
                    <TableCell>{t(req.status)}</TableCell>
                    <TableCell align="right">
                      {req.status === 'pending' && (
                        <Box>
                          <Button variant="contained" color="success" size="small" onClick={() => handleUpdateRequest(req.id, 'approved')} sx={{ mr: 1 }}>
                            {t('approve')}
                          </Button>
                          <Button variant="contained" color="error" size="small" onClick={() => handleUpdateRequest(req.id, 'rejected')}>
                            {t('reject')}
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default MembershipRequestsPage;
