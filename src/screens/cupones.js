import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {Image, Dimensions, Pressable, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import MovCard from '../components/MovCard.js';

export default function Cupones() {
    const [ticketsData, setTicketsData] = useState([]);

    
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cupones</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#642684',
  },
});