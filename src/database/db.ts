import Dexie, { Table } from 'dexie';

export interface PDFDocument {
    id?: number;
    name: string;
    file: Blob;
    text: string;
    createdAt: string;
  }

class AppDatabase extends Dexie {
  pdfs!: Table<PDFDocument>;

  constructor() {
    super('MasterBrainDB');

    this.version(2).stores({
      pdfs: '++id,name,createdAt',
    });
  }
}

export const db = new AppDatabase();