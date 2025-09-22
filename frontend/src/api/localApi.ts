import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Define the database schema
export interface AccountingDB extends DBSchema {
  accounts: { key: string; value: any; };
  customers: { key: string; value: any; };
  suppliers: { key: string; value: any; };
  items: { key: string; value: any; };
  sales: { key: string; value: any; };
  purchases: { key: string; value: any; };
  journal_entries: { key: string; value: any; };
  friends: { key: string; value: any; }; // New store for synced contacts
}

// A type for the names of our object stores
type StoreName = keyof AccountingDB;

class LocalApi {
  private dbNamePrefix = 'accounting-app-';
  private companyId: string | null = 'default'; // Default to a local-only DB
  private dbPromise: Promise<IDBPDatabase<AccountingDB>> | null = null;

  constructor() {
    this.initDb();
  }

  private initDb() {
    if (typeof window !== 'undefined' && this.companyId) {
      const dbName = `${this.dbNamePrefix}${this.companyId}`;
      this.dbPromise = openDB<AccountingDB>(dbName, 1, {
        upgrade(db) {
          // Correctly typed array of store names
          const stores: StoreName[] = ['accounts', 'customers', 'suppliers', 'items', 'sales', 'purchases', 'journal_entries', 'friends'];
          stores.forEach(storeName => {
            if (!db.objectStoreNames.contains(storeName)) {
              db.createObjectStore(storeName, { keyPath: 'id' });
            }
          });
        },
      });
    }
  }

  setCompanyId(companyId: string | null) {
    if (this.companyId !== companyId) {
      this.companyId = companyId || 'default';
      this.initDb(); // Re-initialize the database connection for the new company
    }
  }

  async getDb(companyId?: string): Promise<IDBPDatabase<AccountingDB>> {
    if (companyId && this.companyId !== companyId) {
      this.setCompanyId(companyId);
    }
    if (!this.dbPromise) {
      this.initDb();
      if (!this.dbPromise) {
        throw new Error("Database could not be initialized.");
      }
    }
    return this.dbPromise;
  }

  // Generic methods
  async getAll(storeName: StoreName) { const db = await this.getDb(); return db.getAll(storeName); }
  async getById(storeName: StoreName, key: string) { const db = await this.getDb(); return db.get(storeName, key); }
  async add(storeName: StoreName, value: any) { const db = await this.getDb(); return db.add(storeName, { ...value, id: value.id || crypto.randomUUID() }); }
  async put(storeName: StoreName, value: any) { const db = await this.getDb(); return db.put(storeName, value); }
  async delete(storeName: StoreName, key: string) { const db = await this.getDb(); return db.delete(storeName, key); }
}

export const localApi = new LocalApi();
