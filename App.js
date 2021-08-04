import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screen/HomeScreen';
import AuthScreen from './screen/AuthScreen';
import RegScreen from './screen/RegScreen'; 
import ProfileScreen from './screen/ProfileScreen';
const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen
        name="Autorization"
        component={AuthScreen}
      />
      <Stack.Screen
        name="Reg"
        component={RegScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Profile"
        component={ProfileScreen}
      />
    </Stack.Navigator>
  </NavigationContainer>
  );
}


