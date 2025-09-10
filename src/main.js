import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { checkDatabase, createGroupTable, createNotesTable, createSessionTable, createUserTable, deleteNote, deleteSession, getAllNotes, getNoteById, getNotesArchived, getNotesPinned, getSession, setNote, setNotePinned, setNotesArchived, setSession, setUser, updateNote } from './lib/database';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}


const createWindow = () => {
  createNotesTable()
  createUserTable()
  createGroupTable()
  createSessionTable()

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 840,
    maxWidth : 840,
    height: 700,
    minWidth: 840,
    minHeight: 700,
    fixed: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      webSecurity: false, // Nécessaire pour WASM en développement

      experimentalFeatures: true,
      
      // // Headers de sécurité pour SharedArrayBuffer (si nécessaire)
      // additionalArguments: [
      //   '--enable-features=SharedArrayBuffer',
      //   '--cross-origin-embedder-policy=require-corp',
      //   '--cross-origin-opener-policy=same-origin'
      // ],

      preload: path.join(__dirname, 'preload.js'),
    },
  });

  
  Menu.setApplicationMenu(null); // Désactive le menu de l'application


  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    console.log("Loading Vite dev server URL:", MAIN_WINDOW_VITE_DEV_SERVER_URL);
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // --- Gestion des appels IPC depuis le renderer ---
  ipcMain.handle('get-db-path', () => {
    return path.join(app.getPath('userData'), 'bible_app.db');
  });

  createWindow();
  
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


ipcMain.handle('get-notes', async (event) => { 
  return await getAllNotes()
});

ipcMain.handle('get-notes-pinned', (event) => {
  return getNotesPinned()
});

ipcMain.handle('set-notes-pinned', (event, data) => {
  return setNotePinned(data)
});

ipcMain.handle('get-notes-archived', (event) => {
  return getNotesArchived()
});

ipcMain.handle('set-notes-archived', (event, data) => {
  return setNotesArchived(data) 
});

ipcMain.handle('get-note-id', async (event, id)=> {
  return await getNoteById(id)
})

ipcMain.handle("set-note", async (event, data) => {
  return setNote(data)
})

ipcMain.handle("modify-note-id", (event, data) => {
  return updateNote(data.data)
})

ipcMain.handle("delete-note", (event, id) => {
  return deleteNote(id)
})

ipcMain.handle('set-external-data', async (event, data) => {
  const response = await fetch('https://nuvelserver.godigital.workers.dev/users/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  console.log(result)
  setSession(result.data)
  return await setUser(result.data)
});

ipcMain.handle("get-user-infos",  (id) => {
  return new Promise((res, rej) => {
    getUser(id, (data) => {
      if (data) {
        res(data);
      } else {
        rej(new Error('Failed to fetch user data'));
      }
    });
  });
});

ipcMain.handle("get-external-data", async (event) => {
  const response = await fetch('https://nuvelserver.godigital.workers.dev/users', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await response.json();
  return result;
});

//  session handle
ipcMain.handle('get-session', async(event) => {
  return await getSession()
});

ipcMain.handle('set-session', (event, user) => {
  return setSession(user)
});

ipcMain.handle('delete-session', async(event) => {
  return await deleteSession()
});

ipcMain.handle('check-database', () => {
  return checkDatabase();
});

// 'https://nuvelserver.godigital.workers.dev/users/signin'
// 'https://nuvelserver.godigital.workers.dev/users'