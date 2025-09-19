import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const PurchasesPage: React.FC = () => {
  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          فواتير المشتريات
        </Typography>
        <Typography variant="body1">
          هنا ستظهر قائمة فواتير المشتريات وأزرار الإضافة.
        </Typography>
      </Box>
    </Container>
  );
};

export default PurchasesPage;
