import React, { createContext, useState, useEffect } from "react";
import { storeData, getStoreData }  from "../Utils/storage";
import { Setting } from "../types/interfaces";
import { ReactNode } from "react";

export interface SettingContextType {
    objSetting: Setting
    handleChangeSetting: (value: Setting) => void
}

interface SettingProviderType {
    children: ReactNode
}

export const SettingContext = createContext<SettingContextType| null>(null)

export const SettingContextProvider: React.FC<SettingProviderType> = ({ children }) => {

    const [objSetting, setObjSetting] = useState<Setting>(
        { 
            fontSize: 30, 
            theme: 'light' 
        }
    )

     // Load stored settings when the component mounts
         useEffect(() => {
                const loadSettings = async () => {
                    const storedData = await getStoreData('SETTING')
                    if (storedData) {
                        setObjSetting(storedData)
                    }
                }
                loadSettings()
        }, [])
    
        const handleChangeSetting = (value: Setting) => {
            if (!value) return
            setObjSetting(value)
            storeData('SETTING', value)
        }

    return(
        <SettingContext.Provider value={{ objSetting, handleChangeSetting }}>
            { children }
        </SettingContext.Provider>
    )
}
