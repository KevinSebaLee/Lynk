import * as SecureStore from 'expo-secure-store';

export const storeToken = async (token) => {
    try {
        await SecureStore.setItemAsync('userToken', token);
    } catch (e) {
        console.error('Failed to save token.', e);
    }
};

export const getToken = async () => {
    try {
        const token = await SecureStore.getItemAsync('userToken');
        return token;
    } catch (e) {
        console.error('Failed to fetch token.', e);
        return null;
    }
};

export const removeToken = async () => {
    try {
        await SecureStore.deleteItemAsync('userToken');
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