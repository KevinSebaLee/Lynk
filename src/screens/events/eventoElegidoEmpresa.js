import React, { useEffect, useState, useCallback } from 'react';
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
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { API_CONFIG } from '@/constants';
import ApiService from '@/services/api';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useApi } from '@/hooks/useApi';
import { EventActionButton, EventDetailRow } from '@/components';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.84;
const MAP_SIZE = width * 0.36;

export default function EventoElegidoEmpresa() {
  const route = useRoute();
  const navigation = useNavigation();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [monthlyInscriptions, setMonthlyInscriptions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const { execute: loadEventDetails } = useApi(ApiService.getEventoById);
  const { execute: borrarEvento, loading: loadingBorrar } = useApi(ApiService.borrarEvento);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const eventFromParams = route?.params?.event;
        if (eventFromParams) {
          if (eventFromParams.id) {
            try {
              const eventData = await loadEventDetails(eventFromParams.id);
              const scheduled = await loadScheduledEvents();

              let found = false;
              for (let i = 0; i < scheduled.length; i++) {
                if (String(scheduled[i].id) === String(eventFromParams.id)) {
                  found = true;
                  break;
                }
              }

              setEvent(Array.isArray(eventData) ? eventData[0] : eventData);
              
              // Sample monthly inscriptions data
              // In a real app, you would fetch this from an API
              setMonthlyInscriptions([
                { month: 1, inscriptions: 15 },
                { month: 2, inscriptions: 23 },
                { month: 3, inscriptions: 18 },
                { month: 4, inscriptions: 32 },
                { month: 5, inscriptions: 45 },
                { month: 6, inscriptions: 28 }
              ]);
              setSelectedMonth(5); // Set current month as selected
              
            } catch (error) {
              setEvent(eventFromParams);
            }
          } else {
            setEvent(eventFromParams);
          }
        }
      } catch (error) {
        console.error('Error loading event:', error);
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [route?.params?.event]);

  const handleBorrarEvento = useCallback(async () => {
    if (!event?.id) return;
      try {
        await borrarEvento(event.id);
        Alert.alert('Te has unido al evento con éxito.');
      } catch (error) {
        // Error already handled
      }
    
  }, [event,borrarEvento]);

  const getImageSource = (imagen) => {
    if (typeof imagen === 'string' && imagen.startsWith('/uploads/')) {
      return { uri: `${API_CONFIG.BASE_URL}${imagen}` };
    }
    if (typeof imagen === 'string' && imagen.startsWith('data:image')) {
      return { uri: imagen };
    }
    if (typeof imagen === 'string' && imagen.trim() !== '') {
      return { uri: imagen };
    }
    return require('../../assets/img/fallback_image.jpg');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#642684" />
        <Text style={styles.loadingText}>Cargando evento...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudo cargar el evento</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const dateObj = new Date(event.start_date || event.fecha);
  const dateStr = dateObj.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
  const dayOfWeek = dateObj.toLocaleDateString('es-AR', { weekday: 'long' });
  const fullDate = `${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}, ${dateStr}`;

  // Handle both old and new API response formats
  const getEventName = () => event.name || event.nombre || 'Evento';
  const getEventDescription = () => event.description || event.descripcion || '';
  const getEventPrice = () => event.price || event.precio || null;
  const getEventCapacity = () => event.max_assistance || event.capacidad || null;
  const getEventDuration = () => event.duration_in_minutes || null;
  const getEventLocation = () => event.event_location || null;
  const getEventCreator = () => event.creator_user || null;
  const getEventTags = () => event.tags || [];
  const isEnrollmentEnabled = () => event.enabled_for_enrollment === '1' || event.enabled_for_enrollment === true;

  // Generate map URL from event location if available
  const getMapUrl = () => {
    const location = getEventLocation();
    if (location && location.latitude && location.longitude) {
      return `https://maps.googleapis.com/maps/api/staticmap?center=${location.latitude},${location.longitude}&zoom=15&size=220x120&markers=color:0x6a2a8c|${location.latitude},${location.longitude}&key=YOUR_API_KEY`;
    }
    return 'https://maps.googleapis.com/maps/api/staticmap?center=-34.5889,-58.4173&zoom=15&size=220x120&markers=color:0x6a2a8c|-34.5889,-58.4173&key=YOUR_API_KEY';
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <LinearGradient colors={['#aeea00', '#ffffff']} style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <Ionicons name="arrow-back" size={28} color="#fff" onPress={() => navigation.goBack()} />
        </View>
        <View style={styles.topRow}>
          <View style={styles.leftCircleWrapper}>
            <ImageBackground
              source={getImageSource(event.imagen || event.image)}
              style={styles.eventImageCircle}
              imageStyle={{ borderRadius: CIRCLE_SIZE / 2 }}
            >
              <View style={styles.mapCircleOverlay}>
                <Image
                  source={{ uri: getMapUrl() }}
                  style={styles.mapCircle}
                  resizeMode="cover"
                />
              </View>
            </ImageBackground>
          </View>
          <View style={styles.iconStack}>
            <View style={styles.iconCircle}><MaterialCommunityIcons name="leaf" size={26} color="#38C172" /></View>
            <View style={styles.iconCircle}><MaterialCommunityIcons name="earth" size={26} color="#6a2a8c" /></View>
            <View style={styles.iconCircle}><Ionicons name="location-outline" size={26} color="#222" /></View>
          </View>
        </View>
      </LinearGradient>
      <View style={styles.detailsCard}>
        <Text style={styles.title}>{getEventName()} <Ionicons name="heart-outline" size={16} color="#9F4B97" /></Text>
        <Text style={styles.subtitle}>{event.categoria_nombre || 'Evento'}</Text>
        
        {getEventPrice() && (
          <Text style={styles.price}>Precio: ${getEventPrice()}</Text>
        )}
        {getEventCapacity() && (
          <Text style={styles.capacity}>Capacidad: {getEventCapacity()} personas</Text>
        )}
        {getEventDuration() && (
          <Text style={styles.duration}>Duración: {getEventDuration()} minutos</Text>
        )}
        
        <EventActionButton
          agendado={false}
          loadingAgendar={loadingBorrar}
          enrollmentEnabled={isEnrollmentEnabled()}
          onPress={handleBorrarEvento}
          variant="delete"
        />
        
        <EventDetailRow
          icon="calendar-outline"
          title={fullDate}
          description={event.hora || (event.start_date ? new Date(event.start_date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) : '')}
        />
        
        <EventDetailRow
          icon="location-outline"
          title={getEventLocation()?.name || event.ubicacion || 'Ubicación'}
          description={`${getEventLocation()?.full_address || event.direccion || ''}${getEventLocation()?.location?.name ? `, ${getEventLocation().location.name}` : ''}${getEventLocation()?.location?.province?.name ? `, ${getEventLocation().location.province.name}` : ''}`}
        />

        {getEventCreator() && (
          <EventDetailRow
            icon="person-outline"
            title="Organizador"
            description={`${getEventCreator().first_name} ${getEventCreator().last_name}`}
          />
        )}

        {getEventTags().length > 0 && (
          <View style={styles.tagsContainer}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsRow}>
              {getEventTags().map((tag, index) => (
                <View key={tag.id || index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Sobre el evento</Text>
        <Text style={styles.eventDescription}>{getEventDescription()}</Text>
        <View style={styles.inviteCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={styles.inviteBtn}>
              <Text style={styles.inviteBtnText}>Participantes</Text>
              
              {/* Monthly Inscriptions Chart */}
              <MonthlyInscriptionsChart
                data={monthlyInscriptions}
                selectedMonth={selectedMonth}
                onMonthSelect={(month) => setSelectedMonth(month)}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // All the styles remain the same...
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
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#642684',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerGradient: {
    paddingTop: 44,
    paddingBottom: 22,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
    zIndex: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 0,
    zIndex: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    width: '100%',
    minHeight: CIRCLE_SIZE + 18,
    position: 'relative',
  },
  leftCircleWrapper: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    marginLeft: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    position: 'relative',
    zIndex: 1,
  },
  eventImageCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    overflow: 'hidden',
    backgroundColor: '#eee',
    shadowColor: '#222',
    shadowOpacity: 0.11,
    shadowRadius: 11,
    elevation: 7,
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  mapCircleOverlay: {
    position: 'absolute',
    bottom: -MAP_SIZE * 0.19,
    right: -MAP_SIZE * 0.17,
    zIndex: 10,
    elevation: 10,
    shadowColor: '#222',
    shadowOpacity: 0.23,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
  },
  mapCircle: {
    width: MAP_SIZE,
    height: MAP_SIZE,
    borderRadius: MAP_SIZE / 2,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  iconStack: {
    position: 'absolute',
    right: 28,
    top: 42,
    gap: 15,
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 4,
  },
  iconCircle: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    marginBottom: 15,
    shadowColor: '#222',
    shadowOpacity: 0.13,
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsCard: {
    marginTop: 0,
    backgroundColor: '#fff',
    marginHorizontal: 0,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.09,
    shadowRadius: 9,
    elevation: 3,
    zIndex: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#18193f',
    marginBottom: 4,
    marginTop: 8,
  },
  subtitle: {
    color: '#888',
    marginBottom: 9,
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 2,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#642684',
    marginBottom: 4,
  },
  capacity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  duration: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  tagsContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#e6e1f7',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    color: '#642684',
    fontSize: 12,
    fontWeight: '500',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 32,
    marginBottom: 4,
    color: '#18193f',
  },
  eventDescription: {
    color: '#444',
    fontSize: 15,
    marginBottom: 11,
    marginTop: 3,
    lineHeight: 22,
  },
  inviteCard: {
    backgroundColor: '#9F4B97',
    borderRadius: 13,
    padding: 18,
    marginTop: 9,
    marginBottom: 7,
    shadowColor: '#9F4B97',
    shadowOpacity: 0.09,
    shadowRadius: 9,
    elevation: 2,
  },
  inviteBtn: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 19,
    paddingVertical: 6,
    alignSelf: 'flex-end',
    marginLeft: 10,
    marginTop: 4,
    width: '100%',
  },
  inviteBtnText: {
    color: '#9F4B97',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});