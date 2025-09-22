import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Create from '@/screens/create';

const Stack = createNativeStackNavigator();

export default function StackCreateNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="create"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="create" component={Create} />
    </Stack.Navigator>
  );
}