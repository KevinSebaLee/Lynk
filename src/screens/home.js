import React, { useState, useCallback, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Pressable,
  Alert,
  Text,
  TouchableOpacity
} from 'react-native';
import Header from '../components/header.js';
import TicketCard from '../components/TicketCard.js';
import PremiumBanner from '../components/premiumBanner';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AgendaIcon from '../components/agenda.js';
import EventCard from '../components/EventCard.js';
import RecentEvents from '../components/RecentEvents';
import ApiService from '../services/api';
import { useApi } from '../hooks/useApi';
import { LoadingSpinner, Button } from '../components/common';
import { LinearGradient } from 'expo-linear-gradient';
import OverlayMenu from '../components/overlayMenu';
import { AgendaSection, SectionHeader } from '../components';

const { width } = Dimensions.get('window');

/**
 * Home Screen - Main dashboard displaying user tickets and events
 * Handles data loading and navigation to other screens
 */
export default function Home() {
  // Hooks
  const navigation = useNavigation();
  const { logout } = useAuth();

  // State for user and events data
  const [userData, setUserData] = useState(null);
  const [eventosRecientes, setEventosRecientes] = useState([]);
  const [eventosUser, setEventosUser] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);

  // API loading hooks with optimized execution
  const { loading, execute: loadHomeData } = useApi(ApiService.getHomeData);
  const { execute: loadTickets } = useApi(ApiService.getTickets);

  // Refresh all data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      /**
       * Load all user data and events in parallel for better performance
       */
      const refreshData = async () => {
        try {
          // Load tickets and home data in parallel using Promise.all
          const [ticketsData, homeData] = await Promise.all([
            loadTickets(),
            loadHomeData()
          ]);
          
          // Update user data by combining tickets and user info
          setUserData(prevData => ({
            ...prevData,
            ...(homeData?.user || {}),
            tickets: ticketsData?.tickets || 0
          }));
          
          // Update events lists with fallbacks to empty arrays
          if (homeData) {
            setEventosRecientes(homeData.eventosRecientes || []);
            setEventosUser(homeData.eventosUser || []);
          }
        } catch (error) {
          // Error already handled by useApi hook
        }
      };
      
      // Start data loading
      refreshData();
      
      // Cleanup function (no cleanup needed in this case)
      return () => {};
    }, [loadTickets, loadHomeData])
  );

  /**
   * Navigate to tickets screen with loaded tickets data
   */
  const handleTicketsPress = useCallback(async () => {
    try {
      const data = await loadTickets();
      navigation.navigate('tickets', data);
    } catch (error) {
      // Error already handled by useApi hook
    }
  }, [loadTickets, navigation]);

  /**
   * Handle navigation from overlay menu
   */
  const handleOverlayNavigate = useCallback((screen) => {
    setMenuVisible(false);
    navigation.navigate(screen);
  }, [navigation]);

  /**
   * Navigate to company home screen
   */
  const handleHomeEmpresa = useCallback(() => {
    navigation.navigate('homeEmpresa');
  }, [navigation]);

  /**
   * Handle user logout
   */
  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  // Store loading state to display spinner conditionally in the return
  const isLoading = loading && !userData;

  /**
   * Validate and normalize image URI from different formats
   * Memoized to prevent unnecessary recalculations
   */
  const validateImageUri = useCallback((uri) => {
    if (typeof uri === 'string' && uri.trim() !== '') {
      return uri;
    } else if (uri && typeof uri === 'object' && uri.uri && typeof uri.uri === 'string') {
      return uri.uri;
    }
    return null; // Let the component handle the fallback
  }, []);

  // Safely access arrays with memoization to prevent recreating on each render
  const safeEventosRecientes = useMemo(() => 
    Array.isArray(eventosRecientes) ? eventosRecientes : []
  , [eventosRecientes]);
  
  const safeEventosUser = useMemo(() => 
    Array.isArray(eventosUser) ? eventosUser : []
  , [eventosUser]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <LoadingSpinner />
        </View>
      ) : (
        <SafeAreaView style={styles.safeArea}>
          <StatusBar style="light" />
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
          <LinearGradient
            colors={['#642684', '#ffffff', '#ffffff', '#ffffff', '#ffffff']}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <Header nombre={userData?.user_nombre || 'Usuario'} onHamburgerPress={() => setMenuVisible(true)} />
          <OverlayMenu
            visible={menuVisible}
            onClose={() => setMenuVisible(false)}
            onNavigate={(screen) => navigation.navigate(screen)}
          />
          <Pressable onPress={handleTicketsPress}>
            <View style={styles.ticketWrapper}>
              <TicketCard
                tickets={userData?.tickets || 0}
                onGetMore={() => Alert.alert('¡Función para conseguir más tickets!')}
              />
            </View>
          </Pressable>
          <View style={styles.bannerWrapper}>
            <PremiumBanner plan={userData?.plan_titulo} />
          </View>
          <View style={styles.agendaWrapper}>
            <AgendaIcon />
            <View style={{ paddingRight: 250 }}>
              <View style={styles.headerRow}>
                <Text style={styles.header}>Mis eventos</Text>
              </View>
            </View>
            {safeEventosUser.length > 0 ? (
              <ScrollView horizontal>
                {safeEventosUser.map((evento, idx) => (
                  <View key={evento?.id || idx} style={{ marginRight: 12 }}>
                    <EventCard
                      imageUri={validateImageUri(evento?.imagen)}
                      eventName={evento?.nombre}
                      eventFullDate={evento?.fecha}
                      venue={evento?.ubicacion}
                      priceRange={evento?.precio ? evento.precio : "$12.000 - $15.000"}
                      onPress={() => navigation.navigate('eventoElegido', { evento })}
                    />
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text style={{ color: '#642684', marginTop: 10 }}>No tienes eventos propios aún.</Text>
            )}

            <View style={{ marginTop: 20 }}>
              <Button title="Cerrar Sesión" style={styles.logOut} onPress={handleLogout} />
            </View>
            <View style={{ marginTop: 10 }}>
              <TouchableOpacity style={styles.homeEmpresaBtn} onPress={handleHomeEmpresa}>
                <Text style={styles.homeEmpresaBtnText}>Ir a Home Empresa</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.headerRow}>
            <Text style={styles.header}>Eventos más recientes</Text>
            <TouchableOpacity>
              <Text style={{ color: '#642684' }}>Ver más</Text>
            </TouchableOpacity>
          </View>
          {safeEventosRecientes.length > 0 && (
            <ScrollView horizontal>
              {safeEventosRecientes.map((evento, idx) => (
                <View key={evento?.id || idx} style={{ marginRight: 12 }}>
                  <RecentEvents
                    imageUri={validateImageUri(evento?.imagen)}
                    eventName={evento?.nombre}
                    venue={evento?.ubicacion}
                  />
                </View>
              ))}
            </ScrollView>
          )}
        </ScrollView>
      </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  bannerWrapper: {
    width: width - 5,
  },
  agendaWrapper: {
    alignItems: 'center',
    marginTop: 18,
  },
  agendaImage: {
    width: width * 0.32,
    height: width * 0.32,
  },
  ticketWrapper: {
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 9,
    marginTop: 25,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  logOut: {
    marginTop: 20,
    backgroundColor: '#9a0606',
    borderRadius: 8,
    alignItems: 'center',
    width: width * 0.9,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});