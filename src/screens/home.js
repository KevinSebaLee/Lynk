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
import { API } from '@env';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
import { isLoggedIn, getToken } from "../utils/Token";

const API_URL = API;
const { width } = Dimensions.get("window");

export default function Home() {
  const navigation = useNavigation();
  const { logout } = useAuth();

  // State for user and events
  const [userData, setUserData] = useState(null);
  const [eventosRecientes, setEventosRecientes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch user data from backend
  const fetchUserData = async () => {
    try {
      const userIsLoggedIn = await isLoggedIn();
      if (!userIsLoggedIn) {
        Alert.alert("Error", "You must be logged in to access this feature.");
        return;
      }

      const token = await getToken();

      const response = await axios.get(`${API_URL}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        Alert.alert("Error", error.response.data.error);
        console.log("Backend error:", error.response.data.error);
      } else if (error.request) {
        Alert.alert("Error", "No response from server. Check your network or API URL.");
        console.log("No response:", error.request);
      } else {
        Alert.alert("Error", `Unexpected error: ${error.message}`);
        console.log("Unexpected error:", error.message);
      }
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      const data = await fetchUserData();
      if (data) {
        setUserData(data.user);
        setEventosRecientes(data.eventosRecientes);
      }
      setLoading(false);
    };
    loadUserData();
  }, []);

  // Handler for tickets press
  const handleTicketsPress = async () => {
    try {
      const userIsLoggedIn = await isLoggedIn();
      if (!userIsLoggedIn) {
        Alert.alert("Error", "You must be logged in to access tickets.");
        return;
      }

      const token = await getToken();

      const response = await axios.get(`${API_URL}/tickets`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      navigation.navigate("tickets", response.data);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        Alert.alert("Error", error.response.data.error);
        console.log("Backend error:", error.response.data.error);
      } else if (error.request) {
        Alert.alert("Error", "No response from server. Check your network or API URL.");
        console.log("No response:", error.request);
      } else {
        Alert.alert("Error", `Unexpected error: ${error.message}`);
        console.log("Unexpected error:", error.message);
      }
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
    <LinearGradient colors={["#642684", "#ffffff"]} style={styles.gradient}>
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
            {/* Example: Display recent events */}
            {eventosRecientes.length > 0 && (
              <ScrollView horizontal>
                {eventosRecientes.map((evento, idx) => (
                  <View key={evento.id || idx} style={{ marginRight: 12 }}>
                    {/* Render your event card here */}
                    {/* Example: */}
                    <View style={styles.eventCard}>
                      <Header nombre={evento.nombre} />
                      {/* Add image, etc. */}
                    </View>
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