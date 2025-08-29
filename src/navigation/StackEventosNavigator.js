import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Eventos from '../screens/eventos';
import EventoElegido from '../screens/eventoElegido'; // This should be your detail screen
import EventLocations from '../screens/eventLocations';
import CreateEventLocation from '../screens/createEventLocation';

const Stack = createNativeStackNavigator();

export default function StackEventosNavigator() {
  return (
    <Stack.Navigator initialRouteName="eventos" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="eventos" component={Eventos} />
      <Stack.Screen name="eventoElegido" component={EventoElegido} />
      <Stack.Screen name="eventLocations" component={EventLocations} />
      <Stack.Screen name="createEventLocation" component={CreateEventLocation} />
    </Stack.Navigator>
  );
}