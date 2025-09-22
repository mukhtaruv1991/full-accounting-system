import { openDB, DBSchema } from 'idb';

// Define the database schema
interface AccountingDB extends DBSchema {
  accounts: {
    key: string;
    value: any;
  };
  customers: { key: string; value: any; };
  suppliers: { key: string; value: any; };
  items: { key: string; value: any; };
  sales: { key: string; value: any; };
  purchases: { key: string; value: any; };
  journal_entries: { key: string; value: any; };
  // We can add more stores like 'settings' later
}

// Open the database
export const dbPromise = openDB<AccountingDB>('full-accounting-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('accounts')) {
      db.createObjectStore('accounts', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('customers')) {
      db.createObjectStore('customers', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('suppliers')) {
      db.createObjectStore('suppliers', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('items')) {
      db.createObjectStore('items', { keyPath: 'id' });
    }
    // Add other stores as needed...
  },
});
