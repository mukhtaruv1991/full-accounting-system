import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Define the database schema
interface AccountingDB extends DBSchema {
  accounts: { key: string; value: any; };
  customers: { key: string; value: any; };
  suppliers: { key: string; value: any; };
  items: { key: string; value: any; };
  sales: { key: string; value: any; };
  purchases: { key: string; value: any; };
  journal_entries: { key: string; value: any; };
}

// Open the database
export const dbPromise = openDB<AccountingDB>('full-accounting-db', 1, {
  upgrade(db: IDBPDatabase<AccountingDB>) {
    // Explicitly create each object store. This is the most robust way.
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
    if (!db.objectStoreNames.contains('sales')) {
      db.createObjectStore('sales', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('purchases')) {
      db.createObjectStore('purchases', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('journal_entries')) {
      db.createObjectStore('journal_entries', { keyPath: 'id' });
    }
  },
});
