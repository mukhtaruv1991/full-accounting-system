import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const ItemsPage: React.FC = () => {
  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          إدارة الأصناف
        </Typography>
        <Typography variant="body1">
          هنا ستظهر قائمة الأصناف وأزرار الإضافة والتعديل.
        </Typography>
      </Box>
    </Container>
  );
};

export default ItemsPage;
