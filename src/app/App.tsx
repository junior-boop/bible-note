import './App.css'
import { Provider } from './provider'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  const router = (
    <Routes>
      <Route path="/" element={<div>Home</div>} />
      <Route path="/about" element={<div>About</div>} />
      <Route path="/contact" element={<div>Contact</div>} />
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
