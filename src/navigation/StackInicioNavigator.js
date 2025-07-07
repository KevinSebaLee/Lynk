import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Inicio from '../screens/inicioScreen';
import LogIn from '../screens/logInScreen';
import SignUp from '../screens/signUpScreen';

const StackInicio = createNativeStackNavigator();
    
export default function StackInicioNavigator() {
  return (
    <StackInicio.Navigator screenOptions={{ headerShown: false }}>
      <StackInicio.Screen name="inicioScreen" component={Inicio} />
      <StackInicio.Screen name="logInScreen" component={LogIn} />
      <StackInicio.Screen name="signUpScreen" component={SignUp} />
    </StackInicio.Navigator>
  );
}