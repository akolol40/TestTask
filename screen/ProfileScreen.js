import React, {useState, useEffect, useRef, createRef} from 'react'
import {View, SafeAreaView, Text, Button, TouchableOpacity, TextInput, CheckBox, Alert} from 'react-native'
import styles from '../styles/styles'
import Storage from '../Storage/storage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Table, TableWrapper, Row, Rows,  Cell, Col, Cols  } from 'react-native-table-component';
export default function ProfileScreen (props) {
    const [name , setName] = useState('')
    const [tableData, setTableData] = useState([
      ['a','b',''],['c','g','']
      ])
    const [isSelected, setSelection] = useState(false);  
    const [id, setId] = useState(0)
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
        setId(response.id)
        setName(response.fio)
        request = await fetch(uri+'getAllList',
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

    const deleteElement = async(id, index, all=false) => {
      const Store = await Storage()  
      const uri = 'http://localhost:3000/api/v1/'
      try {
          const request = await fetch(uri+'delAddr', {
              method: 'post', 
              body: JSON.stringify({id: id}),
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'authorization': 'bearer ' + JSON.parse(Store.token)
                },
          })
          const result = await request.json()
          console.log(result)
          if (!all) {
          let mass = [...tableData]
          mass.splice(index, 1)
          setTableData(mass)
          } else setTableData([[]])
      } catch (err) {
          console.error('Error:', err)
      }

    }

    const UpdateElement = async(id, name) => {
      const Store = await Storage()  
      const uri = 'http://localhost:3000/api/v1/'
      try {
          const request = await fetch(uri+'updateTable', {
              method: 'post', 
              body: JSON.stringify({id: id, name: name}),
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'authorization': 'bearer ' + JSON.parse(Store.token)
                },
          })
          const result = await request.json()
          
      } catch (err) {
          console.error('Error:', err)
      }

    }
    const DeleteAll = async() => {
      tableData.map((data, index) => {
        deleteElement(data[0], index, true)
      })
      
    }
    const arrLength = tableData.length;
    const [elRefs, setElRefs] = React.useState([]);
    const [elCheckRefs, setelCheckref] = React.useState([])
      React.useEffect(() => {
        // add or remove refs
        setElRefs(elRefs => (
          Array(arrLength).fill().map((_, i) => elRefs[i] || createRef())
        ));
        setelCheckref(elCheckRefs => (
          Array(arrLength).fill().map((_, i) => elCheckRefs[i] || createRef())
        ));
      }, [arrLength]);
    const [btncap, setbtncap] = useState('Редактировать')
    const element = (data, index) => (
    <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => {
          console.log(btncap)
          if (btncap === 'Редактировать') {
            elRefs[index].current.focus()
            setbtncap('Ок')
          }
          if (btncap === 'Ок')
          {
            UpdateElement(tableData[index][0], state.data)
            setbtncap('Редактировать')
          }
        }}>
          <View style={styles.btn}>
            <Text style={styles.btnText}>{btncap}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteElement(tableData[index][0],index)}>
          <View style={styles.btn}>
            <Text style={styles.btnText}>Удалить</Text>
          </View>
        </TouchableOpacity>
    </View>
    );


    const edit = (data=' ', index, editable=false, length) => (
        <TextInput
            value={value===''?data:value.data}
            ref={elRefs[index]}
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
            id: result.id,
            name: '0',
            userId: id
          }
          setbtncap('Ок')
          mass.push(Object.values(object))
          setTableData(mass)         

      } catch (err) {
          console.error('Error:', err)
      }

    }
    const logout = async() => {
      await AsyncStorage.setItem('@auth', JSON.stringify(false))
      
      props.navigation.push('Home')
      //п
      //await AsyncStorage.setItem('@auth', JSON.stringify(false))
      //props.navigation.navigate('Home')
    }
    const checkBoxCreator= (key, name) => <CheckBox
    value={isSelected}
    ref={elCheckRefs[key]}
    onValueChange={setSelection}
    style={{flexDirection: 'row'}}
  />  
    console.log(elCheckRefs)
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
            <Row data={[checkBoxCreator()]} />
            {tableData.map((rowData, index) => <Cell data={checkBoxCreator(index)}/>)}
  
          </TableWrapper>
          
          <TableWrapper style={{flex:1}}>
          <Row flexArr={[1,1,1]} data={['№', 'Адрес', 'Действия']}/>
            {tableData.map((rowData, index) => 
            <TableWrapper style={{flexDirection: 'row'}} key={index}> 
               {rowData.map((data, idx) => 
                  <Cell key={idx} data={idx === 2 && data===id ? element(data, index) : idx === 2 && data!==id ? 'Адрес добавили не вы' : idx === 1 ? edit(data, index): data} textStyle={[styles.text]}/>

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
          title='Удалить все' 
          onPress={() => Alert.alert(
            "Пароли не совпадают",
            ""
            [
              {
                text: "Отмена",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => DeleteAll() }
            ]
          )()}
        />
        </View>
        </View>
        </View>
       </SafeAreaView> 
    )
}