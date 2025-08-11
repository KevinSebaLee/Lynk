import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/home';
import Tickets from '../screens/tickets';
import PremiumGeneral from '../screens/premiumGeneral';
import Transferir from '../screens/Transferir'; 
import TransferirMonto from '../screens/TransferirMonto'; 
import HomeEmpresa from '../screens/homeEmpresa';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/common';

const Stack = createNativeStackNavigator();

export default function StackHomeNavigator() {
  const { esEmpresa, authInitialized } = useAuth();

  if (!authInitialized) {
    return <LoadingSpinner />;
  }

  console.log('StackHomeNavigator - esEmpresa:', esEmpresa); // Debug log

  return (
    <Stack.Navigator
      initialRouteName={esEmpresa ? "homeEmpresa" : "home"}
      screenOptions={{ headerShown: false }}
      key={`navigation-${esEmpresa ? "empresa" : "personal"}`}
    >
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="tickets" component={Tickets} />
      <Stack.Screen name="premiumGeneral" component={PremiumGeneral} />
      <Stack.Screen name="Transferir" component={Transferir} /> 
      <Stack.Screen name="TransferirMonto" component={TransferirMonto} options={{ title: 'Transferir Monto' }} />
      <Stack.Screen name="homeEmpresa" component={HomeEmpresa} /> 
    </Stack.Navigator>
  );
}