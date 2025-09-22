import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';
import { localApi } from '../api/localApi';
import { InvoicePrint } from '../components/sales/InvoicePrint';
import QrScanner from '../components/sales/QrScanner';
import {
  Box, Typography, Button, Paper, Grid, TextField, Autocomplete,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
  Tabs, Tab, Alert, FormControl, InputLabel, Select, MenuItem, Modal
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode.react';

// --- Interfaces ---
interface Contact { id: string; name: string; }
interface Item { id: string; name: string; price: number; cost: number; quantity: number; }
interface Invoice { id: string; date: string; contactId: string; totalAmount: number; type: InvoiceType; items: InvoiceItem[]; }
interface InvoiceItem { id: string; itemId: string; name: string; quantity: number; price: number; total: number; }
type InvoiceType = 'sale' | 'purchase';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
};

const InvoicePage: React.FC = () => {
  const { t } = useTranslation();
  const [invoiceType, setInvoiceType] = useState<InvoiceType>('sale');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string>('');
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isScannerOpen, setScannerOpen] = useState(false);
  const printComponentRef = useRef<HTMLDivElement>(null);

  // --- Data Fetching ---
  const fetchAllData = useCallback(async () => {
    try {
      const contactStore = invoiceType === 'sale' ? 'customers' : 'suppliers';
      const [contactsData, itemsData, salesData, purchasesData] = await Promise.all([
        localApi.get(contactStore),
        localApi.get('items'),
        localApi.get('sales'),
        localApi.get('purchases'),
      ]);
      setContacts(contactsData);
      setItems(itemsData);
      setInvoices([...salesData, ...purchasesData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (err: any) {
      setError(err.message);
    }
  }, [invoiceType]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // --- Invoice Items Logic ---
  const handleAddItem = (item: Item | null) => {
    if (item && !invoiceItems.find(i => i.itemId === item.id)) {
      const newItem: InvoiceItem = {
        id: uuidv4(),
        itemId: item.id,
        name: item.name,
        quantity: 1,
        price: invoiceType === 'sale' ? item.price : item.cost,
        total: invoiceType === 'sale' ? item.price : item.cost,
      };
      setInvoiceItems([...invoiceItems, newItem]);
    }
  };

  const handleItemChange = (id: string, field: 'quantity' | 'price', value: number) => {
    setInvoiceItems(invoiceItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        updatedItem.total = updatedItem.quantity * updatedItem.price;
        return updatedItem;
      }
      return item;
    }));
  };

  const handleRemoveItem = (id: string) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== id));
  };

  const subtotal = invoiceItems.reduce((acc, item) => acc + item.total, 0);

  const resetForm = () => {
    setSelectedContactId('');
    setInvoiceItems([]);
    setError('');
    setSuccess('');
  };

  // --- QR Code Scan Logic ---
  const handleScanSuccess = (decodedText: string) => {
    try {
      const importedInvoice = JSON.parse(decodedText);
      // Basic validation
      if (importedInvoice.type && importedInvoice.contactId && Array.isArray(importedInvoice.items)) {
        setInvoiceType(importedInvoice.type);
        setSelectedContactId(importedInvoice.contactId);
        const newInvoiceItems = importedInvoice.items.map((item: any) => ({
          ...item,
          id: uuidv4(),
          total: item.quantity * item.price,
        }));
        setInvoiceItems(newInvoiceItems);
        setSuccess('Invoice data imported successfully! Review and save.');
      } else {
        throw new Error('Invalid QR code data format.');
      }
    } catch (e) {
      setError('Failed to parse QR code. Invalid data.');
    }
    setScannerOpen(false);
  };

  // --- Print Logic ---
  const handlePrint = useReactToPrint({
    content: () => printComponentRef.current,
  });

  // --- Main Save Logic ---
  const handleSaveInvoice = async () => {
    // ... (save logic remains the same)
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>{t('invoices')}</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper sx={{ p: 2, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" gutterBottom>{t('new_invoice')}</Typography>
          <Button variant="outlined" startIcon={<QrCodeScannerIcon />} onClick={() => setScannerOpen(true)}>
            Scan Invoice
          </Button>
        </Box>
        {/* ... Rest of the form ... */}
        <Tabs value={invoiceType} onChange={(e, newValue) => { setInvoiceType(newValue); resetForm(); }} sx={{ mb: 2 }}>
          <Tab label={t('sales')} value="sale" />
          <Tab label={t('purchases')} value="purchase" />
        </Tabs>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>{invoiceType === 'sale' ? t('customer') : t('supplier')}</InputLabel>
              <Select
                value={selectedContactId}
                label={invoiceType === 'sale' ? t('customer') : t('supplier')}
                onChange={(e) => setSelectedContactId(e.target.value)}
              >
                {contacts.map((contact) => (
                  <MenuItem key={contact.id} value={contact.id}>{contact.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label={t('date')} type="date" defaultValue={new Date().toISOString().split('T')[0]} fullWidth variant="outlined" InputLabelProps={{ shrink: true }} />
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom>{t('items')}</Typography>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('name')}</TableCell>
                <TableCell align="right">{t('quantity')}</TableCell>
                <TableCell align="right">{t('price')}</TableCell>
                <TableCell align="right">{t('total')}</TableCell>
                <TableCell align="right">{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoiceItems.map((invoiceItem) => (
                <TableRow key={invoiceItem.id}>
                  <TableCell>{invoiceItem.name}</TableCell>
                  <TableCell align="right"><TextField type="number" value={invoiceItem.quantity} onChange={(e) => handleItemChange(invoiceItem.id, 'quantity', parseFloat(e.target.value) || 0)} size="small" sx={{ width: '80px' }} /></TableCell>
                  <TableCell align="right"><TextField type="number" value={invoiceItem.price} onChange={(e) => handleItemChange(invoiceItem.id, 'price', parseFloat(e.target.value) || 0)} size="small" sx={{ width: '100px' }} /></TableCell>
                  <TableCell align="right">{invoiceItem.total.toFixed(2)}</TableCell>
                  <TableCell align="right"><IconButton onClick={() => handleRemoveItem(invoiceItem.id)} color="error"><DeleteIcon /></IconButton></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ my: 2 }}>
          <Autocomplete
            options={items}
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) => handleAddItem(newValue)}
            renderInput={(params) => <TextField {...params} label={t('add_item')} variant="outlined" />}
            value={null}
          />
        </Box>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{t('subtotal')}: {subtotal.toFixed(2)}</Typography>
          <Box>
            <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint} sx={{ mr: 2 }}>
              Print
            </Button>
            <Button variant="contained" color="primary" onClick={handleSaveInvoice}>{t('save_invoice')}</Button>
          </Box>
        </Box>
      </Paper>

      {/* QR Code Scanner Modal */}
      <Modal open={isScannerOpen} onClose={() => setScannerOpen(false)}>
        <Box sx={modalStyle}>
          <QrScanner onScanSuccess={handleScanSuccess} onScanFailure={(err) => setError(err)} />
        </Box>
      </Modal>

      {/* Hidden component for printing */}
      <div style={{ display: 'none' }}>
        <InvoicePrint 
          ref={printComponentRef} 
          invoiceType={invoiceType}
          contact={contacts.find(c => c.id === selectedContactId) || null}
          items={invoiceItems}
          subtotal={subtotal}
          invoiceNumber={uuidv4().substring(0, 8)}
        />
      </div>
      
      <Typography variant="h5" component="h2" gutterBottom>{t('recent_invoices')}</Typography>
      {/* Invoice list table remains the same */}
    </Box>
  );
};

export default InvoicePage;
