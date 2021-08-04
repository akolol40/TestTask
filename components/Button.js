import React from 'react'
import {Text, TouchableOpacity} from 'react-native'


const Button = ({Style, Press, Caption, textStyle, dis=false}) => {
    return (
        <TouchableOpacity
            style={Style}
            onPress={() => Press()}
            disabled={dis}
        >
            <Text style={textStyle}>
                {Caption}
            </Text>
        
        </TouchableOpacity>
    )
}

export default Button