import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '@/screens/home';
import Tickets from '@/screens/tickets';
import PremiumGeneral from '@/screens/premiumGeneral';
import Transferir from '@/screens/tickets/Transferir'; 
import TransferirMonto from '@/screens/tickets/TransferirMonto'; 
import HomeEmpresa from '@/screens/home/homeEmpresa';
import Cupones from '@/screens/tickets/cupones';
import CouponSelected from '@/screens/tickets/couponSelected';
import CouponCreate from '@/screens/tickets/couponCreate';
import AllTransfers from '@/screens/tickets/allTransfers';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components';

const Stack = createNativeStackNavigator();

export default function StackHomeNavigator() {
  const { esEmpresa, authInitialized } = useAuth();
  
  // Use useMemo to determine the initial route based on authentication state
  const initialRoute = useMemo(() => {
    return authInitialized && esEmpresa ? 'homeEmpresa' : 'home';
  }, [authInitialized, esEmpresa]);

  return (
    <View style={styles.root}>
      <Stack.Navigator
        initialRouteName={initialRoute}
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
        <Stack.Screen name='CouponSelected' component={CouponSelected} />
        <Stack.Screen name='CouponCreate' component={CouponCreate} />
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