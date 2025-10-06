import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { StackInicioNavigator, StackHomeNavigator, StackEventosNavigator, StackCreateNavigator, StackGestionNavigator, StackAgendaNavigator } from '@/navigation';
import { EventCreate, LoadingSpinner } from '@/components';

function ocultarTab(route) {
  const screen = getFocusedRouteNameFromRoute(route) ?? 'inicioScreen';
  if (screen === 'logInScreen' || screen === 'signUpScreen' || screen === 'inicioScreen') {
    return { display: 'none' };
  }
  return { display: 'flex' };
}

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  const { isAuthenticated, userDataCache, authInitialized } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tickets, setTickets] = useState(0);

  useEffect(() => {
    if (userDataCache && userDataCache.tickets) {
      setTickets(userDataCache.tickets);
    }
  }, [userDataCache]);

  const handleCloseModal = useCallback(() => {
    setShowCreateModal(false);
  }, []);

  // Store auth initialized state to handle conditionally in the return
  const isInitialized = authInitialized;

  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner />
      </View>
    );
  }
  
  return (
    <>
      <Tab.Navigator
        key={`tab-navigator-${isAuthenticated ? 'auth' : 'unauth'}`}
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#642684',
        }}
        initialRouteName={isAuthenticated ? 'Home' : 'Inicio'}
      >
        {isAuthenticated ? (
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
                  <Ionicons name="card-outline" size={24} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Agenda"
              component={StackAgendaNavigator}
              options={{
                tabBarIcon: ({ color }) => (
                  <Ionicons name="calendar" size={24} color={color} />
                ),
              }}
            />
            
          </>
        ) : (
          <Tab.Screen
            name="Inicio"
            component={StackInicioNavigator}
            options={({ route }) => ({
              tabBarStyle: ocultarTab(route),
            })}
          />
        )}
      </Tab.Navigator>

      {/* Always render the modal but control visibility with props */}
      <EventCreate
        visible={isAuthenticated && showCreateModal}
        onClose={handleCloseModal}
        tickets={tickets || 0}
      />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});