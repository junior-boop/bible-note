import {
  filterProps,
  filterResultProps,
} from "../../communs/ui/bible_component/livre";

export type Notes = {
  id?: string;
  body: string;
  creator: string;
  pinned: 0 | 1;
  archived: 0 | 1;
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
      external: {
        setExternalData: (data: UserInput) => Promise<User | undefined>;
        getExternalData: () => Promise<User | undefined>;
      };
      db: {
        addsessionid: (data: string) => void;
        getsessionid: () => string;
        checkdatabase: () => Promise<{ result: number }>;
        getnotes: () => Promise<Notes[]>;
        getnotesid: (id: string) => Promise<Notes>;
        modifynoteid: ({
          id,
          body,
        }: {
          id: string;
          body: string;
        }) => Promise<Notes>;
        getnotesarchived: () => Promise<Notes[]>;
        setnotesarchived: ({
          id,
          archived,
        }: {
          id: string;
          archived: 0 | 1;
        }) => Promise<Notes[]>;
        getnotespinned: () => Promise<Notes[]>;
        setnotespinned: (data) => Notes[];
        setnote: (data: Notes) => Promise<Notes>;
        deletenote: (id: string) => Promise<boolean>;
        getuserinfos: () => Promise<string>;
        getsession: () => Promise<usersession[] | []>;
        setsession: (data: User) => Promise<{
          id: string;
          iduser: string;
          name: string;
          email: string;
        }>;
        deletesession: () => Promise<string>;
      };
    };
  }
}
