import React, { useState, useEffect } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AgendaIcon from '../components/agenda.js';
import EventCard from '../components/EventCard.js';
import RecentEvents from '../components/RecentEvents';
import ApiService from '../services/api';
import { useApi } from '../hooks/useApi';
import { LoadingSpinner, Button } from '../components/common';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function Home() {
  const navigation = useNavigation();
  const { logout, userDataCache, clearUserDataCache } = useAuth();

  // State for user and events
  const [userData, setUserData] = useState(null);
  const [eventosRecientes, setEventosRecientes] = useState([]);
  const [eventosUser, setEventosUser] = useState([]);

  // Use the API hook for loading home data
  const { loading, execute: loadHomeData } = useApi(ApiService.getHomeData);
  const { execute: loadTickets } = useApi(ApiService.getTickets);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await loadHomeData();
        if (data) {
          setUserData(data.user);
          if (data.eventosRecientes) {
            setEventosRecientes(data.eventosRecientes || []);
          }
          if(data.eventosUsuario){
            setEventosUser(data.eventosUsuario || []);
          }
        }
      } catch (error) {
        // Error is already handled by the ApiService
      }
    };
    loadUserData();
  }, [userDataCache, clearUserDataCache]);

  // Handler for tickets press
  const handleTicketsPress = async () => {
    try {
      const data = await loadTickets();
      navigation.navigate('tickets', data);
    } catch (error) {
      // Error is already handled by the ApiService
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading && !userData) {
    return <LoadingSpinner />;
  }

  // Function to validate image URIs
  const validateImageUri = (uri) => {
    if (typeof uri === 'string' && uri.trim() !== '') {
      return uri;
    } else if (uri && typeof uri === 'object' && uri.uri && typeof uri.uri === 'string') {
      return uri.uri;
    }
    return null; // Let the component handle the fallback
  };

  // Safely access arrays
  const safeEventosRecientes = Array.isArray(eventosRecientes) ? eventosRecientes : [];
  const safeEventosUser = Array.isArray(eventosUser) ? eventosUser : [];

  return (
    <View style={styles.container}>
      {/* Fixed gradient background */}
      <LinearGradient
        colors={['#642684', '#ffffff', '#ffffff']}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Scrollable content */}
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Header nombre={userData?.user_nombre || 'Usuario'} />
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
                    />
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text style={{color: '#642684', marginTop: 10}}>No tienes eventos propios aún.</Text>
            )}
            <View style={{ marginTop: 20 }}>
              <Button title="Cerrar Sesión" style={styles.logOut} onPress={handleLogout} />
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
});