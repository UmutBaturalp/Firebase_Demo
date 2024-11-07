import {View, Text} from 'react-native';
import React from 'react';
import {Home, Demo} from '../screens';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Demo">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Demo" component={Demo} />
    </Stack.Navigator>
  );
};

export default AuthStack;
