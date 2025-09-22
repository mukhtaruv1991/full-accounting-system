import { openDB, DBSchema } from 'idb';

// Define the complete database schema
interface AccountingDB extends DBSchema {
  accounts: { key: string; value: any; };
  customers: { key: string; value: any; };
  suppliers: { key: string; value: any; };
  items: { key: string; value: any; };
  sales: { key: string; value: any; };
  purchases: { key: string; value: any; };
  journal_entries: { key: string; value: any; };
}

// Open the database with all object stores
export const dbPromise = openDB<AccountingDB>('full-accounting-db', 1, {
  upgrade(db) {
    const stores: (keyof AccountingDB)[] = ['accounts', 'customers', 'suppliers', 'items', 'sales', 'purchases', 'journal_entries'];
    stores.forEach(storeName => {
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' });
      }
    });
  },
});
