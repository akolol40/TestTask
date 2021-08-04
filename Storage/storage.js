import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function Storage() {
    return {
        Auth: await AsyncStorage.getItem('@auth'),
        token: await AsyncStorage.getItem('@token')
    }
}