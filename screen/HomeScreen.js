import React, {useEffect} from 'react'
import {View, Button, SafeAreaView, Text} from 'react-native'
import styles from '../styles/styles'
import AsyncStorage from '@react-native-async-storage/async-storage'
export default function HomeScreen (props) {
    useEffect(async() => {
        let auth = await AsyncStorage.getItem('@auth')
        if (auth) {
            props.navigation.navigate('Profile')
        } else {
            console.log('logout')
        }
    },[])
    return (
       <SafeAreaView style={styles.container}> 
        <View style={styles.containerHome}>
            <View style={{marginHorizontal: 20}}>
            <Button onPress={() =>  props.navigation.navigate("Autorization")} title={"Вход"}/>
            </View>
            <Button onPress={() => props.navigation.navigate('Reg')} title={'Регистрация'}/>
        </View>
       </SafeAreaView> 
    )
}