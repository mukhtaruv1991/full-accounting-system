import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const CustomersPage: React.FC = () => {
  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          إدارة العملاء
        </Typography>
        <Typography variant="body1">
          هنا ستظهر قائمة العملاء وأزرار الإضافة والتعديل.
        </Typography>
      </Box>
    </Container>
  );
};

export default CustomersPage;
