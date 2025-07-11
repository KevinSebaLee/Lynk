import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Image, Dimensions, Pressable, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import Header from '../components/header.js';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MovCard from "../components/MovCard.js";
import GradientBarChart from '../components/GradientBarChart.js';
import React, { useState, useCallback } from "react";
import ApiService from "../services/api";
import { LoadingSpinner } from "../components/common";

const width = Dimensions.get('window').width;
const arrow = { uri: 'https://cdn-icons-png.flaticon.com/512/154/154630.png' };

export default function Tickets() {
  const [ticketsData, setTicketsData] = useState([]);
  const [movimientosData, setMovimientosData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      console.log("Focus effect triggered");
      setLoading(true);
      setError(null);

      ApiService.getMovimientos()
        .then(data => {
          console.log("Movimientos data received:", data);
          if (isActive && data) {
            setMovimientosData(data);
          } else {
            console.log("Data is falsy or focus lost");
          }
        })
        .catch(err => {
          if (isActive) setError("No se pudieron cargar los movimientos.");
          console.log(err)
          console.error("Error loading movimientos:", err);
        })
        .finally(() => {
          if (isActive) setLoading(false);
        }
      );

      ApiService.getTickets()
        .then(data => {
          console.log("API response:", data);
          if (isActive && data) {
            setTicketsData(data[0] || null);
          } else {
            console.log("Data is falsy or focus lost");
          }
        })
        .catch(err => {
          if (isActive) setError("No se pudieron cargar los tickets.");
          console.error("Error loading tickets:", err);
        })
        .finally(() => {
          if (isActive) setLoading(false);
        });
      return () => { isActive = false; };
    }, [])
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <SafeAreaView>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <Text style={{ color: 'red', fontSize: 18, marginBottom: 12 }}>{error}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10, backgroundColor: '#eee', borderRadius: 5 }}>
            <Text>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
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
        <Pressable style={{ marginTop: 10 }}>
          <View style={styles.ticketWrapper}>
          <MovCard
            tickets={ticketsData?.tickets || 0}
            onGetMore={() => Alert.alert("¡Función para conseguir más tickets!")}
            onTransfer={() => navigation.navigate('Transferir')}
          />
          </View>
        </Pressable>
        <View style={styles.listMov}>
          <Text style={styles.trans}>Transacciones</Text>
          {(movimientosData.length > 0 ? movimientosData : []).map((tx, idx) => (
            <View style={styles.container} key={tx.id || idx}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={tx.tipo_movimiento_icon || "cash"} size={24} color={tx.color || "#7b4ef7"} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{tx.titulo}</Text>
                <Text style={styles.subtitle}>{tx.moneda_nombre}</Text>
              </View>
              <View style={styles.rightContainer}>
                <Text
                  style={[
                    styles.amount,
                    { color: tx.monto > 0 ? '#27ae60' : '#ec4d5f' }
                  ]}
                >
                  {tx.monto > 0 ? `+${tx.monto}` : `${tx.monto}`}
                </Text>
                <Text style={styles.date}>{tx.date}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.trans}>Movimientos</Text>
        <GradientBarChart />
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
  listMov: {
    marginTop: 20,
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
    width: 20,
    height: 20,
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
  transferBtnWrapper: {
    alignItems: 'center',
    marginVertical: 10,
  },
  transferBtn: {
    backgroundColor: '#7b4ef7',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  transferBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});