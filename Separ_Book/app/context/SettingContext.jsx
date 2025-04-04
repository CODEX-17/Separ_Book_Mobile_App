import { createContext, useState, useEffect } from "react";
import { storeData, getStoreData }  from "../Utils/storage";


export const SettingContext = createContext()

export const SettingContextProvider = ({ children }) => {

    const [objSetting, setObjSetting] = useState(
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
    
        const handleChangeSetting = (value) => {
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
