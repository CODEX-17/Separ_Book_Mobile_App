import { createContext, ReactNode, useRef, useState } from "react";
import { TabsRoutes } from "../types/type";

export interface BottomNavigationContextType {
  bottomNavigation: TabsRoutes | null;
  setBottomNavigation: React.Dispatch<React.SetStateAction<TabsRoutes | null>>;
  goBackNavigation: () => boolean;
}

interface BottomNavigationProviderProps {
  children: ReactNode;
}

export const BottomNavigationContext =
  createContext<BottomNavigationContextType | null>(null);

export const BottomNavigationProvider: React.FC<
  BottomNavigationProviderProps
> = ({ children }) => {
  const [bottomNavigation, setBottomNavigationState] = useState<TabsRoutes | null>(
    "Home"
  );
  const navigationHistory = useRef<TabsRoutes[]>([]);

  const setBottomNavigation: React.Dispatch<
    React.SetStateAction<TabsRoutes | null>
  > = (nextNavigation) => {
    setBottomNavigationState((currentNavigation) => {
      const nextValue =
        typeof nextNavigation === "function"
          ? nextNavigation(currentNavigation)
          : nextNavigation;

      if (nextValue !== currentNavigation && currentNavigation !== null) {
        navigationHistory.current.push(currentNavigation);
      }

      return nextValue;
    });
  };

  const goBackNavigation = () => {
    const previousNavigation = navigationHistory.current.pop();

    if (previousNavigation === undefined) {
      return false;
    }

    setBottomNavigationState(previousNavigation);
    return true;
  };

  return (
    <BottomNavigationContext.Provider
      value={{ bottomNavigation, setBottomNavigation, goBackNavigation }}
    >
      {children}
    </BottomNavigationContext.Provider>
  );
};
