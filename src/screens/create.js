import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import Header from '../components/header.js';
import Container from '../components/container.js';
import { LinearGradient } from 'expo-linear-gradient';

const width = Dimensions.get('window').width;

export default function Create() {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#642684', '#ffffff']} style={{ flex: 1 }}>
        <StatusBar style="light" />
        <Header nombre='Kevin' />
        <Container>
          <View style={styles.tickets}>
            <View style={styles.textoTicket}>
              <Text>Crear Disponibles</Text>
              <Text style={styles.movimientosText}>Movimientos</Text>
            </View>
            <View style={styles.ticketTotal}>
              <View style={styles.cantidadTickets}>
                <Image source={require('../../assets/img/icons/tickets.png')} style={styles.iconTicket} />
                <Text style={styles.numeroTickets}>50.000</Text>
              </View>
              <Image source={require('../../assets/img/icons/comprar.png')} style={styles.iconCart} />
            </View>
          </View>
        </Container>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 0.6 },
  tickets: { backgroundColor: '#fff', borderRadius: 10, paddingVertical: 25, paddingHorizontal: 20 },
  textoTicket: { flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10, paddingLeft: 5, marginBottom: 10 },
  ticketTotal: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  cantidadTickets: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  numeroTickets: { fontSize: 40, fontWeight: '600' },
  iconTicket: { width: 40, height: 40, marginRight: 10 },
  iconCart: { width: 30, height: 30 },
  movimientosText: { color: '#9F4B97', fontWeight: '500' },
});