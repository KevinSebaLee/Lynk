import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/home';
import Tickets from '../screens/tickets';
import PremiumGeneral from '../screens/premiumGeneral';
import Transferir from '../screens/Transferir'; 
import TransferirMonto from '../screens/TransferirMonto'; 
import HomeEmpresa from '../screens/homeEmpresa';
import Cupones from '../screens/cupones';
import AllTransfers from '../screens/allTransfers';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/common';

const Stack = createNativeStackNavigator();

export default function StackHomeNavigator() {
  const { esEmpresa, authInitialized } = useAuth();

  const navigatorKey = `home-stack-${authInitialized ? (esEmpresa ? 'empresa' : 'personal') : 'initial'}`;

  console.log('[StackHomeNavigator] authInitialized:', authInitialized, 'esEmpresa:', esEmpresa);

  return (
    <View style={styles.root}>
      <Stack.Navigator
        key={navigatorKey}
        initialRouteName={authInitialized ? (esEmpresa ? 'homeEmpresa' : 'home') : 'home'}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name='home' component={Home} />
        <Stack.Screen name='tickets' component={Tickets} />
        <Stack.Screen name='premiumGeneral' component={PremiumGeneral} />
        <Stack.Screen name='Transferir' component={Transferir} />
        <Stack.Screen
          name='TransferirMonto'
          component={TransferirMonto}
          options={{ title: 'Transferir Monto' }}
        />
        <Stack.Screen name='homeEmpresa' component={HomeEmpresa} />
        <Stack.Screen name='Cupones' component={Cupones} />
        <Stack.Screen name='AllTransfers' component={AllTransfers} />
      </Stack.Navigator>

      {!authInitialized && (
        <View style={styles.loadingOverlay} pointerEvents='auto'>
          <LoadingSpinner />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});