import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface AccountingDB extends DBSchema {
  accounts: { key: string; value: any; };
  customers: { key: string; value: any; };
  suppliers: { key: string; value: any; };
  items: { key: string; value: any; };
  sales: { key: string; value: any; };
  purchases: { key: string; value: any; };
  journal_entries: { key: string; value: any; };
  friends: { key: string; value: any; };
}

type StoreName = keyof AccountingDB;

class LocalApi {
  private dbNamePrefix = 'accounting-app-';
  private companyId: string | null = 'default';
  private dbPromise: Promise<IDBPDatabase<AccountingDB>> | null = null;

  constructor() {
    this.initDb();
  }

  private initDb() {
    if (typeof window !== 'undefined' && this.companyId) {
      const dbName = `${this.dbNamePrefix}${this.companyId}`;
      this.dbPromise = openDB<AccountingDB>(dbName, 2, {
        upgrade(db) {
          // Final Fix: Create stores one by one to avoid any type inference issues.
          if (!db.objectStoreNames.contains('accounts')) db.createObjectStore('accounts', { keyPath: 'id' });
          if (!db.objectStoreNames.contains('customers')) db.createObjectStore('customers', { keyPath: 'id' });
          if (!db.objectStoreNames.contains('suppliers')) db.createObjectStore('suppliers', { keyPath: 'id' });
          if (!db.objectStoreNames.contains('items')) db.createObjectStore('items', { keyPath: 'id' });
          if (!db.objectStoreNames.contains('sales')) db.createObjectStore('sales', { keyPath: 'id' });
          if (!db.objectStoreNames.contains('purchases')) db.createObjectStore('purchases', { keyPath: 'id' });
          if (!db.objectStoreNames.contains('journal_entries')) db.createObjectStore('journal_entries', { keyPath: 'id' });
          if (!db.objectStoreNames.contains('friends')) db.createObjectStore('friends', { keyPath: 'id' });
        },
      });
    }
  }

  setCompanyId(companyId: string | null) {
    if (this.companyId !== companyId) {
      this.companyId = companyId || 'default';
      this.initDb();
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

  async get(storeName: StoreName) { const db = await this.getDb(); return db.getAll(storeName); }
  async getById(storeName: StoreName, key: string) { const db = await this.getDb(); return db.get(storeName, key); }
  async post(storeName: StoreName, value: any) { const db = await this.getDb(); return db.add(storeName, { ...value, id: value.id || crypto.randomUUID() }); }
  async put(storeName: StoreName, key: string, value: any) { const db = await this.getDb(); return db.put(storeName, { ...value, id: key }); }
  async delete(storeName: StoreName, key: string) { const db = await this.getDb(); return db.delete(storeName, key); }
}

export const localApi = new LocalApi();
