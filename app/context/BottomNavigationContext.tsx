import { createContext, ReactNode, useState } from "react";
import { TabsRoutes } from "../types/type";

export interface BottomNavigationContextType {
    bottomNavigation: TabsRoutes | null
    setBottomNavigation: React.Dispatch<React.SetStateAction<TabsRoutes| null>>
}

interface BottomNavigationProviderProps {
    children: ReactNode
}

export const BottomNavigationContext = createContext<BottomNavigationContextType | null>(null)

export const BottomNavigationProvider: React.FC<BottomNavigationProviderProps> = ({ children }) => {

    const [ bottomNavigation, setBottomNavigation ] = useState<TabsRoutes | null>('Home')

    return (
        <BottomNavigationContext.Provider value={{ bottomNavigation, setBottomNavigation }}>
            { children }
        </BottomNavigationContext.Provider>
    )
}

