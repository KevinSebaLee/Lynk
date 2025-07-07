import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useAuth } from './context/AuthContext';

import StackInicioNavigator from './screens/inicioScreen.js';
import StackHomeNavigator from './screens/home.js';
import StackEventosNavigator from './screens/eventos.js';
import StackCreateNavigator from './screens/create.js';
import StackGestionNavigator from './screens/gestion.js';
import StackAgendaNavigator from './screens/agenda.js';
import StackLogInNavigator from './screens/logInScreen.js';
import StackSignUpNavigator from './screens/signUpScreen.js';

function ocultarTab(route) {
  const screen = getFocusedRouteNameFromRoute(route) ?? StackInicioNavigator;
  if (screen === StackLogInNavigator || screen === StackSignUpNavigator || screen === StackInicioNavigator) {
    return { display: 'none' };
  }
  return { display: 'flex' };
}

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  const { isAuthenticated } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={isAuthenticated ? 'Home' : 'Inicio'}
    >
      {!isAuthenticated ? (
        <Tab.Screen
          name="Inicio"
          component={StackInicioNavigator}
          options={({ route }) => ({
            tabBarStyle: ocultarTab(route),
          })}
        />
      ) : (
        <>
          <Tab.Screen
            name="Home"
            component={StackHomeNavigator}
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="home" size={24} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Eventos"
            component={StackEventosNavigator}
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="search" size={24} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Create"
            component={StackCreateNavigator}
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="add-circle" size={24} color={'#642684'} />
              ),
            }}
          />
          <Tab.Screen
            name="Gestion"
            component={StackGestionNavigator}
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="card" size={24} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Agenda"
            component={StackAgendaNavigator}
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="calendar-number-outline" size={24} color={color} />
              ),
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
}