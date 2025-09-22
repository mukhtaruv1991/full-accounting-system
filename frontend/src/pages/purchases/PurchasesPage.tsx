import React from 'react';
import { Box, Typography } from '@mui/material';
import InvoiceForm from '../../components/invoices/InvoiceForm';

const PurchasesPage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Purchases
      </Typography>
      <InvoiceForm invoiceType="purchase" />
      {/* The list of saved purchase invoices will be added here later */}
    </Box>
  );
};

export default PurchasesPage;
