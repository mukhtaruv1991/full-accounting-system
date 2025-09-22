import { dbPromise } from './db';

// Generate a simple unique ID for local records
const generateLocalId = () => `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Create a generic local API
export const localApi = {
  async get(storeName: 'accounts' | 'customers' | 'suppliers' | 'items') {
    return (await dbPromise).getAll(storeName);
  },
  async post(storeName: 'accounts' | 'customers' | 'suppliers' | 'items', data: any) {
    const id = generateLocalId();
    const record = { ...data, id };
    await (await dbPromise).put(storeName, record);
    return record;
  },
  async put(storeName: 'accounts' | 'customers' | 'suppliers' | 'items', id: string, data: any) {
    const record = { ...data, id };
    await (await dbPromise).put(storeName, record);
    return record;
  },
  async delete(storeName: 'accounts' | 'customers' | 'suppliers' | 'items', id: string) {
    await (await dbPromise).delete(storeName, id);
    return { id };
  },
};
