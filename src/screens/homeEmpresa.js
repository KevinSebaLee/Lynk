import React, { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Pressable,
  Text,
  TouchableOpacity 
} from 'react-native';
import Header from '../components/header.js';
import PremiumBanner from '../components/premiumBanner.js';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext.js';
import AgendaIcon from '../components/agenda.js';
import EventCard from '../components/EventCard.js';
import RecentEvents from '../components/RecentEvents.js';
import ApiService from '../services/api.js';
import { useApi } from '../hooks/useApi.js';
import { LoadingSpinner, Button, AgendaSection, SectionHeader } from '../components/common/index.js';
import { LinearGradient } from 'expo-linear-gradient';
const { width } = Dimensions.get('window');

export default function Home() {
  const navigation = useNavigation();
  const { logout, userDataCache, clearUserDataCache } = useAuth();

  // State for user and events
  const [userData, setUserData] = useState(null);
  const [eventosRecientes, setEventosRecientes] = useState([]);

  // Use the API hook for loading home data
  const { loading, execute: loadHomeData } = useApi(ApiService.getHomeData);
  const { execute: loadTickets } = useApi(ApiService.getTickets);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      /**
       * Load user data with cache check and API fallback
       */
      const refreshData = async () => {
        try {
          // Check if we have cached user data from registration
          if (userDataCache) {
            setUserData(userDataCache);
            if (userDataCache.eventosRecientes) {
              setEventosRecientes(userDataCache.eventosRecientes || []);
            }
            // Clear the cache after using it
            clearUserDataCache();
            return;
          }

          // Otherwise, load data from API as usual
          const data = await loadHomeData();
          if (data) {
            setUserData(data.user);
            if (data.eventosRecientes) {
              setEventosRecientes(data.eventosRecientes || []);
            }
          }
        } catch {
          // Error is already handled by the ApiService
        }
      };
      
      // Start data loading
      refreshData();
      
      // Cleanup function (no cleanup needed in this case)
      return () => {};
    }, [userDataCache, clearUserDataCache, loadHomeData])
  );

  // Handler for tickets press
  const handleTicketsPress = useCallback(async () => {
    try {
      const data = await loadTickets();
      navigation.navigate('tickets', data);
    } catch {
      // Error is already handled by the ApiService
    }
  }, [loadTickets, navigation]);

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  // Function to validate image URIs
  const validateImageUri = useCallback((uri) => {
    if (typeof uri === 'string' && uri.trim() !== '') {
      return uri;
    } else if (uri && typeof uri === 'object' && uri.uri && typeof uri.uri === 'string') {
      return uri.uri;
    }
    return null; // Let the component handle the fallback
  }, []);

  // Safely access array
  const safeEventosRecientes = Array.isArray(eventosRecientes) ? eventosRecientes : [];

  const isLoading = loading && !userData;

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
        pointerEvents="none"/>
          <Header nombre={userData?.user_nombre || 'Usuario'} />
          <Pressable onPress={handleTicketsPress}>
            <View style={styles.ticketWrapper}>
            </View>
          </Pressable>
       

          <View style={styles.bannerWrapper}>
            <PremiumBanner plan={userData?.plan_titulo} />
          </View>
          
          <AgendaSection 
            eventosRecientes={safeEventosRecientes}
            validateImageUri={validateImageUri}
            onLogout={handleLogout}
          />
          
          <SectionHeader 
            title="Eventos mas recientes"
            showSeeMore={true}
            onSeeMore={() => navigation.navigate('Eventos')}
          />
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
  ticketWrapper: {
    marginVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});