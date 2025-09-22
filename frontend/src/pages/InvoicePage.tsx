import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';
import { localApi } from '../api/localApi';
import { InvoicePrint } from '../components/sales/InvoicePrint';
import QrScanner from '../components/sales/QrScanner';
import {
  Box, Typography, Button, Paper, Grid, TextField, Autocomplete,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
  Tabs, Tab, Alert, FormControl, InputLabel, Select, MenuItem, Modal, Tooltip, Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import InfoIcon from '@mui/icons-material/Info';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode.react';

// --- Interfaces ---
interface Contact { id: string; name: string; }
interface Item { id: string; name: string; price: number; cost: number; quantity: number; }
interface Invoice { id: string; date: string; contactId: string; totalAmount: number; type: InvoiceType; items: InvoiceItem[]; }
interface InvoiceItem { id: string; itemId: string; name: string; quantity: number; price: number; total: number; }
type InvoiceType = 'sale' | 'purchase';

// --- Smart Pricing Hint ---
interface PriceHint {
  text: string;
  type: 'info' | 'warning' | 'success';
}

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
  const [priceHints, setPriceHints] = useState<Record<string, PriceHint | null>>({});
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
    } catch (err: any) { setError(err.message); }
  }, [invoiceType]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // --- Smart Price Hint Logic ---
  const checkPriceHistory = useCallback(async (itemId: string, currentPrice: number) => {
    if (!selectedContactId) return;

    const relevantInvoices = (invoiceType === 'sale' ? invoices.filter(inv => inv.type === 'sale') : invoices.filter(inv => inv.type === 'purchase'))
      .filter(inv => inv.contactId === selectedContactId);

    const historyForItem = relevantInvoices
      .flatMap(inv => inv.items)
      .filter(item => item.itemId === itemId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (historyForItem.length > 0) {
      const lastPrice = historyForItem[0].price;
      if (currentPrice > lastPrice) {
        setPriceHints(prev => ({ ...prev, [itemId]: { text: `Last price was ${lastPrice.toFixed(2)}. Current is higher.`, type: 'warning' } }));
      } else if (currentPrice < lastPrice) {
        setPriceHints(prev => ({ ...prev, [itemId]: { text: `Last price was ${lastPrice.toFixed(2)}. Good deal!`, type: 'success' } }));
      } else {
        setPriceHints(prev => ({ ...prev, [itemId]: null }));
      }
    } else {
      setPriceHints(prev => ({ ...prev, [itemId]: { text: 'First time transaction with this contact.', type: 'info' } }));
    }
  }, [invoices, selectedContactId, invoiceType]);

  // --- Invoice Items Logic ---
  const handleAddItem = (item: Item | null) => {
    if (item && !invoiceItems.find(i => i.itemId === item.id)) {
      const price = invoiceType === 'sale' ? item.price : item.cost;
      const newItem: InvoiceItem = {
        id: uuidv4(),
        itemId: item.id,
        name: item.name,
        quantity: 1,
        price: price,
        total: price,
      };
      setInvoiceItems([...invoiceItems, newItem]);
      checkPriceHistory(item.id, price);
    }
  };

  const handleItemChange = (id: string, field: 'quantity' | 'price', value: number) => {
    setInvoiceItems(invoiceItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        updatedItem.total = updatedItem.quantity * updatedItem.price;
        if (field === 'price') {
          checkPriceHistory(item.itemId, value);
        }
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
    setPriceHints({});
    setError('');
    setSuccess('');
  };

  // --- QR and Print Logic ---
  const handlePrint = useReactToPrint({ content: () => printComponentRef.current });
  const handleScanSuccess = (decodedText: string) => { /* ... (logic remains the same) ... */ };

  // --- Main Save Logic ---
  const handleSaveInvoice = async () => { /* ... (logic remains the same) ... */ };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>{t('invoices')}</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper sx={{ p: 2, mb: 4 }}>
        {/* ... (Header and Tabs remain the same) ... */}
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
                  <TableCell>
                    {invoiceItem.name}
                    {priceHints[invoiceItem.itemId] && (
                      <Tooltip title={priceHints[invoiceItem.itemId]?.text || ''}>
                        <Chip 
                          icon={<InfoIcon />} 
                          label={priceHints[invoiceItem.itemId]?.type}
                          size="small" 
                          color={priceHints[invoiceItem.itemId]?.type}
                          sx={{ ml: 1 }}
                        />
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell align="right"><TextField type="number" value={invoiceItem.quantity} onChange={(e) => handleItemChange(invoiceItem.id, 'quantity', parseFloat(e.target.value) || 0)} size="small" sx={{ width: '80px' }} /></TableCell>
                  <TableCell align="right"><TextField type="number" value={invoiceItem.price} onChange={(e) => handleItemChange(invoiceItem.id, 'price', parseFloat(e.target.value) || 0)} size="small" sx={{ width: '100px' }} /></TableCell>
                  <TableCell align="right">{invoiceItem.total.toFixed(2)}</TableCell>
                  <TableCell align="right"><IconButton onClick={() => handleRemoveItem(invoiceItem.id)} color="error"><DeleteIcon /></IconButton></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* ... (Autocomplete and Footer remain the same) ... */}
      </Paper>
      {/* ... (Modals and Recent Invoices table remain the same) ... */}
    </Box>
  );
};

export default InvoicePage;
