import Screen from '../communs/layouts/screen';
import './App.css'
import NotesPages from './notes';
import EditorPage from './notes/notepage';
import { Provider } from './provider'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  const router = (
    <Routes>
      <Route path='/login' element={<div>Login</div>} />
      <Route element={<Screen />}>
        <Route path="/" element={<NotesPages />} />
        <Route path="/archives" element={<div>Archives</div>} />
        <Route path="/groupes" element={<div>Groupes</div>} />
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
