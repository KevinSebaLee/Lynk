import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { API_CONFIG } from '../constants/config';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useApi } from '../hooks/useApi';
import ApiService from '../services/api.js';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.84;
const MAP_SIZE = width * 0.36;

export default function EventoElegido() {
  // Navigation and route hooks
  const route = useRoute();
  const navigation = useNavigation();
  
  // State for event data and UI
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eventosAgendados, setEventosAgendados] = useState([]);
  const [agendado, setAgendado] = useState(false);

  // API hooks - declare all hooks at the top level
  const { execute: loadEventDetails } = useApi(ApiService.getEventoById);
  const { execute: agendarEvento, loading: loadingAgendar } = useApi(ApiService.agendarEvento);
  const { execute: loadScheduledEvents } = useApi(ApiService.getEventosAgendados);
  const { execute: deleteScheduledEvent } = useApi(ApiService.deleteEventoAgendado);
  
  // Process date information - declare all useMemo hooks consistently
  const dateObj = useMemo(() => {
    if (!eventData) return new Date();
    return new Date(eventData?.start_date || eventData?.fecha || Date.now());
  }, [eventData]);
  
  const dateStr = useMemo(() => {
    return dateObj.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
  }, [dateObj]);
  
  const dayOfWeek = useMemo(() => {
    return dateObj.toLocaleDateString('es-AR', { weekday: 'long' });
  }, [dateObj]);
  
  const fullDate = useMemo(() => {
    return `${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}, ${dateStr}`;
  }, [dayOfWeek, dateStr]);
  
  // Process event details with consistent hook usage
  const eventDetails = useMemo(() => {
    if (!eventData) return {
      name: 'Cargando...',
      description: '',
      price: null,
      capacity: null,
      duration: null,
      location: null,
      creator: null,
      tags: [],
      enrollmentEnabled: false,
      mapUrl: 'https://maps.googleapis.com/maps/api/staticmap?center=-34.5889,-58.4173&zoom=15&size=220x120&markers=color:0x6a2a8c|-34.5889,-58.4173&key=YOUR_API_KEY'
    };
    
    return {
      // Extract event name, falling back to defaults if needed
      name: eventData.name || eventData.nombre || 'Evento',
      
      // Extract event description
      description: eventData.description || eventData.descripcion || '',
      
      // Extract price info
      price: eventData.price || eventData.precio || null,
      
      // Extract capacity info
      capacity: eventData.max_assistance || eventData.capacidad || null,
      
      // Extract duration in minutes
      duration: eventData.duration_in_minutes || null,
      
      // Extract location info
      location: eventData.event_location || null,
      
      // Extract creator info
      creator: eventData.creator_user || null,
      
      // Extract event tags
      tags: eventData.tags || [],
      
      // Check if enrollment is enabled
      enrollmentEnabled: eventData.enabled_for_enrollment === '1' || eventData.enabled_for_enrollment === true,
      
      // Generate map URL from event location
      mapUrl: (() => {
        const location = eventData.event_location;
        if (location && location.latitude && location.longitude) {
          return `https://maps.googleapis.com/maps/api/staticmap?center=${location.latitude},${location.longitude}&zoom=15&size=220x120&markers=color:0x6a2a8c|${location.latitude},${location.longitude}&key=YOUR_API_KEY`;
        }
        // Default map location if none provided
        return 'https://maps.googleapis.com/maps/api/staticmap?center=-34.5889,-58.4173&zoom=15&size=220x120&markers=color:0x6a2a8c|-34.5889,-58.4173&key=YOUR_API_KEY';
      })()
    };
  }, [eventData]);

  // Convert different image formats to a standard image source object
  const getImageSource = useCallback((imagen) => {
    // Server-uploaded images start with "/uploads/"
    if (typeof imagen === 'string' && imagen.startsWith('/uploads/')) {
      return { uri: `${API_CONFIG.BASE_URL}${imagen}` };
    }
    // Data URLs (base64)
    if (typeof imagen === 'string' && imagen.startsWith('data:image')) {
      return { uri: imagen };
    }
    // Regular URLs
    if (typeof imagen === 'string' && imagen.trim() !== '') {
      return { uri: imagen };
    }
    // Fallback image when no valid image is provided
    return require('../../assets/img/fallback_image.jpg');
  }, []);
  
  // Handle joining/leaving events
  const handleAgendarEvento = useCallback(async () => {
    if (!eventData?.id) return;

    if (!agendado) {
      try {
        await agendarEvento(eventData.id);
        Alert.alert('Te has unido al evento con éxito.');
        setAgendado(true);
      } catch (error) {
        // Error already handled
      }
    } else {
      try {
        await deleteScheduledEvent(eventData.id);
        Alert.alert('Te has salido del evento con éxito.');
        setAgendado(false);
      } catch (err) {
        // Error already handled
      }
    }
  }, [eventData, agendado, agendarEvento, deleteScheduledEvent]);

  // Load event details and check if the user has scheduled it - useEffect last
  useEffect(() => {
    const loadEvent = async () => {
      try {
        const eventFromParams = route?.params?.event;
        if (!eventFromParams) {
          setLoading(false);
          return;
        }
        
        // If we have an event ID, fetch detailed info from API
        if (eventFromParams.id) {
          try {
            // Load event details and user's scheduled events in parallel
            const [eventData, scheduled] = await Promise.all([
              loadEventDetails(eventFromParams.id),
              loadScheduledEvents()
            ]);
            
            setEventosAgendados(scheduled || []);

            // Check if this event is in the user's scheduled events
            const found = (scheduled || []).some(item => 
              String(item.id) === String(eventFromParams.id)
            );
            setAgendado(found);

            // Handle both array and object responses from API
            setEventData(Array.isArray(eventData) ? eventData[0] : eventData);
          } catch (error) {
            // Fallback to event data from params if API fails
            setEventData(eventFromParams);
          }
        } else {
          // Use event data directly from navigation params
          setEventData(eventFromParams);
        }
      } catch (error) {
        // Log error but don't crash the app
        console.error('Error loading event:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadEvent();
  }, [route?.params?.event, loadEventDetails, loadScheduledEvents]);

  // Render loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#642684" />
        <Text style={styles.loadingText}>Cargando evento...</Text>
      </View>
    );
  }

  // Render error state
  if (!eventData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudo cargar el evento</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Main render with event data
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header section with gradient background */}
      <LinearGradient colors={['#aeea00', '#ffffff']} style={styles.headerGradient}>
        {/* Back button */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {/* Event image and map section */}
        <View style={styles.imageContainer}>
          <ImageBackground
            source={getImageSource(eventData.imagen)}
            style={styles.eventImage}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.5)']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.eventCircle}>
              <View style={styles.mapWrapper}>
                <Image
                  source={{ uri: eventDetails.mapUrl }}
                  style={styles.mapImage}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']}
                  style={StyleSheet.absoluteFill}
                />
              </View>
            </View>
          </ImageBackground>
        </View>
      </LinearGradient>

      {/* Event content section */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          {eventDetails.name} <Ionicons name="heart-outline" size={16} color="#9F4B97" />
        </Text>
        <Text style={styles.subtitle}>{eventData.categoria_nombre || 'Evento'}</Text>
        
        {/* Price information (if available) */}
        {eventDetails.price && (
          <Text style={styles.price}>Precio: ${eventDetails.price}</Text>
        )}
        
        {/* Capacity information (if available) */}
        {eventDetails.capacity && (
          <Text style={styles.capacity}>Capacidad: {eventDetails.capacity} personas</Text>
        )}
        
        {/* Duration information (if available) */}
        {eventDetails.duration && (
          <Text style={styles.duration}>Duración: {eventDetails.duration} minutos</Text>
        )}
        
        {/* Join/Leave event button */}
        <TouchableOpacity
          style={[
            styles.joinBtn,
            agendado && styles.joinBtnUnido,
            !eventDetails.enrollmentEnabled && styles.joinBtnDisabled
          ]}
          onPress={handleAgendarEvento}
          disabled={loadingAgendar || !eventDetails.enrollmentEnabled}
        >
          <Text style={[styles.joinBtnText, agendado && styles.joinBtnTextUnido]}>
            {!eventDetails.enrollmentEnabled 
              ? 'INSCRIPCIÓN CERRADA' 
              : (agendado ? 'UNIDO' : (loadingAgendar ? 'Uniendo...' : 'UNIRME'))
            }
          </Text>
        </TouchableOpacity>
        
        <View style={styles.detailRow}>
          <View style={styles.detailIconBox}><Ionicons name="calendar-outline" size={22} color="#9F4B97" /></View>
          <View>
            <Text style={styles.detailTitle}>{fullDate}</Text>
            <Text style={styles.detailDescription}>
              {eventData.hora || (eventData.start_date ? new Date(eventData.start_date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) : '')}
            </Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailIconBox}><Ionicons name="location-outline" size={22} color="#9F4B97" /></View>
          <View>
            <Text style={styles.detailTitle}>{eventData.ubicacion || 'Ubicación no especificada'}</Text>
            {eventData.direccion && (
              <Text style={styles.detailDescription}>{eventData.direccion}</Text>
            )}
          </View>
        </View>
        
        {eventDetails.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Descripción</Text>
            <Text style={styles.descriptionText}>{eventDetails.description}</Text>
          </View>
        )}
        
        {/* Event host section */}
        {eventDetails.creator && (
          <View style={styles.hostContainer}>
            <Text style={styles.hostLabel}>Organizado por</Text>
            <View style={styles.hostCard}>
              <Image 
                source={{ uri: 'https://i.pravatar.cc/120' }} 
                style={styles.hostImage} 
              />
              <View style={styles.hostInfo}>
                <Text style={styles.hostName}>{eventDetails.creator.nombre || 'Organizador'}</Text>
                <Text style={styles.hostRole}>Creador del evento</Text>
              </View>
            </View>
          </View>
        )}
        
        {/* Invite friends section */}
        <View style={styles.inviteContainer}>
          <LinearGradient colors={['#9742CF', '#642684']} style={styles.inviteCard}>
            <View style={styles.inviteContent}>
              <Image 
                source={require('../../assets/img/icons/comprar.png')} 
                style={styles.inviteImage} 
              />
              <View>
                <Text style={styles.inviteTitle}>¡Invita a tus amigos!</Text>
                <Text style={styles.inviteSubtitle}>Comparte este evento</Text>
              </View>
            </View>
            <Ionicons name="share-outline" size={24} color="#fff" />
          </LinearGradient>
        </View>
      </View>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#642684',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#d32f2f',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#642684',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  headerGradient: {
    paddingTop: 44,
    paddingHorizontal: 16,
    paddingBottom: 0,
    overflow: 'visible',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    zIndex: 10,
  },
  imageContainer: {
    alignItems: 'center',
    position: 'relative',
    marginBottom: -40,
  },
  eventImage: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE * 0.65,
    borderRadius: 12,
    overflow: 'hidden',
  },
  eventCircle: {
    position: 'absolute',
    bottom: -42,
    right: 12,
    backgroundColor: '#fff',
    width: MAP_SIZE,
    height: MAP_SIZE,
    borderRadius: MAP_SIZE / 2,
    overflow: 'hidden',
    padding: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  mapWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: (MAP_SIZE - 12) / 2,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  price: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9F4B97',
    marginBottom: 3,
  },
  capacity: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  duration: {
    fontSize: 14,
    color: '#555',
    marginBottom: 18,
  },
  joinBtn: {
    backgroundColor: '#642684',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#642684',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 2,
  },
  joinBtnUnido: {
    backgroundColor: '#77c300',
  },
  joinBtnDisabled: {
    backgroundColor: '#ccc',
  },
  joinBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  joinBtnTextUnido: {
    color: '#fff',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailIconBox: {
    backgroundColor: '#f8f2fb',
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  detailDescription: {
    fontSize: 14,
    color: '#666',
  },
  descriptionContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  hostContainer: {
    marginBottom: 24,
  },
  hostLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  hostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f2fb',
    borderRadius: 12,
    padding: 14,
  },
  hostImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 14,
  },
  hostInfo: {
    flex: 1,
  },
  hostName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  hostRole: {
    fontSize: 13,
    color: '#777',
  },
  inviteContainer: {
    marginBottom: 16,
  },
  inviteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  inviteContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inviteImage: {
    width: 55,
    height: 55,
    borderRadius: 13,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  inviteTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 3,
  },
  inviteSubtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
});