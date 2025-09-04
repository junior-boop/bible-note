import {
  filterProps,
  filterResultProps,
} from "../../communs/ui/bible_component/livre";

export type Notes = {
  id?: string;
  body: string;
  creator: string;
  pinned: boolean;
  archived: boolean;
  grouped: string | null;
  created: Date;
  modified: Date;
};

export type User = {
  id: string;
  name: string;
  email: string;
  created: string;
  modified: string;
  lastlogin: string;
  lastlogout: string;
};

export type Groups = {
  id: string;
  name: string;
  created: Date;
  modified: Date;
};

/* 
CREATE TABLE IF NOT EXISTS groups (
        id TEXT PRIMARY KEY,
        name TEXT,
        created ,
        modified INTEGER
    );
*/

export type Session = {
  id: string;
  iduser: string;
  name?: string;
  email?: string;
};

export type UserInput = {
  name: string;
  email: string;
  lastlogin: string;
  lastlogout: string;
};

export type DeletedNote = {
  id: string;
};

export type ModifiedNote = {
  id: string;
  body: string;
  modified: number;
};

export type ArchivedNote = {
  id: string;
  archived: boolean;
};

export type GroupedLink = {
  id: string;
  grouped: string;
};

export type PinningNote = {
  id: string;
  pinned: boolean;
};

export type usersession = {
  id: string;
  iduser: string;
  name: string;
  email: string;
};

declare global {
  interface Window {
    electronAPI: {
      db: {
        getnotes: () => string;
      };
    };
    api: {
      bible: ({
        chap,
        livre,
        vers1,
        vers2,
      }: filterProps) => filterResultProps | undefined;
      testdb: () => Promise<string>;
      external: {
        setExternalData: (data: UserInput) => Promise<User | undefined>;
        getExternalData: () => Promise<User | undefined>;
      };
      db: {
        checkdatabase: () => Promise<{ result: number }>;
        getnotes: () => string;
        getnotesid: (id: string) => string;
        setnote: (data: Notes) => Promise<Notes>;
        getuserinfos: () => Promise<string>;
        getsession: () => Promise<usersession[] | []>;
        setsession: (data: User) => Promise<string>;
        deletesession: () => Promise<string>;
      };
    };
  }
}
