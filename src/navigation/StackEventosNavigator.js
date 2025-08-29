import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Eventos from '../screens/eventos';
import EventoElegido from '../screens/eventoElegido'; // This should be your detail screen
import EventLocations from '../screens/eventLocations';
import CreateEventLocation from '../screens/createEventLocation';
import EventoElegidoEmpresa from '../screens/eventoElegidoEmpresa';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/common';

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
      <Stack.Screen name="eventoElegido" component={esEmpresa? EventoElegidoEmpresa : EventoElegido} />
      <Stack.Screen name="eventLocations" component={EventLocations} />
      <Stack.Screen name="createEventLocation" component={CreateEventLocation} />
    </Stack.Navigator>
  );
}