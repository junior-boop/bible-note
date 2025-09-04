import './app/index.css'
import { StrictMode, useCallback, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App';

const CheckData = () => {
    const [data, setData] = useState<{ [key: string]: any } | null>(null);
    const Check = useCallback(async () => {
        const check = await window.api.db.checkdatabase()
        setTimeout(() => {
            setData(check)
        }, 2000)
    }, [])

    useEffect(() => {
        Check()
    }, [])

    if (data === null) {
        return <div>Loading...</div>
    }

    return <App />
}


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <CheckData />
    </StrictMode>,
)
