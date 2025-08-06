import { BrowserRouter, Route, Routes } from 'react-router-dom'



export default function Screen() {

    const router = (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<div>Home</div>} />
                <Route path="/about" element={<div>About</div>} />
                <Route path="/contact" element={<div>Contact</div>} />
            </Routes>
        </BrowserRouter>
    );
    return (
        <BrowserRouter>
            {router}
        </BrowserRouter>
    )
}