import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, List, ListItem, ListItemButton, ListItemText, CircularProgress, Box, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';

const SelectCompanyPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, selectCompany, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If there's only one company, select it automatically
    if (user && user.memberships.length === 1) {
      selectCompany(user.memberships[0].company.id);
      navigate('/dashboard', { replace: true });
    }
  }, [user, selectCompany, navigate]);

  const handleSelectCompany = (companyId: string) => {
    selectCompany(companyId);
    navigate('/dashboard', { replace: true });
  };

  if (loading || !user) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  }

  if (user.memberships.length === 0) {
    return (
      <Container maxWidth="sm">
        <Alert severity="warning" sx={{ mt: 8 }}>
          You are not a member of any company. You can work locally or request to join a company.
        </Alert>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          {t('select_company')}
        </Typography>
        <List>
          {user.memberships.map((membership) => (
            <ListItem key={membership.company.id} disablePadding>
              <ListItemButton onClick={() => handleSelectCompany(membership.company.id)}>
                <ListItemText primary={membership.company.name} secondary={`Your role: ${membership.role}`} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default SelectCompanyPage;
