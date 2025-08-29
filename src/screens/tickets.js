import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Image, Dimensions, Pressable, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import Header from '../components/header.js';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import MovCard from '../components/MovCard.js';
import GradientBarChart from '../components/GradientBarChart.js';
import React, { useState, useCallback } from 'react';
import ApiService from '../services/api';
import { LoadingSpinner } from '../components/common';

const width = Dimensions.get('window').width;
const arrow = { uri: 'https://cdn-icons-png.flaticon.com/512/154/154630.png' };

export default function Tickets() {
  const [ticketsData, setTicketsData] = useState([]);
  const [ticketsMonth, setTicketsMonth] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      setLoading(true);
      setError(null);

      ApiService.getTickets()
        .then(data => {
          console.log('API response:', data);
          if (isActive && data) {
            // Check if we have the new data structure
            if (data.tickets && data.ticketsMonth !== undefined) {
              setTicketsData(data.tickets[0] || null);
              setTicketsMonth(data.ticketsMonth);
            } else {
              // Fallback to old structure
              setTicketsData(data[0] || null);
            }
          }
        })
        .catch(err => {
          if (isActive) setError('No se pudieron cargar los tickets.');
          console.error('Error loading tickets:', err);
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
              onGetMore={() => Alert.alert('¡Función para conseguir más tickets!')}
              onTransfer={() => navigation.navigate('Transferir')}
              onRedeem={() => navigation.navigate('Cupones')}
            />
          </View>
        </Pressable>

        <Text style={styles.trans}>Movimientos</Text>
        <Text style={styles.monthlyUsage}>Tickets usados este mes: {ticketsMonth}</Text>
        <GradientBarChart monthlyUsage={ticketsMonth} />
        <StatusBar style="light" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  trans: {
    fontSize: 21,
    fontWeight: '500',
    paddingLeft: 16,
    color: '#151C2A',
    marginVertical: 15,
  },
  monthlyUsage: {
    fontSize: 16,
    fontWeight: '500',
    paddingLeft: 16,
    color: '#642684',
    marginBottom: 10,
  },
  ticketWrapper: {
    marginVertical: 10,
  },
});