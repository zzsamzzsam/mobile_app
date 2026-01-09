import AsyncStorage from "@react-native-async-storage/async-storage";


/* eslint-disable prettier/prettier */
const AppAsyncStorage = {
    async getItem(key) {
        const value = await AsyncStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    },
    async setItem(key, data) {
        return await AsyncStorage.setItem(key, JSON.stringify(data));
    },
    async removeItem(key) {
        return await AsyncStorage.removeItem(key);
    },
};

export default AppAsyncStorage;
