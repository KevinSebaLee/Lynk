import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Eventos from '@/screens/events';
import EventoElegido from '@/screens/events/eventoElegido';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components';
import EventoElegidoEmpresa from '../screens/events/eventoElegidoEmpresa';

const Stack = createNativeStackNavigator();

export default function StackEventosNavigator() {
  const { esEmpresa, authInitialized } = useAuth();

  if (!authInitialized) {
    return <LoadingSpinner />;
  }

  console.log('StackEventosNavigator - esEmpresa:', esEmpresa); // Debug log


  return (
    <Stack.Navigator initialRouteName="eventos" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="eventos" component={Eventos} />
      <Stack.Screen name="eventoElegido" component={EventoElegido} />
      <Stack.Screen name="eventoElegidoEmpresa" component={EventoElegidoEmpresa} />

    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});