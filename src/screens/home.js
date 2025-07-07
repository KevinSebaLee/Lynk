import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import Header from "../components/header.js";
import TicketCard from "../components/TicketCard.js";
import PremiumBanner from "../components/premiumBanner";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import AgendaIcon from "../components/agendaIcon";
import EventCard from '../components/EventCard.js';
import RecentEvents from '../components/RecentEvents';
import ApiService from "../services/api";
import { useApi } from "../hooks/useApi";

const { width } = Dimensions.get("window");

export default function Home() {
  const navigation = useNavigation();
  const { logout } = useAuth();

  // State for user and events
  const [userData, setUserData] = useState(null);
  const [eventosRecientes, setEventosRecientes] = useState([]);
  
  // Use the API hook for loading home data
  const { loading, execute: loadHomeData } = useApi(ApiService.getHomeData);
  const { execute: loadTickets } = useApi(ApiService.getTickets);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await loadHomeData();
        if (data) {
          setUserData(data.user);
          setEventosRecientes(data.eventosRecientes);
        }
      } catch (error) {
        // Error is already handled by the ApiService
      }
    };
    loadUserData();
  }, []);

  // Handler for tickets press
  const handleTicketsPress = async () => {
    try {
      const data = await loadTickets();
      navigation.navigate("tickets", data);
    } catch (error) {
      // Error is already handled by the ApiService
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#642684" />
      </View>
    );
  }

  return (
    <LinearGradient colors={["#642684", "#ffffff", "#ffffff"]} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Header nombre={userData?.user_nombre || "Usuario"} />
          <Pressable onPress={handleTicketsPress}>
            <View style={styles.ticketWrapper}>
              <TicketCard
                tickets={userData?.tickets}
                onGetMore={() => Alert.alert("¡Función para conseguir más tickets!")}
              />
            </View>
          </Pressable>
          <View style={styles.bannerWrapper}>
            <PremiumBanner plan={userData?.plan_titulo} />
          </View>
          <View style={styles.agendaWrapper}>
            <AgendaIcon />

            {eventosRecientes.length > 0 && (
              <ScrollView horizontal>
                {eventosRecientes.map((evento, idx) => (
                  <View key={evento.id || idx} style={{ marginRight: 12 }}>
                    <EventCard
                      imageUri={evento.imagen}
                      eventName={ evento.nombre}
                      eventFullDate={ evento.fecha}
                      venue={ evento.ubicacion}
                      priceRange={ "$12.000 - $15.000"}
                  
                    />
                  </View>
                ))}
              </ScrollView>
            )}
            <Pressable onPress={handleLogout}>
              <View style={{ padding: 10, backgroundColor: "#eee", borderRadius: 5, marginTop: 20 }}>
                <Header nombre="Cerrar Sesión" />
              </View>
            </Pressable>
          </View>
          <EventCard/>
          <RecentEvents onSeeMore={() => {/* navigate or handle more events */}} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: width,
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
    alignItems: "center",
    marginTop: 18,
  },
  agendaImage: {
    width: width * 0.32,
    height: width * 0.32,
  },
  ticketWrapper: {
    marginVertical: 10,
  },
  eventCard: {
    backgroundColor: "#fafafa",
    padding: 10,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center"
  }
});