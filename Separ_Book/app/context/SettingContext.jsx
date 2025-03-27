import { createContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SettingContext = createContext()

export const SettingContextProvider = ({ children }) => {

    const [objSetting, setObjSetting] = useState({ fontSize: 30, backgroundColor: '#fff' })

     // Load stored settings when the component mounts
         useEffect(() => {
                const loadSettings = async () => {
                    const storedData = await getDataSetting()
                    if (storedData) {
                        setObjSetting(storedData)
                    }
                }
                loadSettings()
        }, [])
    
      
        const handleChangeSetting = (value) => {
            if (!value) return
            setObjSetting(value)
            storeData(value)
        }

        const storeData = async (value) => {
            try {
                const jsonValue = JSON.stringify(value)
                await AsyncStorage.setItem('setting', jsonValue)
            } catch (e) {
                alert('Failed to save settings')
            }
        };
    
    
        const getDataSetting = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('setting')
                return jsonValue ? JSON.parse(jsonValue) : null
            } catch (e) {
                alert('Failed to load settings')
                return null
            }
        };
    

    return(
        <SettingContext.Provider value={{ objSetting, handleChangeSetting }}>
            { children }
        </SettingContext.Provider>
    )
}
