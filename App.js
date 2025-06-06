import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Inicio  from './src/screens/inicioScreen.js';
import LogIn  from './src/screens/logInScreen.js';
import SignUp  from './src/screens/signUpScreen.js';

import Home  from './src/screens/home.js';
import Eventos  from './src/screens/eventos.js';
import Create  from './src/screens/create.js';
import gestion from './src/screens/gestion.js';

const StackInicio = createNativeStackNavigator()
const StackHome = createNativeStackNavigator();
const StackEventos = createNativeStackNavigator();
const StackCreate = createNativeStackNavigator();
const StackGestion = createNativeStackNavigator();



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
      <StackHome.Screen name="Home" component={Home} />
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

const Tab = createBottomTabNavigator();
function MyTabs() {
  return (
    <Tab.Navigator screenOptions={{headerShown:false}}>
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






