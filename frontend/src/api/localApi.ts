import { dbPromise } from './db';

type StoreName = 'accounts' | 'customers' | 'suppliers' | 'items' | 'sales' | 'purchases' | 'journal_entries';

// Generate a simple unique ID for local records
const generateLocalId = () => `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Create a generic local API
export const localApi = {
  async get(storeName: StoreName) {
    return (await dbPromise).getAll(storeName);
  },
  async post(storeName: StoreName, data: any) {
    const id = generateLocalId();
    const record = { ...data, id };
    await (await dbPromise).put(storeName, record);
    return record;
  },
  async put(storeName: StoreName, id: string, data: any) {
    const record = { ...data, id };
    await (await dbPromise).put(storeName, record);
    return record;
  },
  async delete(storeName: StoreName, id: string) {
    await (await dbPromise).delete(storeName, id);
    return { id };
  },
};
