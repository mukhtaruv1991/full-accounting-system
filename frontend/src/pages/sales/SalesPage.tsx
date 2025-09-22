import React from 'react';
import { Box, Typography } from '@mui/material';
import InvoiceForm from '../../components/invoices/InvoiceForm';

const SalesPage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Sales
      </Typography>
      <InvoiceForm invoiceType="sale" />
      {/* The list of saved sales invoices will be added here later */}
    </Box>
  );
};

export default SalesPage;
