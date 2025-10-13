import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Cupones from '@/screens/tickets/cupones';
import CouponSelected from '@/screens/tickets/couponSelected';
import CouponCreate from '@/screens/tickets/couponCreate';
import EventCoupons from '../screens/tickets/eventCoupons';

const Stack = createNativeStackNavigator();

export default function StackCuponesNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="cupones"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="cupones" 
        component={Cupones}
        options={{ title: 'Mis Cupones' }}
      />
      <Stack.Screen 
        name="eventCoupons" 
        component={EventCoupons}
        options={{ title: 'Event Coupons' }}
      />
      <Stack.Screen 
        name="couponSelected" 
        component={CouponSelected}
        options={{ title: 'Detalle del Cupón' }}
      />
      <Stack.Screen 
        name="couponCreate" 
        component={CouponCreate}
        options={{ title: 'Crear Cupón' }}
      />
    </Stack.Navigator>
  );
}
