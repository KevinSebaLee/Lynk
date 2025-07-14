import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function EventoElegido() {
  const route = useRoute();
  const navigation = useNavigation();

  const event = route?.params?.event || {
    nombre: "Garden party!",
    categoria_nombre: "Jardín botánico",
    fecha: "2025-12-14",
    hora: "4:00PM - 9:00PM",
    descripcion: `¡Te esperamos el 17 de febrero a las 18:30 en la Garden Party del Jardín Botánico! 🌿✨

Ven a disfrutar de una tarde mágica rodeado de naturaleza, buena música y deliciosos aperitivos.
Una experiencia única para relajarte, conocer gente y crear recuerdos inolvidables.
¡No faltes, vístete de jardín y acompáñanos! 💞🌸`,
    ubicacion: "Av. Sta. Fe 3957. Cdad Autónoma de Buenos Aires",
    imagen: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
    usuario_nombre: "Ariela",
    usuario_apellido: "Mojrenfeld",
    usuario_pfp: null,
    presupuesto: "10.000.000",
    objetivo: "15.000.000",
  };

  // Format date/time
  const dateObj = new Date(event.fecha);
  const dateStr = dateObj.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
  const dayOfWeek = dateObj.toLocaleDateString("es-AR", { weekday: "long" });
  const fullDate = `${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}, ${dateStr}`;

  // Dummy map image, replace with your own Google Static Maps API key if needed
  const dummyMap = "https://maps.googleapis.com/maps/api/staticmap?center=-34.5889,-58.4173&zoom=15&size=220x120&markers=color:0x6a2a8c|-34.5889,-58.4173&key=YOUR_API_KEY";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header with gradient and organizer info */}
      <LinearGradient colors={["#aeea00", "#ffffff"]} style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <View style={styles.organizerRow}>
            <Ionicons name="arrow-back" size={28} color="#fff" onPress={() => navigation.goBack()} />
            <Text style={styles.organizer}>
              {event.usuario_nombre} {event.usuario_apellido}
            </Text>
          </View>
          <Ionicons name="notifications-outline" size={28} color="#fff" />
        </View>
        {/* Event Image Circle */}
        <View style={styles.imageCircleWrapper}>
          <ImageBackground
            source={{ uri: event.imagen || "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80" }}
            style={styles.eventImageCircle}
            imageStyle={{ borderRadius: width * 0.42 }}
          >
            {/* Overlay Map Circle */}
            <View style={styles.mapCircleWrapper}>
              <Image
                source={{ uri: dummyMap }}
                style={styles.mapCircle}
                resizeMode="cover"
              />
            </View>
          </ImageBackground>
        </View>
        {/* Floating category icons */}
        <View style={styles.iconStack}>
          <View style={styles.iconCircle}><MaterialCommunityIcons name="leaf" size={26} color="#38C172" /></View>
          <View style={styles.iconCircle}><MaterialCommunityIcons name="earth" size={26} color="#6a2a8c" /></View>
          <View style={styles.iconCircle}><Ionicons name="location-outline" size={26} color="#222" /></View>
        </View>
      </LinearGradient>
      {/* Details Card */}
      <View style={styles.detailsCard}>
        <Text style={styles.title}>{event.nombre} <Ionicons name="heart-outline" size={16} color="#9F4B97" /></Text>
        <Text style={styles.subtitle}>{event.categoria_nombre}</Text>

        <TouchableOpacity style={styles.joinBtn}>
          <Text style={styles.joinBtnText}>UNIRME</Text>
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

        <Text style={styles.sectionTitle}>Sobre el evento</Text>
        <Text style={styles.eventDescription}>{event.descripcion}</Text>

        {/* Invite friends card */}
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

const CIRCLE_SIZE = width * 0.85;
const MAP_SIZE = width * 0.34;

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 44,
    paddingBottom: 38,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: "relative",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 5,
  },
  organizerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  organizer: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  imageCircleWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  eventImageCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    overflow: "hidden",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    backgroundColor: "#eee",
    shadowColor: "#222",
    shadowOpacity: 0.11,
    shadowRadius: 11,
    elevation: 7,
  },
  mapCircleWrapper: {
    position: "absolute",
    bottom: 13,
    right: 24,
    zIndex: 2,
    elevation: 6,
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
    top: CIRCLE_SIZE * 0.22,
    right: 16,
    zIndex: 4,
    alignItems: 'center',
    gap: 15,
  },
  iconCircle: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
    marginBottom: 10,
    shadowColor: "#222",
    shadowOpacity: 0.13,
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsCard: {
    marginTop: 9,
    borderRadius: 22,
    backgroundColor: "#fff",
    marginHorizontal: 0,
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.09,
    shadowRadius: 9,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#18193f",
    marginBottom: 4,
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
  },
  joinBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
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
    marginTop: 13,
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