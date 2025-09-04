import { createContext, useContext, useState } from 'react'

const GlobalContext = createContext({});

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const initialState = {
        name: null,
        email: null,
        id: null
    };
    const [userState, setUserState] = useState(initialState),
        USER = [userState, setUserState];

    return (
        <GlobalContext.Provider value={{ USER }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};

export default GlobalProvider;
