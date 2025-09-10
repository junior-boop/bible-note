import { use, useCallback, useEffect, useState } from 'react';
import Screen from '../communs/layouts/screen';
import './App.css'
import NotesPages from './notes';
import ArchivePages from './notes/archived';
import DossierPage from './notes/groupes';
import GroupeLayouts from './notes/groupes/layouts';
import EditorPage from './notes/notepage';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import MainLogin from './login';
import GlobalProvider, { useGlobalContext } from '../communs/context/global';
import { DatabaseProvider } from '../communs/context/databaseprovide';
import { useDatabase } from '../communs/context/databaseprovide';
import { QueryBuilder } from '../communs/context/QueryBuilder';
import { Notes } from '../lib/database/db';



const Router = () => {
  const { USER } = useGlobalContext()
  const [infos, setter] = USER
  const location = useLocation()

  const usersession = JSON.parse(window.api.db.getsessionid())



  if (usersession || infos.id !== null) {
    return (
      <Routes>
        <Route element={<Screen />}>
          <Route path="/" element={<NotesPages />} />
          <Route path="/archives" element={<ArchivePages />} />
          <Route path="/groupes" element={<GroupeLayouts />}>
            <Route path="/groupes/dossier/:id" element={<DossierPage />} />
          </Route>
          <Route path="/settings" element={<div>Settings</div>} />
          <Route path="/profile" element={<div>Profile</div>} />
          <Route path="/note/:id" element={<EditorPage />} />
        </Route>
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path='/' element={<MainLogin />} />
    </Routes>
  )


}

function App() {

  return (
    <HashRouter basename='/'>
      <GlobalProvider>
        <DatabaseProvider>
          <Router />
        </DatabaseProvider>
      </GlobalProvider>
    </HashRouter>
  )

}

export default App
