import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = async (token) => {
    try {
        await AsyncStorage.setItem('userToken', token);
    } catch (e) {
        console.error('Failed to save token.', e);
    }
};

export const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        return token;
    } catch (e) {
        console.error('Failed to fetch token.', e);
        return null;
    }
};

export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem('userToken');
    } catch (e) {
        console.error('Failed to remove token.', e);
    }
};

export const isLoggedIn = async () => {
    try {
        const token = await getToken();
        return !!token;
    } catch (e) {
        console.error('Failed to check login status.', e);
        return false;
    }
};