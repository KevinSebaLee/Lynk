import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Gestion from '@/screens/gestion';

const Stack = createNativeStackNavigator();

export default function StackGestionNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="gestion"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="gestion" component={Gestion} />
    </Stack.Navigator>
  );
}