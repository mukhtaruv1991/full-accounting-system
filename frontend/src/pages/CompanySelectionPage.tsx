import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Button, Container, Typography, Paper, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useTranslation } from 'react-i18next';

const CompanySelectionPage: React.FC = () => {
  const { t } = useTranslation();
  const { userMemberships, selectCompany, logout } = useAuth();

  if (!userMemberships || userMemberships.length === 0) {
    return (
      <Container>
        <Typography>No company memberships found. Please contact support.</Typography>
        <Button onClick={logout}>Logout</Button>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {t('select_company')}
        </Typography>
        <List>
          {userMemberships.map((membership) => (
            <ListItem key={membership.company.id} disablePadding>
              <ListItemButton onClick={() => selectCompany(membership.company.id)}>
                <ListItemText primary={membership.company.name} secondary={`Your role: ${membership.role}`} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Button onClick={logout} sx={{ mt: 2 }}>{t('logout')}</Button>
      </Paper>
    </Container>
  );
};

export default CompanySelectionPage;
