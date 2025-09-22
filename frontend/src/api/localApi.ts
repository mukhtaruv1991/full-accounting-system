import { openDB, IDBPDatabase } from 'idb';

// Define the shape of our database
export interface AccountingDB {
  accounts: { id: string; name: string; code: string; type: string; companyId: string; };
  customers: { id: string; name: string; accountId: string; companyId: string; };
  suppliers: { id: string; name: string; accountId: string; companyId: string; };
  items: { id: string; name: string; quantity: number; companyId: string; };
  sales: { id: string; date: string; contactId: string; total: number; items: any[]; companyId: string; };
  purchases: { id: string; date: string; contactId: string; total: number; items: any[]; companyId: string; };
  journal_entries: { id: string; date: string; description: string; amount: number; debitAccountId: string; creditAccountId: string; companyId: string; };
  notifications: { id: string; message: string; isRead: boolean; createdAt: string; companyId: string; };
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
    // For local-first, we can default to a 'local' companyId
    currentCompanyId = 'local';
  }
  return getDb(currentCompanyId);
};

export const localApi = {
  setCompanyId: (companyId: string | null) => {
    if (companyId !== currentCompanyId) {
      dbPromise = null;
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
    const item = { ...data, id, companyId: currentCompanyId };
    await db.put(storeName, item);
    return item;
  },
  put: async (storeName: keyof AccountingDB, id: string, data: any) => {
    const db = await getActiveDb();
    const item = { ...data, id, companyId: currentCompanyId };
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
  // New transactional method for complex operations
  performTransaction: async (actions: (tx: any) => Promise<void>) => {
    const db = await getActiveDb();
    const storeNames = db.objectStoreNames;
    const tx = db.transaction(storeNames, 'readwrite');
    try {
      await actions(tx);
      await tx.done;
    } catch (error) {
      tx.abort();
      console.error("Transaction failed:", error);
      throw error;
    }
  },
};
