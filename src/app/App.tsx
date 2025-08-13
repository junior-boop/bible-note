import Screen from '../communs/layouts/screen';
import './App.css'
import NotesPages from './notes';
import ArchivePages from './notes/archived';
import DossierPage from './notes/groupes';
import GroupeLayouts from './notes/groupes/layouts';
import EditorPage from './notes/notepage';
import { Provider } from './provider'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  const router = (
    <Routes>
      <Route path='/login' element={<div>Login</div>} />
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
  );
  return (
    <BrowserRouter>
      <Provider>
        {router}
      </Provider>
    </BrowserRouter>
  )

}

export default App
