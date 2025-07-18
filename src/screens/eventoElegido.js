import React, { useEffect, useState, useCallback } from "react";
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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useApi } from "../hooks/useApi";
import ApiService from '../services/api.js';

const { width } = Dimensions.get("window");
const CIRCLE_SIZE = width * 0.84;
const MAP_SIZE = width * 0.36;

export default function EventoElegido() {
  const route = useRoute();
  const navigation = useNavigation();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eventosAgendados, setEventosAgendados] = useState([]);
  const [agendado, setAgendado] = useState(false);

  const { execute: loadEventDetails } = useApi(ApiService.getEventoById);
  const { execute: agendarEvento, loading: loadingAgendar } = useApi(ApiService.agendarEventos);
  const { execute: loadScheduledEvents } = useApi(ApiService.getEventosAgendados);
  const { execute: deleteScheduledEvent } = useApi(ApiService.deleteEventoAgendado);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const eventFromParams = route?.params?.event;
        if (eventFromParams) {
          if (eventFromParams.id) {
            try {
              const eventData = await loadEventDetails(eventFromParams.id);
              const scheduled = await loadScheduledEvents();
              setEventosAgendados(scheduled);

              let found = false;
              for (let i = 0; i < scheduled.length; i++) {
                if (String(scheduled[i].id) === String(eventFromParams.id)) {
                  found = true;
                  break;
                }
              }
              setAgendado(found);

              setEvent(Array.isArray(eventData) ? eventData[0] : eventData);
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

  const handleAgendarEvento = useCallback(async () => {
    if (!event?.id) return;

    if (!agendado) {
      try {
        await agendarEvento(event.id);
        Alert.alert('Te has unido al evento con éxito.');
        setAgendado(true);
      } catch (error) {
        // Error already handled
      }
    } else {
      try {
        await deleteScheduledEvent(event.id);
        Alert.alert('Te has salido del evento con éxito.');
        setAgendado(false);
      } catch (err) {
        // Error already handled
      }
    }
  }, [event, agendado, agendarEvento, deleteScheduledEvent]);

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

  const dateObj = new Date(event.fecha);
  const dateStr = dateObj.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
  const dayOfWeek = dateObj.toLocaleDateString("es-AR", { weekday: "long" });
  const fullDate = `${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}, ${dateStr}`;

  const dummyMap = "https://maps.googleapis.com/maps/api/staticmap?center=-34.5889,-58.4173&zoom=15&size=220x120&markers=color:0x6a2a8c|-34.5889,-58.4173&key=YOUR_API_KEY";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <LinearGradient colors={["#aeea00", "#ffffff"]} style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <Ionicons name="arrow-back" size={28} color="#fff" onPress={() => navigation.goBack()} />
        </View>
        <View style={styles.topRow}>
          <View style={styles.leftCircleWrapper}>
            <ImageBackground
              source={{ uri: event.imagen || "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80" }}
              style={styles.eventImageCircle}
              imageStyle={{ borderRadius: CIRCLE_SIZE / 2 }}
            >
              <View style={styles.mapCircleOverlay}>
                <Image
                  source={{ uri: dummyMap }}
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
        <Text style={styles.title}>{event.nombre} <Ionicons name="heart-outline" size={16} color="#9F4B97" /></Text>
        <Text style={styles.subtitle}>{event.categoria_nombre}</Text>
        <TouchableOpacity
          style={[
            styles.joinBtn,
            agendado && styles.joinBtnUnido
          ]}
          onPress={handleAgendarEvento}
          disabled={loadingAgendar}
        >
          <Text style={[styles.joinBtnText, agendado && styles.joinBtnTextUnido]}>
            {agendado ? "UNIDO" : (loadingAgendar ? "Uniendo..." : "UNIRME")}
          </Text>
        </TouchableOpacity>
        <View style={styles.detailRow}>
          <View style={styles.detailIconBox}><Ionicons name="calendar-outline" size={22} color="#9F4B97" /></View>
          <View>
            <Text style={styles.detailTitle}>{fullDate}</Text>
            <Text style={styles.detailDescription}>{event.hora || ""}</Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.detailIconBox}><Ionicons name="location-outline" size={22} color="#9F4B97" /></View>
          <View>
            <Text style={styles.detailTitle}>{event.ubicacion}</Text>
            <Text style={styles.detailDescription}>{event.direccion}</Text>
          </View>
        </View>
        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Sobre el evento</Text>
        <Text style={styles.eventDescription}>{event.descripcion}</Text>
        <View style={styles.inviteCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={{ uri: 'https://cdn.dribbble.com/users/1210335/screenshots/14665559/media/8c9edc8e7e4e1b0e9e2e9d4d6e7f0e6e.png?compress=1&resize=400x200' }}
              style={styles.inviteImage}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.inviteTitle}>Invitá a tus amigos</Text>
              <Text style={styles.inviteSubtitle}>Conseguí muchos descuentos</Text>
            </View>
            <TouchableOpacity style={styles.inviteBtn}>
              <Text style={styles.inviteBtnText}>Invitar</Text>
            </TouchableOpacity>
          </View>
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
    position: "relative",
    zIndex: 0,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    marginBottom: 0,
    zIndex: 2,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    width: "100%",
    minHeight: CIRCLE_SIZE + 18,
    position: "relative",
  },
  leftCircleWrapper: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    marginLeft: 0,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    position: "relative",
    zIndex: 1,
  },
  eventImageCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    overflow: "hidden",
    backgroundColor: "#eee",
    shadowColor: "#222",
    shadowOpacity: 0.11,
    shadowRadius: 11,
    elevation: 7,
    position: 'relative',
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  mapCircleOverlay: {
    position: "absolute",
    bottom: -MAP_SIZE * 0.19,
    right: -MAP_SIZE * 0.17,
    zIndex: 10,
    elevation: 10,
    shadowColor: "#222",
    shadowOpacity: 0.23,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
  },
  mapCircle: {
    width: MAP_SIZE,
    height: MAP_SIZE,
    borderRadius: MAP_SIZE / 2,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
  iconStack: {
    position: "absolute",
    right: 28,
    top: 42,
    gap: 15,
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 4,
  },
  iconCircle: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
    marginBottom: 15,
    shadowColor: "#222",
    shadowOpacity: 0.13,
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsCard: {
    marginTop: 0,
    backgroundColor: "#fff",
    marginHorizontal: 0,
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.09,
    shadowRadius: 9,
    elevation: 3,
    zIndex: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#18193f",
    marginBottom: 4,
    marginTop: 8,
  },
  subtitle: {
    color: "#888",
    marginBottom: 9,
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 2,
  },
  joinBtn: {
    backgroundColor: "#642684",
    borderRadius: 9,
    alignSelf: "flex-start",
    paddingHorizontal: 26,
    paddingVertical: 11,
    marginVertical: 8,
    marginBottom: 13,
    minWidth: 130,
    alignItems: "center",
  },
  joinBtnUnido: {
    backgroundColor: "#38C172",
  },
  joinBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
    textAlign: "center",
  },
  joinBtnTextUnido: {
    color: "#fff",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
    gap: 12,
  },
  detailIconBox: {
    backgroundColor: "#f4e9fa",
    borderRadius: 13,
    padding: 11,
    marginRight: 7,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  detailTitle: {
    fontWeight: "bold",
    color: "#18193f",
    fontSize: 16,
    marginBottom: 2,
  },
  detailDescription: {
    color: "#888",
    fontSize: 13,
    marginBottom: 1,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 32,
    marginBottom: 4,
    color: "#18193f",
  },
  eventDescription: {
    color: "#444",
    fontSize: 15,
    marginBottom: 11,
    marginTop: 3,
    lineHeight: 22,
  },
  inviteCard: {
    backgroundColor: "#9F4B97",
    borderRadius: 13,
    padding: 18,
    marginTop: 9,
    marginBottom: 7,
    shadowColor: "#9F4B97",
    shadowOpacity: 0.09,
    shadowRadius: 9,
    elevation: 2,
  },
  inviteImage: {
    width: 55,
    height: 55,
    borderRadius: 13,
    backgroundColor: "#fff",
    marginRight: 8,
  },
  inviteTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    marginBottom: 3,
  },
  inviteSubtitle: {
    color: "#fff",
    fontSize: 15,
    marginBottom: 2,
  },
  inviteBtn: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 19,
    paddingVertical: 6,
    alignSelf: "flex-end",
    marginLeft: 10,
    marginTop: 4,
  },
  inviteBtnText: {
    color: "#9F4B97",
    fontSize: 15,
    fontWeight: "bold",
  },
});