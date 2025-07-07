import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/home';
import Tickets from '../screens/tickets';
import PremiumGeneral from '../screens/premiumGeneral';

const Stack = createNativeStackNavigator();

export default function StackHomeNavigator() {
  return (
    <Stack.Navigator initialRouteName="home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="tickets" component={Tickets} />
      <Stack.Screen name="premiumGeneral" component={PremiumGeneral} />
    </Stack.Navigator>
  );
}