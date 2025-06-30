import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = async (token) => {
    try {
        console.log("Token stored");
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