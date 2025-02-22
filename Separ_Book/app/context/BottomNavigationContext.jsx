import { createContext, useState } from "react";


export const BottomNavigationContext = createContext()

export const BottomNavigationProvider = ({ children }) => {

    const [ bottomNavigation, setBottomNavigation ] = useState('Home')

    return (
        <BottomNavigationContext.Provider value={{ bottomNavigation, setBottomNavigation }}>
            { children }
        </BottomNavigationContext.Provider>
    )
}
