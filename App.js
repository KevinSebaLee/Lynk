import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import MyTabs from './src/Tabs';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
      <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}