import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Pressable,
  Alert,
} from "react-native";
import Header from "../components/header.js";
import TicketCard from "../components/TicketCard.js";
import PremiumBanner from "../components/premiumBanner";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import { API } from '@env';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";

const API_URL = API;
const { width } = Dimensions.get("window");

export default function Home() {
  const navigation = useNavigation();
  const { logout } = useAuth();
  const route = useRoute();
  const user = route.params?.user; // Access the passed user

  const handleTicketsPress = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/login`);
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
    navigation.navigate("Inicio");
  };

  return (
    <LinearGradient colors={["#642684", "#ffffff"]} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Header nombre={user?.nombre || "Usuario"} />
          <Pressable onPress={handleTicketsPress}>
            <View style={styles.ticketWrapper}>
              <TicketCard
                onGetMore={() => alert("¡Función para conseguir más tickets!")}
              />
            </View>
          </Pressable>
          <View style={styles.bannerWrapper}>
            <PremiumBanner />
          </View>
          <View style={styles.agendaWrapper}>
            <Pressable onPress={handleLogout}>
              <View style={{ padding: 10, backgroundColor: "#eee", borderRadius: 5 }}>
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
});