//NO BORRAR: npm install --global @expo/ngrok@^4.1.0


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