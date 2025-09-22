import { openDB, DBSchema } from 'idb';

// Define the database schema
interface AccountingDB extends DBSchema {
  accounts: {
    key: string;
    value: any;
    indexes: { 'by-code': string };
  };
  // Add other stores as needed
  customers: { key: string; value: any; };
  suppliers: { key: string; value: any; };
  items: { key: string; value: any; };
  sales: { key: string; value: any; };
  purchases: { key: string; value: any; };
  journal_entries: { key: string; value: any; };
}

// Open the database
const dbPromise = openDB<AccountingDB>('local-accounting-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('accounts')) {
      db.createObjectStore('accounts', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('customers')) {
      db.createObjectStore('customers', { keyPath: 'id', autoIncrement: true });
    }
    // ... create other stores
  },
});

// Generate a simple unique ID for local records
const generateLocalId = () => `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Create a generic local API
export const localApi = {
  async get(storeName: keyof AccountingDB) {
    return (await dbPromise).getAll(storeName);
  },
  async post(storeName: keyof AccountingDB, data: any) {
    const id = generateLocalId();
    const record = { ...data, id };
    await (await dbPromise).put(storeName, record);
    return record;
  },
  async put(storeName: keyof AccountingDB, id: string, data: any) {
    const record = { ...data, id };
    await (await dbPromise).put(storeName, record);
    return record;
  },
  async delete(storeName: keyof AccountingDB, id: string) {
    await (await dbPromise).delete(storeName, id);
    return { id };
  },
};
