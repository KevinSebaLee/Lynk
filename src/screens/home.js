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
  Text,
  Button,
  TouchableOpacity
} from "react-native";
import Header from "../components/header.js";
import TicketCard from "../components/TicketCard.js";
import PremiumBanner from "../components/premiumBanner";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import AgendaIcon from "../components/agendaIcon";
import EventCard from '../components/EventCard.js';
import RecentEvents from '../components/RecentEvents';
import ApiService from "../services/api";
import { useApi } from "../hooks/useApi";
import { LoadingSpinner, GradientBackground } from "../components/common";


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
    return <LoadingSpinner />;
  }


  return (
    <GradientBackground style={styles.gradient}>
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
            <View style={{paddingRight:250}}>
            <View style={styles.headerRow}>
                 <Text style={styles.header}>Mis eventos</Text>
            </View>
            </View>
           
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
          <View style={{marginTop: 20,}}>
          <Button title="Cerrar Sesión" color={'#9a0606'}/>
          </View>
          </View>
          <View style={styles.headerRow}>
                <Text style={styles.header}>Eventos mas recientes</Text>
                <TouchableOpacity>
                  <Text style={{color: '#642684'}}>Ver más</Text>
                </TouchableOpacity>
          </View>
          {eventosRecientes.length > 0 && (
              <ScrollView horizontal>
                {eventosRecientes.map((evento, idx) => (
                  <View key={evento.id || idx} style={{ marginRight: 12 }}>
                    <RecentEvents
                      imageUri={evento.imagen}
                      eventName={ evento.nombre}
                      venue={ evento.ubicacion}
                    />
                  </View>
                ))}
              </ScrollView>
            )}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}


const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: width,
    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
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
  eventCard: {
    backgroundColor: "#fafafa",
    padding: 10,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center"
  },
  logOut: {
    marginTop: 20,
    backgroundColor: "#f00",
    borderRadius: 8,
    alignItems: "center",
    width: width * 0.9,
  },
});
