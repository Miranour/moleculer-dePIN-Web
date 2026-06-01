import { openDB, type DBSchema } from 'idb';

interface DrawingDB extends DBSchema {
  drawings: {
    key: string;
    value: {
      id: string;
      smiles: string;
      timestamp: number;
    };
  };
}

const DB_NAME = 'MoleculeDrawingDB';
const STORE_NAME = 'drawings';
const DRAWING_KEY = 'latest_drawing';

let dbPromise: ReturnType<typeof openDB<DrawingDB>> | null = null;

const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<DrawingDB>(DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      },
    });
  }
  return dbPromise;
};

export const drawingCache = {
  saveDrawing: async (smiles: string) => {
    const db = await getDB();
    await db.put(STORE_NAME, {
      id: DRAWING_KEY,
      smiles,
      timestamp: Date.now(),
    });
  },

  getDrawing: async (): Promise<string | null> => {
    const db = await getDB();
    const entry = await db.get(STORE_NAME, DRAWING_KEY);
    return entry ? entry.smiles : null;
  },

  clearDrawing: async () => {
    const db = await getDB();
    await db.delete(STORE_NAME, DRAWING_KEY);
  }
};
