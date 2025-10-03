import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { API_CONFIG, DIMENSIONS } from '@/constants';
import ApiService from '@/services/api';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useApi } from '@/hooks/useApi';
import { EventActionButton, EventDetailRow } from '@/components';
import { getToken } from '@/utils';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '@/context/AuthContext';

const { screenWidth: width } = DIMENSIONS;
const CIRCLE_SIZE = width * 0.84;
const MAP_SIZE = width * 0.36;

export default function EventoElegidoEmpresa() {
  const route = useRoute();
  const navigation = useNavigation();
  const routeParams = useMemo(() => route?.params || {}, [route?.params]);
  const routeParamsKey = useMemo(() => JSON.stringify(routeParams), [routeParams]);
  const isMountedRef = useRef(true);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scheduledUsersCount, setScheduledUsersCount] = useState(null);
  const [participantsError, setParticipantsError] = useState(null);
  const [participantsFetchSucceeded, setParticipantsFetchSucceeded] = useState(false);
  const [currentUserIds, setCurrentUserIds] = useState([]);

  const { execute: loadEventDetails } = useApi(ApiService.getEventoById);
  const { execute: fetchScheduledUsers, loading: loadingParticipants } = useApi(ApiService.getEventoScheduledUsers);
  const { execute: deleteEvent, loading: deletingEvent } = useApi(ApiService.deleteEvento);
  const { esEmpresa } = useAuth();
  
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const addCandidate = (setRef, value) => {
    if (value === undefined || value === null) return;
    const str = String(value).trim();
    if (!str || str.toLowerCase() === 'null' || str.toLowerCase() === 'undefined') return;
    setRef.add(str);
  };

  const resolveEventIdentifiers = useCallback((eventData, params = {}) => {
    const ids = new Set();
    addCandidate(ids, params?.eventId);
    addCandidate(ids, params?.id);
    addCandidate(ids, params?.eventoId);
    addCandidate(ids, params?.evento_id);
    addCandidate(ids, params?.idEvento);
    addCandidate(ids, params?.companyEventId);
    addCandidate(ids, params?.event?.id);
    addCandidate(ids, params?.event?.event_id);
    addCandidate(ids, params?.event?.id_evento);
    addCandidate(ids, params?.event?.idEvento);
    addCandidate(ids, eventData?.id);
    addCandidate(ids, eventData?._id);
    addCandidate(ids, eventData?.id_evento);
    addCandidate(ids, eventData?.event_id);
    addCandidate(ids, eventData?.evento_id);
    addCandidate(ids, eventData?.idEvento);
    addCandidate(ids, eventData?.id_event);
    addCandidate(ids, eventData?.idAgenda);
    addCandidate(ids, eventData?.agenda_id);
    addCandidate(ids, eventData?.event?.id);
    addCandidate(ids, eventData?.event?.event_id);
    addCandidate(ids, eventData?.event?.id_evento);
    addCandidate(ids, eventData?.event?.idEvento);
    addCandidate(ids, eventData?.evento?.id);
    addCandidate(ids, eventData?.evento?.event_id);
    addCandidate(ids, eventData?.evento?.id_evento);
    addCandidate(ids, eventData?.evento?.idEvento);
    return Array.from(ids);
  }, []);

  const primaryEventId = useMemo(() => {
    const candidates = resolveEventIdentifiers(event, routeParams);
    return candidates.length > 0 ? candidates[0] : null;
  }, [event, routeParamsKey, resolveEventIdentifiers]);

  const refreshScheduledUsers = useCallback(async (eventId) => {
    if (!eventId || !isMountedRef.current) return;

    try {
      if (isMountedRef.current) {
        setParticipantsError(null);
        setParticipantsFetchSucceeded(false);
      }
      const data = await fetchScheduledUsers(eventId);

      if (!isMountedRef.current) {
        return;
      }

      let count = 0;

      if (Array.isArray(data)) {
        count = data.length;
      } else if (Array.isArray(data?.usuarios)) {
        count = data.usuarios.length;
      } else if (Array.isArray(data?.data)) {
        count = data.data.length;
      } else if (typeof data?.count === 'number') {
        count = data.count;
      } else if (typeof data?.total === 'number') {
        count = data.total;
      } else if (typeof data?.cantidad === 'number') {
        count = data.cantidad;
      } else if (typeof data === 'number') {
        count = data;
      } else if (typeof data?.inscripciones === 'number') {
        count = data.inscripciones;
      } else if (Array.isArray(data?.inscripciones)) {
        count = data.inscripciones.length;
      }

      if (isMountedRef.current) {
        setScheduledUsersCount(count);
        setParticipantsFetchSucceeded(true);
      }
    } catch (error) {
      if (isMountedRef.current) {
        setScheduledUsersCount(null);
        setParticipantsError(error);
        setParticipantsFetchSucceeded(false);
      }
    }
  }, [fetchScheduledUsers]);

  useEffect(() => {
    const loadUserId = async () => {
      try {
        const token = await getToken();
        if (token) {
          const decoded = jwtDecode(token);
          const ids = new Set();
          addCandidate(ids, decoded?.id);
          addCandidate(ids, decoded?.ID);
          addCandidate(ids, decoded?.userId);
          addCandidate(ids, decoded?.usuarioId);
          addCandidate(ids, decoded?.usuario_id);
          addCandidate(ids, decoded?.usuario?.id);
          addCandidate(ids, decoded?.usuario?.usuario_id);
          addCandidate(ids, decoded?.user?.id);
          addCandidate(ids, decoded?.user?.user_id);
          addCandidate(ids, decoded?.empresaId);
          addCandidate(ids, decoded?.empresa_id);
          addCandidate(ids, decoded?.empresa?.id);
          addCandidate(ids, decoded?.companyId);
          addCandidate(ids, decoded?.company_id);
          addCandidate(ids, decoded?.company?.id);
          addCandidate(ids, decoded?.sub);
          addCandidate(ids, decoded?.uid);
          addCandidate(ids, decoded?.uuid);
          if (isMountedRef.current) {
            setCurrentUserIds(Array.from(ids));
          }
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    };

    loadUserId();
  }, []);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const eventFromParams = routeParams?.event;
        let resolvedEvent = eventFromParams || null;
        let candidateIds = resolveEventIdentifiers(resolvedEvent, routeParams);
        let candidateId = candidateIds.length > 0 ? candidateIds[0] : null;

        if (!resolvedEvent && !candidateId) {
          if (isMountedRef.current) {
            setEvent(null);
            setScheduledUsersCount(null);
          }
          return;
        }

        if (!candidateId) {
          const fallbackIds = resolveEventIdentifiers(null, routeParams);
          if (fallbackIds.length > 0) {
            candidateId = fallbackIds[0];
          }
        }

        if (candidateId && (!resolvedEvent || String(resolvedEvent?.id) !== String(candidateId))) {
          try {
            const eventData = await loadEventDetails(candidateId);
            const parsedEvent = Array.isArray(eventData) ? eventData[0] : eventData;
            if (parsedEvent && isMountedRef.current) {
              resolvedEvent = parsedEvent;
            }
          } catch (error) {
            console.warn('Falling back to navigation params for event data due to fetch error.', error);
          }
        } else if (resolvedEvent?.id) {
          try {
            const eventData = await loadEventDetails(resolvedEvent.id);
            const parsedEvent = Array.isArray(eventData) ? eventData[0] : eventData;
            if (parsedEvent && isMountedRef.current) {
              resolvedEvent = parsedEvent;
            }
          } catch (error) {
            console.warn('Unable to refresh event details; using provided params.', error);
          }
        }

        const finalIds = resolveEventIdentifiers(resolvedEvent, routeParams);
        const eventIdForCount = finalIds.length > 0 ? finalIds[0] : candidateId;

        if (isMountedRef.current) {
          setEvent(resolvedEvent);
        }

        if (eventIdForCount) {
          await refreshScheduledUsers(eventIdForCount);
        } else if (isMountedRef.current) {
          setScheduledUsersCount(null);
        }
      } catch (error) {
        console.error('Error loading event:', error);
        if (isMountedRef.current) {
          setEvent(null);
          setScheduledUsersCount(null);
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    loadEvent();
  }, [routeParamsKey, loadEventDetails, refreshScheduledUsers, resolveEventIdentifiers]);

  const handleDeleteEventPress = useCallback(() => {
    const deleteId = primaryEventId;
    if (!deleteId) return;

    Alert.alert(
      'Eliminar evento',
      '¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEvent(deleteId);
              Alert.alert('Evento eliminado', 'El evento se ha eliminado correctamente.');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el evento.');
            }
          },
        },
      ],
    );
  }, [primaryEventId, deleteEvent, navigation]);

  const eventOwnerIds = useMemo(() => {
    if (!event) return null;
    const ids = new Set();
    const routeEvent = routeParams?.event;
    addCandidate(ids, routeParams?.ownerId);
    addCandidate(ids, routeParams?.owner_id);
    addCandidate(ids, routeParams?.creatorId);
    addCandidate(ids, routeParams?.creator_id);
    addCandidate(ids, routeParams?.empresaId);
    addCandidate(ids, routeParams?.empresa_id);
    addCandidate(ids, routeParams?.companyId);
    addCandidate(ids, routeParams?.company_id);
    addCandidate(ids, routeParams?.userId);
    addCandidate(ids, routeEvent?.empresaId);
    addCandidate(ids, routeEvent?.empresa_id);
    addCandidate(ids, routeEvent?.companyId);
    addCandidate(ids, routeEvent?.company_id);
    addCandidate(ids, routeEvent?.userId);
    addCandidate(ids, routeEvent?.user_id);
    addCandidate(ids, routeEvent?.creator_id);
    addCandidate(ids, routeEvent?.creatorId);
    addCandidate(ids, routeEvent?.owner_id);
    addCandidate(ids, routeEvent?.ownerId);
    addCandidate(ids, routeEvent?.organizer_id);
    addCandidate(ids, routeEvent?.organizerId);
    addCandidate(ids, event?.creator_user?.id);
    addCandidate(ids, event?.creator_user?.user_id);
    addCandidate(ids, event?.creator_user_id);
    addCandidate(ids, event?.creatorUserId);
    addCandidate(ids, event?.id_usuario);
    addCandidate(ids, event?.usuario_id);
    addCandidate(ids, event?.usuario?.id);
    addCandidate(ids, event?.user_id);
    addCandidate(ids, event?.userId);
    addCandidate(ids, event?.empresa_id);
    addCandidate(ids, event?.empresa?.id);
    addCandidate(ids, event?.empresaId);
    addCandidate(ids, event?.company_id);
    addCandidate(ids, event?.companyId);
    addCandidate(ids, event?.owner_id);
    addCandidate(ids, event?.ownerId);
    addCandidate(ids, event?.created_by);
    addCandidate(ids, event?.creado_por);
    addCandidate(ids, event?.creador_id);
    addCandidate(ids, event?.organizer_id);
    addCandidate(ids, event?.organizer?.id);
    return Array.from(ids);
  }, [event, routeParamsKey]);

  const parseCountValue = useCallback((value) => {
    if (value === undefined || value === null) return null;
    if (Array.isArray(value)) {
      return value.length;
    }
    const num = Number(value);
    if (!Number.isNaN(num)) {
      return num;
    }
    return null;
  }, []);

  const fallbackScheduledCount = useMemo(() => {
    if (!event && !routeParamsKey) return null;
    const candidates = [
      routeParams?.scheduledCount,
      routeParams?.scheduled_count,
      routeParams?.agendados,
      routeParams?.inscripciones,
      routeParams?.attendees,
      event?.usuarios_agendados,
      event?.agendados,
      event?.inscriptos,
      event?.inscripciones,
      event?.asistentes,
      event?.attendees,
      event?.participant_count,
      event?.participants_count,
      event?.inscriptions_count,
      event?.inscripciones_count,
      event?.cantidad_agendados,
      event?.cantidadAgendados,
      event?.total_agendados,
      event?.totalAgendados,
      event?.estadisticas?.agendados,
      event?.estadisticas?.inscriptos,
      event?.estadisticas?.inscripciones,
      event?.stats?.agendados,
      event?.stats?.inscripciones,
      event?.analytics?.agendados,
      event?.metrics?.agendados,
      event?.metrics?.inscripciones,
      event?.detalle?.agendados,
      event?.detalle?.inscriptos,
      event?.detalle?.inscripciones,
    ];

    for (const candidate of candidates) {
      const parsed = parseCountValue(candidate);
      if (parsed !== null) {
        return parsed;
      }
    }

    return null;
  }, [event, routeParamsKey, routeParams, parseCountValue]);

  const displayScheduledCount = useMemo(() => {
    if (scheduledUsersCount !== null) {
      return scheduledUsersCount;
    }

    if (fallbackScheduledCount !== null) {
      return fallbackScheduledCount;
    }

    return null;
  }, [scheduledUsersCount, fallbackScheduledCount]);

  const showParticipantsError = useMemo(() => {
    return !!participantsError && participantsFetchSucceeded === false && displayScheduledCount === null;
  }, [participantsError, participantsFetchSucceeded, displayScheduledCount]);

  const isOwner = useMemo(() => {
    if (routeParams?.isOwner != null) {
      return !!routeParams.isOwner;
    }

    if (typeof routeParams?.canDelete === 'boolean') {
      return routeParams.canDelete;
    }

    if (typeof event?.esPropio === 'boolean') {
      return event.esPropio;
    }

    if (typeof event?.isOwner === 'boolean') {
      return event.isOwner;
    }

    if (eventOwnerIds?.length && currentUserIds.length) {
      return eventOwnerIds.some(ownerId => currentUserIds.includes(ownerId));
    }

    if (esEmpresa && (routeParams?.fromCompany || routeParams?.isCompany || routeParams?.companyView)) {
      return true;
    }

    return false;
  }, [routeParamsKey, routeParams, event, eventOwnerIds, currentUserIds, esEmpresa]);

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
    return require('../../../assets/img/fallback_image.jpg');
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
        
        {isOwner ? (
          <EventActionButton
            agendado={false}
            loadingAgendar={deletingEvent}
            enrollmentEnabled={true}
            onPress={handleDeleteEventPress}
            variant="delete"
          />
        ) : (
          <View style={styles.ownerNotice}>
            <Ionicons name="lock-closed" size={18} color="#642684" style={{ marginRight: 6 }} />
            <Text style={styles.ownerNoticeText}>Sólo el organizador puede eliminar este evento.</Text>
          </View>
        )}
        
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
          <View style={styles.participantsHeader}>
            <Text style={styles.sectionTitle}>Participantes</Text>
            <TouchableOpacity
              onPress={() => refreshScheduledUsers(primaryEventId)}
              disabled={loadingParticipants || !primaryEventId}
              style={[styles.refreshButton, (loadingParticipants || !primaryEventId) && styles.refreshButtonDisabled]}
            >
              <Ionicons name="refresh" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.participantsRow}>
            <Text style={styles.participantsLabel}>Usuarios agendados</Text>
            {loadingParticipants ? (
              <ActivityIndicator size="small" color="#642684" />
            ) : (
              <Text style={styles.participantsValue}>
                {displayScheduledCount !== null ? displayScheduledCount : '—'}
              </Text>
            )}
          </View>
          {showParticipantsError && (
            <Text style={styles.participantsErrorText}>No se pudieron cargar los participantes.</Text>
          )}
          {!loadingParticipants && displayScheduledCount === 0 && (
            <Text style={styles.participantsEmptyText}>Aún no hay usuarios agendados.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

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
  joinBtn: {
    backgroundColor: '#642684',
    borderRadius: 9,
    alignSelf: 'flex-start',
    paddingHorizontal: 26,
    paddingVertical: 11,
    marginVertical: 8,
    marginBottom: 13,
    minWidth: 130,
    alignItems: 'center',
  },
  joinBtnUnido: {
    backgroundColor: '#38C172',
  },
  joinBtnDisabled: {
    backgroundColor: '#ccc',
  },
  joinBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
    textAlign: 'center',
  },
  joinBtnTextUnido: {
    color: '#fff',
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
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
    gap: 12,
  },
  detailIconBox: {
    backgroundColor: '#f4e9fa',
    borderRadius: 13,
    padding: 11,
    marginRight: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  detailTitle: {
    fontWeight: 'bold',
    color: '#18193f',
    fontSize: 16,
    marginBottom: 2,
  },
  detailDescription: {
    color: '#888',
    fontSize: 13,
    marginBottom: 1,
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
    marginTop: 28,
    backgroundColor: '#f7f2ff',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  ownerNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f3ecff',
    borderRadius: 12,
    marginBottom: 16,
  },
  ownerNoticeText: {
    color: '#642684',
    fontSize: 14,
    flex: 1,
    lineHeight: 18,
  },
  participantsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  refreshButton: {
    backgroundColor: '#642684',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshButtonDisabled: {
    opacity: 0.5,
  },
  participantsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  participantsLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#5b5b7a',
  },
  participantsValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#642684',
  },
  participantsErrorText: {
    marginTop: 12,
    fontSize: 13,
    color: '#d32f2f',
  },
  participantsEmptyText: {
    marginTop: 12,
    fontSize: 13,
    color: '#777',
  },
});