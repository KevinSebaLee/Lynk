import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { API_CONFIG, DIMENSIONS } from '@/constants';
import { useApi } from '@/hooks/useApi';
import ApiService from '@/services/api';
import {
  EventHeader,
  EventDetails,
  EventActionButton,
  EventDetailRow,
  EventHostCard,
  EventInviteCard
} from '@/components';

export default function EventoElegido() {
  const { screenWidth: width } = DIMENSIONS;
  const CIRCLE_SIZE = width * 0.84;
  const MAP_SIZE = width * 0.36;

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
      return require('../../../assets/img/fallback_image.jpg');
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
        <EventHeader
          imageSource={getImageSource(eventData.imagen)}
          mapUrl={eventDetails.mapUrl}
          onBackPress={() => navigation.goBack()}
        />

        {/* Event content section */}
        <View style={styles.contentContainer}>
          <EventDetails
            eventDetails={eventDetails}
            fullDate={fullDate}
            eventData={eventData}
          />
          {      console.log('Event Details:', eventDetails.enrollmentEnabled)}
          {/* Join/Leave event button */}
          <EventActionButton
            agendado={agendado}
            loadingAgendar={loadingAgendar}
            enrollmentEnabled={true}
            onPress={handleAgendarEvento}
            variant="join"
          />

          <EventDetailRow
            icon="calendar-outline"
            title={fullDate}
            description={eventData.hora || (eventData.start_date ? new Date(eventData.start_date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) : '')}
          />

          <EventDetailRow
            icon="location-outline"
            title={eventData.ubicacion || 'Ubicación no especificada'}
            description={eventData.direccion}
          />

          {eventDetails.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>Descripción</Text>
              <Text style={styles.descriptionText}>{eventDetails.description}</Text>
            </View>
          )}

          {/* Event host section */}
          <EventHostCard creator={eventDetails.creator} />

          {/* Invite friends section */}
          <EventInviteCard />
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
    contentContainer: {
      paddingHorizontal: 20,
      paddingTop: 50,
      paddingBottom: 30,
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
  });