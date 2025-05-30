import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Image, Dimensions, ImageBackground } from 'react-native';
import Header from './src/components/header.js';
import Container from './src/components/container.js';
import { LinearGradient } from 'expo-linear-gradient';
import Carousel from 'react-native-reanimated-carousel';
import home  from './src/screens/home.js';
import eventos  from './src/screens/eventos.js';


function StackHomeNavigator() {
  return (
    <StackHome.Navigator>
      <StackHome.Screen name="home" component={home} />
    </StackHome.Navigator>
  );
}

function StackEventosNavigator() {
  return (
    <StackEventos.Navigator>
      <StackEventos.Screen name="eventos" component={eventos} />
    </StackEventos.Navigator>
  );
}
// function StackCNavigator() {
//   return (
//     <StackC.Navigator>
//       <StackC.Screen name="ScreenC1" component={ScreenC1} />
//       <StackC.Screen name="ScreenC2" component={ScreenC2} />
//     </StackC.Navigator>
//   );
// }

// function StackDNavigator() {
//   return (
//     <StackD.Navigator>
//       <StackD.Screen name="ScreenD1" component={ScreenD1} />
//       <StackD.Screen name="ScreenD2" component={ScreenD2} />
//     </StackD.Navigator>
//   );
// }



const Tab = createBottomTabNavigator();
function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="home"     component={StackHomeNavigator} 
      options={{
        tabBarIcon: ({ color }) => (
          <Ionicons name="home" size={24} color={color} />
         ),
      }}
      />
      <Tab.Screen name="eventos" component={StackEventosNavigator} 
      options={{
        tabBarIcon: ({ color }) => (
          <Ionicons name="search" size={24} color={color} />
         ),
      }}
      />
      {/* <Tab.Screen name="Perfil"   component={StackCNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
           ),
        }}
      />
      <Tab.Screen name="Ajustes" component={StackDNavigator} 
      options={{
        tabBarIcon: ({ color }) => (
          <Ionicons name="settings" size={24} color={color} />
         ),
      }}
      /> */}
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}






