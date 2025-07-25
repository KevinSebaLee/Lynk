import React, { useState, useCallback, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useAuth } from './context/AuthContext';
import StackInicioNavigator from './navigation/StackInicioNavigator.js';
import StackHomeNavigator from './navigation/StackHomeNavigator.js';
import StackEventosNavigator from './navigation/StackEventosNavigator';
import StackCreateNavigator from './screens/create';
import StackGestionNavigator from './screens/gestion';
import StackAgendaNavigator from './screens/agenda';
import CreateEventModal from './components/eventCreate.js';

function ocultarTab(route) {
  const screen = getFocusedRouteNameFromRoute(route) ?? 'inicioScreen';
  if (screen === 'logInScreen' || screen === 'signUpScreen' || screen === 'inicioScreen') {
    return { display: 'none' };
  }
  return { display: 'flex' };
}

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  const { isAuthenticated, userDataCache } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tickets, setTickets] = useState(0);

  useEffect(() => {
    if (userDataCache && userDataCache.tickets) {
      setTickets(userDataCache.tickets);
    }
  }, [userDataCache]);

  // Memoize the close handler to prevent recreating it on each render
  const handleCloseModal = useCallback(() => {
    console.log("Closing modal from Tabs component");
    setShowCreateModal(false);
  }, []);

  return (
    <>
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
              listeners={{
                tabPress: e => {
                  e.preventDefault();
                  setShowCreateModal(true);
                }
              }}
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
      
      {/* Modal with clear props */}
      <CreateEventModal 
        visible={showCreateModal} 
        onClose={handleCloseModal} 
        tickets={tickets || 0} 
      />
    </>
  );
}