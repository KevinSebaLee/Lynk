import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useAuth } from './context/AuthContext';

import StackInicioNavigator from './navigation/StackInicioNavigator.js';
import StackHomeNavigator from './navigation/StackHomeNavigator.js';
import StackEventosNavigator from './screens/eventos';
import StackCreateNavigator from './screens/create';
import StackGestionNavigator from './screens/gestion';
import StackAgendaNavigator from './screens/agenda';
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
                <Ionicons name="calendar" size={24} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Create"
            component={StackCreateNavigator}
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="add-circle" size={24} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Gestion"
            component={StackGestionNavigator}
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="construct" size={24} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Agenda"
            component={StackAgendaNavigator}
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="book" size={24} color={color} />
              ),
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
}