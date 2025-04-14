import AsyncStorage from '@react-native-async-storage/async-storage';
import { Favorite, Profile, Setting } from '../types/interfaces';
import { NotificationStoreDataType } from '../types/type';


type AllowedKeys = 'SETTING' | 'PROFILE' | 'FAVORITE' | 'NOTIFICATION'

type KeyValueMap = {
    SETTING: Setting
    PROFILE: Profile
    FAVORITE: Favorite
    NOTIFICATION: NotificationStoreDataType
}

export const storeData = async <K extends AllowedKeys>( 
    key: K,
    value: KeyValueMap[K]
) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(key, jsonValue)
    } catch (e) {
        alert('Failed to save data')
    }
}

export const getStoreData = async <K extends AllowedKeys>(
    key: K
): Promise<KeyValueMap[K] | null> => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue ? JSON.parse(jsonValue) as KeyValueMap[K] : null;
    } catch (e) {
        alert('Failed to load data');
        return null;
    }
}

export const removeStorageData = async(key: AllowedKeys) => {
    
    AsyncStorage.removeItem(key)

    const jsonValue = await AsyncStorage.getItem(key);
    console.log(jsonValue ? JSON.parse(jsonValue) : [])
}