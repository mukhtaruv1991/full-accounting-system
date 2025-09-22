import { openDB, DBSchema } from 'idb';

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

// A type for the names of our object stores
type StoreName = keyof AccountingDB;

// Open the database
export const dbPromise = openDB<AccountingDB>('full-accounting-db', 1, {
  upgrade(db) {
    const stores: StoreName[] = ['accounts', 'customers', 'suppliers', 'items', 'sales', 'purchases', 'journal_entries'];
    
    stores.forEach(storeName => {
      // The fix is here: We ensure storeName is treated as a valid store name.
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' });
      }
    });
  },
});
