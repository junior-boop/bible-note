// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import filtre from './communs/ui/bible_component/livre';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  bible : ({ livre, chap, vers1, vers2 }) => filtre({ livre, chap, vers1, vers2 }),
  external : {
      getExternalData: () => ipcRenderer.invoke('get-external-data'),
      setExternalData: (data) => ipcRenderer.invoke('set-external-data', data),
  },
  db : {
    addsessionid : (data) => window.localStorage.setItem('sessionuser-01', data),
    getsessionid : () => window.localStorage.getItem('sessionuser-01'),
    checkdatabase : () => ipcRenderer.invoke('check-database'),
    getnotes : () => ipcRenderer.invoke('get-notes'),
    getnotesid : (id) => ipcRenderer.invoke("get-note-id", id),
    modifynoteid : (data) => ipcRenderer.invoke("modify-note-id", {data}),
    getnotesarchived : () => ipcRenderer.invoke('get-notes-archived'),
    setnotesarchived : (data) => ipcRenderer.invoke('set-notes-archived', data),
    getnotespinned : () => ipcRenderer.invoke("get-notes-pinned"), 
    setnotespinned : (data) => ipcRenderer.invoke('set-notes-pinned', data), 
    setnote : (data) => ipcRenderer.invoke("set-note", data),
    deletenote : (id) => ipcRenderer.invoke("delete-note", id),
    getuserinfos : () => ipcRenderer.invoke("get-user-infos"),
    getsession : () => ipcRenderer.invoke("get-session"),
    setsession : (data) => ipcRenderer.invoke("set-session", data),
    deletesession : () => ipcRenderer.invoke("delete-session"),
  }
})