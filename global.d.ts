export {};

interface ElectronAPI {
  getDbPath: () => Promise<string>;
  db: {
    select: (table: string, options?: any) => Promise<any[]>;
    insert: (table: string, value: any) => Promise<any>;
    update: (table: string, value: any) => Promise<any>;
    delete: (table: string, id: string | number) => Promise<any>;
  };
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
