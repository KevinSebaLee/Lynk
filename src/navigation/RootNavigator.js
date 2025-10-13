import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyTabs from '../Tabs';
import CouponCreate from '../screens/tickets/couponCreate';

const RootStack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="MainTabs" component={MyTabs} />
      <RootStack.Screen
        name="CouponCreate"
        component={CouponCreate}
        options={{
          headerShown: true,
          title: 'Crear Cupón',
          presentation: 'modal', // o 'card'
        }}
      />
    </RootStack.Navigator>
  );
}