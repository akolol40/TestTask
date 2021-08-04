import React, {useEffect} from 'react'
import {View, Button, SafeAreaView, Text} from 'react-native'
import styles from '../styles/styles'
import AsyncStorage from '@react-native-async-storage/async-storage'
export default function HomeScreen (props) {
    useEffect(async() => {
        let auth = await AsyncStorage.getItem('@auth')
        console.log(auth)
        if (auth==='true') {
            props.navigation.push('Profile')
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