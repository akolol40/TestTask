import {TextInput} from 'react-native'
import React, {useState} from 'react'


const Edit = ({style, val, change, placeholders, pass=false, max=1000}) => {
 const [value, onChangeText] = React.useState();   
 return (
     <TextInput
        style={style}
        onChangeText = {text => change(text)}
        value={val} 
        placeholder={placeholders}
        placeholderTextColor="#BCBCBC"
        secureTextEntry={pass}
        maxLength={max}
    />
 )
}

export default Edit