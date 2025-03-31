
import AsyncStorage from '@react-native-async-storage/async-storage';

export const addFavorite = async (value) => {
    AsyncStorage.removeItem('favorites')

    try {
        
        const updatedData = [...new Set(value)]
        await AsyncStorage.setItem('favorites', JSON.stringify(updatedData))
        
    } catch (e) {
        alert('Failed to save favorite');
    }
};

export const getFavorites = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('favorites');
        return jsonValue ? JSON.parse(jsonValue) : [];
    } catch (e) {
        alert('Failed to load favorites');
        return [];
    }
};

export const removerFavorite = async() => {
    
    AsyncStorage.removeItem('favorites')

    const jsonValue = await AsyncStorage.getItem('favorites');
    console.log(jsonValue ? JSON.parse(jsonValue) : [])
}