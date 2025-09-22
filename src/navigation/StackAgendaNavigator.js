import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Agenda from '@/screens/agenda';

const Stack = createNativeStackNavigator();

export default function StackAgendaNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="agenda"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="agenda" component={Agenda} />
    </Stack.Navigator>
  );
}