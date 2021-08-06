import React, {useState} from 'react'
import {View, SafeAreaView, Button, Alert, ScrollView, KeyboardAvoidingView, Platform} from 'react-native'
import styles from '../styles/styles'
import Edit from '../components/Edit'
import AsyncStorage from '@react-native-async-storage/async-storage'
const RegScreen = (props) =>  {
    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('')
    const [pwd2,setPwd2] = useState('')
    const [fio, setFio] = useState('')
    const [phone, setPhone] = useState('')
    const Register = async (login, pass, fio, phone, pwdconf) => {
        if (pass !== pwdconf) {
            Alert.alert(
                "Пароли не совпадают",
                ""
                [
                  { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
              );
        } else 
        {  
        const uri = 'http://localhost:3000/api/v1/'
        try {
            const request = await fetch(uri+'reg', {
                method: 'post', 
                body: JSON.stringify({email: login, pwd: pass, fio: fio, phone: phone}),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
            })
            const result = await request.json()
            if (result.status === 'ok')
            {
                await AsyncStorage.setItem('@auth', JSON.stringify(true))
                await AsyncStorage.setItem('@token', JSON.stringify(result.token))
                props.navigation.push('Profile')
            }
        } catch (err) {
            console.error('Error:', err)
        }
        }
    }
    return (
        <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'flex-start', alignItems: 'center', marginTop: 100}} behavior={Platform.OS === "ios" ? "padding" : "height"} enabled   keyboardVerticalOffset={40}>
         <ScrollView>
            <View>
                <Edit
                    val={fio}
                    change={setFio}
                    placeholders={'фио'}
                    style={{textAlign: 'center', borderWidth: 1, marginBottom: 5, padding: 10}}
                />
                <Edit
                    val={phone}
                    change={setPhone}
                    placeholders={'телефон'}
                    style={{textAlign: 'center', marginBottom: 5, borderWidth: 1, padding: 10}}
                />
                <Edit
                    val={email}
                    change={setEmail}
                    placeholders={'email'}
                    style={{textAlign: 'center', marginBottom: 5, borderWidth: 1, padding: 10}}
                />
                <Edit
                    val={pwd}
                    change={setPwd}
                    placeholders={'пароль'}
                    pass={true}
                    style={{textAlign: 'center', marginBottom: 5, borderWidth: 1, padding: 10}}
                />
                <Edit
                    val={pwd2}
                    change={setPwd2}
                    placeholders={'пароль повтор'}
                    pass={true}
                    style={{textAlign: 'center', marginBottom: 5, borderWidth: 1, padding: 10}}
                />
                <View style={[styles.containerHome, {marginTop: 20, marginRight: 30}]}>
                    <View style={{marginHorizontal: 30}}>
                        <Button onPress={() => Register(email, pwd, fio, phone, pwd2)} title={"Ок"}/>
                    </View>
                    <Button onPress={() => props.navigation.navigate('Home')} title={'Отмена'}/>
                </View>
            </View>
            </ScrollView>
        </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default RegScreen