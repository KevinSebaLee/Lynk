import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import MyTabs from './src/Tabs';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    </AuthProvider>
  );
}