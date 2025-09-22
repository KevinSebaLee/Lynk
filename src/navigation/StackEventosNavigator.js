import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Eventos from '@/screens/eventos';
import EventoElegido from '@/screens/eventoElegido'; // This should be your detail screen
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components';

const Stack = createNativeStackNavigator();

export default function StackEventosNavigator() {
  const { esEmpresa, authInitialized } = useAuth();

  return (
    <View style={styles.container}>
      <Stack.Navigator initialRouteName='eventos' screenOptions={{ headerShown: false }}>
        <Stack.Screen name='eventos' component={Eventos} />
        <Stack.Screen name='eventoElegido' component={EventoElegido} />
      </Stack.Navigator>
      
      {!authInitialized && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner />
        </View>
      )}
    </View>
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