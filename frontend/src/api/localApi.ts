import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { v4 as uuidv4 } from 'uuid';

// Define the database schema
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
          const objectStoreNames: StoreName[] = ['accounts', 'customers', 'suppliers', 'items', 'sales', 'purchases', 'journal_entries', 'friends'];
          
          objectStoreNames.forEach(storeName => {
            if (!db.objectStoreNames.contains(storeName as any)) {
              db.createObjectStore(storeName as any, { keyPath: 'id' });
            }
          });
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

  async get(storeName: StoreName) { const db = await this.getDb(); return db.getAll(storeName as any); }
  async getById(storeName: StoreName, key: string) { const db = await this.getDb(); return db.get(storeName as any, key); }
  async post(storeName: StoreName, value: any) { const db = await this.getDb(); return db.add(storeName as any, { ...value, id: value.id || uuidv4() }); }
  async put(storeName: StoreName, key: string, value: any) { const db = await this.getDb(); return db.put(storeName as any, { ...value, id: key }); }
  async delete(storeName: StoreName, key: string) { const db = await this.getDb(); return db.delete(storeName as any, key); }
}

export const localApi = new LocalApi();
