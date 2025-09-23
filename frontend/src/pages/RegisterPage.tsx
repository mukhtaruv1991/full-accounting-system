import React, { useState } from 'react';
import { api } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography, Paper, Grid, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';

type AccountType = 'admin' | 'manager' | 'normal';

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState<AccountType>('admin');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    companyName: '',
    companyAddress: '',
    companyPhone: '',
    companyIdToJoin: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAccountTypeChange = (e: SelectChangeEvent<AccountType>) => {
    setAccountType(e.target.value as AccountType);
    // Reset specific fields when type changes
    setFormData(prev => ({
      ...prev,
      companyName: '',
      companyAddress: '',
      companyPhone: '',
      companyIdToJoin: '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      // We will build the backend logic for this in the next step
      // For now, we simulate success
      console.log("Submitting registration data:", { accountType, ...formData });
      // await api.post('/auth/register-v2', { accountType, ...formData });
      setSuccess('Registration request sent! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">{t('register_new_account')}</Typography>
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
        {success && <Typography color="success.main" sx={{ mt: 1 }}>{success}</Typography>}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid xs={12}>
              <FormControl fullWidth>
                <InputLabel>{t('account_type')}</InputLabel>
                <Select
                  value={accountType}
                  label={t('account_type')}
                  onChange={handleAccountTypeChange}
                >
                  <MenuItem value="admin">{t('admin_owner')}</MenuItem>
                  <MenuItem value="manager">{t('manager_employee')}</MenuItem>
                  <MenuItem value="normal">{t('normal_user')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Common Fields */}
            <Grid xs={12} sm={6}>
              <TextField name="name" label={t('your_name')} value={formData.name} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField name="phone" label={t('your_phone')} value={formData.phone} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid xs={12}>
              <TextField name="email" label={t('email')} type="email" value={formData.email} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid xs={12}>
              <TextField name="password" label={t('password')} type="password" value={formData.password} onChange={handleChange} fullWidth required />
            </Grid>

            {/* Admin Fields */}
            {accountType === 'admin' && (
              <>
                <Grid xs={12}>
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>{t('company_details')}</Typography>
                </Grid>
                <Grid xs={12}>
                  <TextField name="companyName" label={t('company_name')} value={formData.companyName} onChange={handleChange} fullWidth required />
                </Grid>
                <Grid xs={12}>
                  <TextField name="companyAddress" label={t('company_address')} value={formData.companyAddress} onChange={handleChange} fullWidth />
                </Grid>
                <Grid xs={12}>
                  <TextField name="companyPhone" label={t('company_phone')} value={formData.companyPhone} onChange={handleChange} fullWidth />
                </Grid>
              </>
            )}

            {/* Manager Fields */}
            {accountType === 'manager' && (
              <Grid xs={12}>
                <TextField name="companyIdToJoin" label={t('company_id_to_join')} value={formData.companyIdToJoin} onChange={handleChange} fullWidth required helperText={t('ask_admin_for_id')} />
              </Grid>
            )}
          </Grid>
          
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            {t('register')}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography variant="body2">{t('have_account_login')}</Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
