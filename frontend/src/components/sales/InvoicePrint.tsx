import React from 'react';
import { Box, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import QRCode from 'qrcode.react';

// --- Interfaces ---
interface Contact { id: string; name: string; }
interface InvoiceItem { id: string; itemId: string; name: string; quantity: number; price: number; total: number; }
interface InvoicePrintProps {
  invoiceType: 'sale' | 'purchase';
  contact: Contact | null;
  items: InvoiceItem[];
  subtotal: number;
  invoiceNumber: string;
}

export const InvoicePrint = React.forwardRef<HTMLDivElement, InvoicePrintProps>((props, ref) => {
  const { invoiceType, contact, items, subtotal, invoiceNumber } = props;

  const qrCodeValue = JSON.stringify({
    type: invoiceType,
    contactId: contact?.id,
    items: items.map(({ name, quantity, price }) => ({ name, quantity, price })),
    totalAmount: subtotal,
    date: new Date().toISOString(),
  });

  return (
    <div ref={ref} style={{ padding: '20px', color: 'black', backgroundColor: 'white' }}>
      <Box sx={{ p: 4 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4" component="h1" gutterBottom>
              {invoiceType === 'sale' ? 'INVOICE' : 'PURCHASE ORDER'}
            </Typography>
            <Typography variant="body2">Invoice #: {invoiceNumber}</Typography>
            <Typography variant="body2">Date: {new Date().toLocaleDateString()}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6">Your Company</Typography>
            <Typography>123 Business Rd.</Typography>
            <Typography>Business City, 12345</Typography>
          </Grid>
        </Grid>

        <Box sx={{ my: 4 }}>
          <Typography variant="h6">Bill To:</Typography>
          <Typography>{contact?.name || 'N/A'}</Typography>
        </Box>

        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">{item.price.toFixed(2)}</TableCell>
                  <TableCell align="right">{item.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <Typography variant="h6">Subtotal: {subtotal.toFixed(2)}</Typography>
          <Typography variant="h5" sx={{ mt: 1 }}>Total: {subtotal.toFixed(2)}</Typography>
        </Box>

        <Box sx={{ mt: 5, pt: 3, borderTop: '1px solid #eee', textAlign: 'center' }}>
          <Typography variant="body2" gutterBottom>Scan to import this invoice</Typography>
          <QRCode value={qrCodeValue} size={128} />
        </Box>
      </Box>
    </div>
  );
});
