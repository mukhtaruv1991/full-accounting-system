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

// A type for the names of our object stores
type StoreName = keyof AccountingDB;

// Open the database
export const dbPromise = openDB<AccountingDB>('full-accounting-db', 1, {
  upgrade(db: IDBPDatabase<AccountingDB>) {
    const stores: StoreName[] = ['accounts', 'customers', 'suppliers', 'items', 'sales', 'purchases', 'journal_entries'];
    
    stores.forEach(storeName => {
      // The definitive fix: Explicitly check if the store name is a valid key.
      // This satisfies the strict type checking during the build process.
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' });
      }
    });
  },
});
