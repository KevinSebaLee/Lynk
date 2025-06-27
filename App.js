//NO BORRAR: npm install --global @expo/ngrok@^4.1.0

import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, useNavigation,getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import{useState} from 'react'

import Inicio  from './src/screens/inicioScreen.js';
import LogIn  from './src/screens/logInScreen.js';
import SignUp  from './src/screens/signUpScreen.js';

import Home  from './src/screens/home.js';
import Eventos  from './src/screens/eventos.js';
import Create  from './src/screens/create.js';
import gestion from './src/screens/gestion.js';
import Agenda from './src/screens/agenda.js';
import Tickets from './src/screens/tickets.js';
import PremiumGeneral from './src/screens/premiumGeneral.js';

const Stack = createNativeStackNavigator()
const StackInicio = createNativeStackNavigator()
const StackHome = createNativeStackNavigator();
const StackEventos = createNativeStackNavigator();
const StackCreate = createNativeStackNavigator();
const StackGestion = createNativeStackNavigator();
const StackAgenda = createNativeStackNavigator();

function StackInicioNavigator() {
  return (
    <StackInicio.Navigator screenOptions={{ headerShown: false }}>
      <StackInicio.Screen name="inicioScreen" component={Inicio} />
      <StackInicio.Screen name="logInScreen" component={LogIn} options={{
    headerTransparent: true,  headerTitle: ''}}/>
      <StackInicio.Screen name="signUpScreen" component={SignUp} />
      

    </StackInicio.Navigator>
  );
}

function StackHomeNavigator() {
  return (
    <StackHome.Navigator screenOptions={{headerShown:false}}>
      <StackHome.Screen name="home" component={Home} />
      <StackHome.Screen name="tickets" component={Tickets} />
      <StackHome.Screen name="premiumGeneral" component={PremiumGeneral} />
      

    </StackHome.Navigator>
  );
}

function StackEventosNavigator() {
  return (
    <StackEventos.Navigator screenOptions={{headerShown:false}}>
      <StackEventos.Screen name="Eventos" component={Eventos} />
    </StackEventos.Navigator>
  );
}

 function StackCreateNavigator() {
   return (
     <StackCreate.Navigator screenOptions={{headerShown:false}}>
       <StackCreate.Screen name="Crear" component={Create} />
     </StackCreate.Navigator>
   );
 }

 function StackGestionNavigator() {
  return (
    <StackGestion.Navigator screenOptions={{headerShown:false}}>
      <StackGestion.Screen name="Gestion" component={gestion} />
    </StackGestion.Navigator>
  );
}

function StackAgendaNavigator() {
  return (
    <StackAgenda.Navigator screenOptions={{headerShown:false}}>
      <StackAgenda.Screen name="Agenda" component={Agenda} />
    </StackAgenda.Navigator>
  );
}

function ocultarTab(route) {
  const screen = getFocusedRouteNameFromRoute(route) ?? 'inicioScreen';

  if (screen === 'logInScreen' || screen === 'signUpScreen' || screen === 'inicioScreen') {
    return { display: 'none' };
  }
  return { display: 'flex' };
}

const Tab = createBottomTabNavigator();
function MyTabs() {

  const [isAuthenticated, setIsAuthenticated] = useState(true)

  return (
     <Tab.Navigator screenOptions={{headerShown:false}} initialRouteName={isAuthenticated ? 'Home' : 'Inicio'}>
       <Tab.Screen name="Inicio"     component={StackInicioNavigator} 
      options={({route}) => ({
        tabBarStyle: ocultarTab(route),
      })}
      />
      <Tab.Screen name="Home"     component={StackHomeNavigator} 
      options={{
        tabBarIcon: ({ color }) => (
          <Ionicons name="home" size={24} color={color} />
         ),
      }}
      /> 
      <Tab.Screen name="Eventos" component={StackEventosNavigator} 
      options={{
        tabBarIcon: ({ color }) => (
          <Ionicons name="search" size={24} color={color} />
         ),
      }}
      />
      <Tab.Screen name="Create"   component={StackCreateNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle" size={24} color={'#642684'} />
           ),
        }}
      />
      <Tab.Screen name="Gestion"   component={StackGestionNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="card" size={24} color={color} />
           ),
        }}
      />
      <Tab.Screen name="Agenda"   component={StackAgendaNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-number-outline" size={24} color={color} />
           ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer >
      <MyTabs />
    </NavigationContainer>
  );
}






