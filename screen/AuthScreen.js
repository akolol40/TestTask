import React, {useState} from 'react'
import {View, SafeAreaView, Button} from 'react-native'
import styles from '../styles/styles'
import Edit from '../components/Edit'
import AsyncStorage from '@react-native-async-storage/async-storage'
const AuthScreen = (props) =>  {
    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('')

    const Autorization = async (login, pass) => {
        const uri = 'http://localhost:3000/api/v1/'
        try {
            const request = await fetch(uri+'login', {
                method: 'post', 
                body: JSON.stringify({email: login, pwd: pass}),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
            })
            const result = await request.json()
            console.log(result)
            if (result.message === 'ok') {
                await AsyncStorage.setItem('@auth', JSON.stringify(true))
                await AsyncStorage.setItem('@token', JSON.stringify(result.token))
                props.navigation.navigate('Profile')
            } else await AsyncStorage.setItem('@auth', JSON.stringify(false))
        } catch (err) {
            console.error('Error:', err)
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Edit
                    val={email}
                    change={setEmail}
                    placeholders={'email'}
                    style={{textAlign: 'center', borderWidth: 1, marginBottom: 10, padding: 10}}
                />
                <Edit
                    val={pwd}
                    change={setPwd}
                    placeholders={'password'}
                    pass={true}
                    style={{textAlign: 'center', borderWidth: 1, padding: 10}}
                />
                <View style={[styles.containerHome, {marginTop: 20, marginRight: 30}]}>
                    <View style={{marginHorizontal: 30}}>
                        <Button onPress={() => Autorization(email, pwd)} title={"Войти"}/>
                    </View>
                    <Button onPress={() => props.navigation.navigate('Home')} title={'Отмена'}/>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default AuthScreen