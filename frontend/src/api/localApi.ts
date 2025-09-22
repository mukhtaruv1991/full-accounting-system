import { openDB, IDBPDatabase } from 'idb';

interface AccountingDB {
  accounts: any;
  customers: any;
  suppliers: any;
  items: any;
  sales: any;
  purchases: any;
  journal_entries: any;
  notifications: any; // Add notifications store
}

let dbPromise: Promise<IDBPDatabase<AccountingDB>> | null = null;
let currentCompanyId: string | null = null;

const getDb = (companyId: string): Promise<IDBPDatabase<AccountingDB>> => {
  if (dbPromise && currentCompanyId === companyId) {
    return dbPromise;
  }
  currentCompanyId = companyId;
  const dbName = `accounting-db-${companyId}`;
  dbPromise = openDB<AccountingDB>(dbName, 1, {
    upgrade(db) {
      const stores: (keyof AccountingDB)[] = ['accounts', 'customers', 'suppliers', 'items', 'sales', 'purchases', 'journal_entries', 'notifications'];
      stores.forEach(storeName => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      });
    },
  });
  return dbPromise;
};

const getActiveDb = async () => {
  if (!currentCompanyId) {
    const storedCompany = localStorage.getItem('selectedCompany');
    if (storedCompany) {
      currentCompanyId = JSON.parse(storedCompany).id;
    }
  }
  if (!currentCompanyId) {
    throw new Error("No company selected. Cannot access local database.");
  }
  return getDb(currentCompanyId);
};

export const localApi = {
  setCompanyId: (companyId: string | null) => {
    if (companyId !== currentCompanyId) {
      dbPromise = null; // Force re-initialization on next call
      currentCompanyId = companyId;
    }
  },
  get: async (storeName: keyof AccountingDB, id?: string) => {
    const db = await getActiveDb();
    if (id) {
      return db.get(storeName, id);
    }
    return db.getAll(storeName);
  },
  post: async (storeName: keyof AccountingDB, data: any) => {
    const db = await getActiveDb();
    const id = data.id || crypto.randomUUID();
    const item = { ...data, id };
    await db.put(storeName, item);
    return item;
  },
  put: async (storeName: keyof AccountingDB, id: string, data: any) => {
    const db = await getActiveDb();
    const item = { ...data, id };
    await db.put(storeName, item);
    return item;
  },
  delete: async (storeName: keyof AccountingDB, id: string) => {
    const db = await getActiveDb();
    await db.delete(storeName, id);
    return { id };
  },
  patch: async (storeName: keyof AccountingDB, id: string, data: Partial<any>) => {
    const db = await getActiveDb();
    const existing = await db.get(storeName, id);
    if (!existing) throw new Error("Item not found");
    const updated = { ...existing, ...data };
    await db.put(storeName, updated);
    return updated;
  },
};
