import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Cupones from '@/screens/tickets/cupones';
import CouponSelected from '@/screens/tickets/couponSelected';
import CouponCreate from '@/screens/tickets/couponCreate';

const Stack = createNativeStackNavigator();

export default function StackCuponesNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="CuponesList"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="CuponesList" 
        component={Cupones}
        options={{ title: 'Mis Cupones' }}
      />
      <Stack.Screen 
        name="CouponSelected" 
        component={CouponSelected}
        options={{ title: 'Detalle del Cupón' }}
      />
      <Stack.Screen 
        name="CouponCreate" 
        component={CouponCreate}
        options={{ title: 'Crear Cupón' }}
      />
    </Stack.Navigator>
  );
}
