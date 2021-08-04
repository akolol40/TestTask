import React, {useState, useEffect} from 'react'
import {View, SafeAreaView, Text, Button, TouchableOpacity, TextInput} from 'react-native'
import styles from '../styles/styles'
import Storage from '../Storage/storage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Table, TableWrapper, Row, Rows,  Cell, Col, Cols  } from 'react-native-table-component';
export default function ProfileScreen (props) {
    const [name , setName] = useState('')
    const [tableData, setTableData] = useState([
      ['a','b',''],['c','g','']
      ])
    useEffect(async() => {
      try {
        const Store = await Storage()  
        const uri = 'http://localhost:3000/api/v1/'
        let request = await fetch(uri+'info',
        {
            headers:{
                'authorization': 'bearer ' + JSON.parse(Store.token)
            }
        })
        let response = await request.json()
        setName(response.fio)
        request = await fetch(uri+'getlist',
        {
            headers:{
                'authorization': 'bearer ' + JSON.parse(Store.token)
            }
        })
        response = await request.json()
        let custArr = []
       
        response.some(data => {
          custArr.push(Object.values(data))
        })
        console.log(custArr)
        setTableData(custArr)
      } catch (err) {
          console.error('Error:', err)
      }
    },[])
    const [value, onChangeText] = React.useState('');  
    const [state, onState] = React.useState({}) 
    const getText = (index, value) => {

        onChangeText(index, value)
        onState(value)
        console.log(index, value)
    }

    const deleteElement = async(addr, index) => {
      const Store = await Storage()  
      const uri = 'http://localhost:3000/api/v1/'
      try {
          const request = await fetch(uri+'delAddr', {
              method: 'post', 
              body: JSON.stringify({name: addr}),
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'authorization': 'bearer ' + JSON.parse(Store.token)
                },
          })
          const result = await request.json()
          console.log(result)
          let mass = [...tableData]
          mass.splice(index, 1)
          setTableData(mass)
      } catch (err) {
          console.error('Error:', err)
      }

    }
    const element = (data, index) => (
    <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => console.log(state)}>
          <View style={styles.btn}>
            <Text style={styles.btnText}>Редактировать</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteElement(state.data,index)}>
          <View style={styles.btn}>
            <Text style={styles.btnText}>удалить</Text>
          </View>
        </TouchableOpacity>
    </View>
    );
    
    const edit = (data=' ', index) => (
        <TextInput
            value={value===''?data:value.data}
            onChangeText={(text) => getText(data, {data:text, key: index})}
        />
    )

    const addColum = async(name) => {
      const Store = await Storage()  
      const uri = 'http://localhost:3000/api/v1/'
      try {
          const request = await fetch(uri+'addAddr', {
              method: 'post', 
              body: JSON.stringify({addr: name}),
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'authorization': 'bearer ' + JSON.parse(Store.token)
                },
          })
          const result = await request.json()
          let mass = [...tableData]
          const object = {
            id: Math.round(Math.random(1000)*1000),
            name: '0',
            v: 'null'
          }
          mass.push(Object.values(object))
          setTableData(mass)
      } catch (err) {
          console.error('Error:', err)
      }

    }
    const logout = async() => {
      //п
      //await AsyncStorage.setItem('@auth', JSON.stringify(false))
      //props.navigation.navigate('Home')
    }
    return (
       <SafeAreaView style={styles.container}> 
        <View style={[styles.containerHome,{position: 'absolute', top: 10, right: 20,justifyContent: 'space-between', alignItems: 'center',}]}>
            <Text>{name}</Text>
            <View style={{marginLeft: 60}}>
            <Button onPress={() => logout()} title="Выход"/>
            </View>
        </View>
        <View style={{width: 300}} >
        <Table style={{flexDirection: 'row'}} borderStyle={{borderWidth: 1}}>
          {/* Left Wrapper */}
          <TableWrapper>
            <Row data={['H1']} />
            <Cell data="H1" />
            <Cell data="H1" />
            <Cell data="H1" />
          </TableWrapper>
          
          <TableWrapper style={{flex:1}}>
          <Row flexArr={[1,1,1]} data={['№', 'Адрес', 'Действия']}/>
            {tableData.map((rowData, index) => 
            <TableWrapper style={{flexDirection: 'row'}} key={index}> 
               {rowData.map((data, idx) => 
                  <Cell key={idx} data={idx === 2 ? element(data, index) : idx === 1 ? edit(data, index): data} textStyle={[styles.text]}/>

              )}
            </TableWrapper>)}

          </TableWrapper>
        </Table>
        <View style={{marginTop: 20}}>
        <Button
          title='Добавить' 
          onPress={() => addColum()}
        />
        <View style={{marginTop: 20}}>
        <Button
          title='Удалить' 
          onPress={() => addColum()}
        />
        </View>
        </View>
        </View>
       </SafeAreaView> 
    )
}