import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Image , Dimensions, Button, Pressable, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import Header from '../components/header.js';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TicketCard from "../components/TicketCard.js";
import GradientBarChart from '../components/GradientBarChart.js';
import React, { useState, useEffect } from "react"; 
import ApiService from "../services/api";
import { useApi } from "../hooks/useApi";
import { LoadingSpinner } from "../components/common";

const width = Dimensions.get('window').width;
const arrow = { uri: 'https://cdn-icons-png.flaticon.com/512/154/154630.png' };

export default function Tickets() { 
  const [ticketsData, setTicketsData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [movimientos, setMovimientos] = useState([]);

  const navigation = useNavigation();
  
  // Use the API hook for loading tickets data
  const { loading, execute: loadTickets } = useApi(ApiService.getTickets);

  useEffect(() => {
    const loadTicketsData = async () => {
      try {
        const data = await loadTickets();
        if (data) {
          setTicketsData(data.tickets || null);
          setTransactions(data.transactions || []);
          setMovimientos(data.movimientos || []);
        }
      } catch (error) {
        // Error is already handled by the ApiService
      }
    };
    loadTicketsData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image style={styles.arrow} source={arrow} />
          </TouchableOpacity>
          <Text style={styles.headerText}> Tus tickets</Text>
        </View>
        <Pressable style={{marginTop: 10}}>
          <View style={styles.ticketWrapper}>
            <TicketCard
              tickets={ticketsData?.tickets || 0}
              onGetMore={() => Alert.alert("¡Función para conseguir más tickets!")}
            />
          </View>
        </Pressable>

        <View style={styles.listMov}>
          <Text style={styles.trans}>Transacciones</Text>
          {(transactions.length > 0 ? transactions : []).map((tx, idx) => (
            <View style={styles.container} key={tx.id || idx}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={tx.icon || "cash"} size={24} color={tx.color || "#7b4ef7"} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{tx.title}</Text>
                <Text style={styles.subtitle}>{tx.subtitle}</Text>
              </View>
              <View style={styles.rightContainer}>
                <Text
                  style={[
                    styles.amount,
                    tx.amountColor && { color: tx.amountColor }
                  ]}
                >
                  {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                </Text>
                <Text style={styles.date}>{tx.date}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.trans}>Movimientos</Text>
        {/* If you want to show movimientos as a bar chart, pass movimientos to GradientBarChart. 
          Otherwise, you can map and render movimientos here. */}
        <GradientBarChart data={movimientos} />
        <StatusBar style="light" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    flex: 1,
    marginTop: 30,
    marginLeft: 20,
    flexDirection: 'row',
    marginBottom: 20,
  },
  arrow: {
    resizeMode: 'contain',
    marginTop: 5,
    width: 25,
    height: 25,
    marginRight: 10,
  },
  headerText: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#151C2A',
  },
  listMov:{
    marginTop:20,
  },
  trans: {
    fontSize: 21,
    fontWeight: '500',
    paddingLeft: 16,
    color: '#151C2A',
    marginVertical: 15,
  },
  iconContainer: {
    backgroundColor: '#fff',
    padding: 25,
    width:20,
    height:20,
    borderRadius: 50,
    shadowColor: '#CFECF8',
    shadowOffset: { width: 2, height: 7 },
    shadowOpacity: 0.43,
    shadowRadius: 73,
    elevation: 6,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#151C2A',
  },
  subtitle: {
    fontSize: 13,
    color: '#888',
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    color: '#ec4d5f',
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  ticketWrapper: {
    marginVertical: 10,
  },
});