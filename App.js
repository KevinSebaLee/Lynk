//NO BORRAR esto: npm install --global @expo/ngrok@^4.1.0
// ngrok config add-authtoken 2z5ZeoOPiGhX0wL8cWaxlAs0sbV_2VmpqmaJCgJw5FMUnhR6M
// ngrok http --url=subtle-bull-trusting.ngrok-free.app 3000

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