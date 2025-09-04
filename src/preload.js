// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import filtre from './communs/ui/bible_component/livre';

const { contextBridge, ipcRenderer } = require('electron');

// contextBridge.exposeInMainWorld('electronAPI', {
//   getDbPath: () => ipcRenderer.invoke('get-db-path'),
//   // Expose une interface générique pour la base de données
//   // db: {
//   //   getnotes: () => ipcRenderer.invoke('get-notes'),
//   //   // Ajoutez d'autres méthodes de TanStack DB selon vos besoins
//   // },
// });

contextBridge.exposeInMainWorld('api', {
  bible : ({ livre, chap, vers1, vers2 }) => filtre({ livre, chap, vers1, vers2 }),
  testdb : () => ipcRenderer.invoke('teste-db'),
  external : {
      getExternalData: () => ipcRenderer.invoke('get-external-data'),
      setExternalData: (data) => ipcRenderer.invoke('set-external-data', data),
  },
  db : {
    checkdatabase : () => ipcRenderer.invoke('check-database'),
    getnotes : () => ipcRenderer.invoke('get-notes'),
    getnotesid : (id) => ipcRenderer.invoke("get-note-id", id),
    setnote : (data) => {console.log(data); return ipcRenderer.invoke("set-note", data)},
    getuserinfos : () => ipcRenderer.invoke("get-user-infos"),
    getsession : () => ipcRenderer.invoke("get-session"),
    setsession : (data) => ipcRenderer.invoke("set-session", data),
    deletesession : () => ipcRenderer.invoke("delete-session"),
  }
})