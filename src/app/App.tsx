import { use, useCallback, useEffect, useState } from 'react';
import Screen from '../communs/layouts/screen';
import './App.css'
import NotesPages from './notes';
import ArchivePages from './notes/archived';
import DossierPage from './notes/groupes';
import GroupeLayouts from './notes/groupes/layouts';
import EditorPage from './notes/notepage';
import { BrowserRouter, data, Route, Routes } from 'react-router-dom'
import MainLogin from './login';
import GlobalProvider, { useGlobalContext } from '../communs/context/global';




const Router = () => {
  const [userState, setUserState] = useState(0)
  const [isLoding, setIsLoding] = useState(false)
  const { USER } = useGlobalContext()
  const [infos, setter] = USER


  const handleSession = useCallback(async () => {
    try {
      const userSession = await window.api.db.getsession()
      const test = await window.api.testdb()

      console.log("test db", test)

      if (userSession.length > 0) {
        setter({
          id: userSession[0]?.iduser,
          name: userSession[0]?.name,
          email: userSession[0]?.email
        })
      }
      setUserState(userSession.length > 0 ? 1 : 0)
    } catch (e) {
      console.log(e)
    }
  }, [])

  handleSession()


  if (userState === 1 && !isLoding) {
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
    <BrowserRouter>
      <GlobalProvider>
        <Router />
      </GlobalProvider>
    </BrowserRouter>
  )

}

export default App
