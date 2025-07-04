import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import Header from '../components/header.js';
import Container from '../components/container.js';
import { LinearGradient } from 'expo-linear-gradient';

const width = Dimensions.get('window').width;

export default function Eventos() {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#642684', '#ffffff']} style={{ flex: 1 }}>
        <StatusBar style="light" />
        <Header nombre='Kevin' />
        <Container>
          <View style={styles.tickets}>
            <View style={styles.textoTicket}>
              <Text>Eventos Disponibles</Text>
              <Text style={styles.movimientosText}>Movimientos</Text>
            </View>
            <View style={styles.ticketTotal}>
              <View style={styles.cantidadTickets}>
                <Image source={require('../../assets/img/icons/tickets.png')} style={styles.iconTicket} />
                <Text style={styles.numeroTickets}>50.000</Text>
              </View>
              <Image source={require('../../assets/img/icons/comprar.png')} style={styles.iconCart} />
            </View>
            <View style={styles.metodoPagoWrapper}>
              <View style={styles.metodoPago}>
                <Image source={require('../../assets/img/icons/mercadoPago.png')} style={styles.iconLarge} />
                <Image source={require('../../assets/img/icons/qr.png')} style={styles.iconSmall} />
              </View>
            </View>
          </View>
        </Container>
        {/* Example events */}
        {[1, 2, 3].map((n) => (
          <Container key={n}>
            <View style={styles.planPremium}>
              <LinearGradient colors={['#642684', '#000000']}>
                <Container style={{ marginTop: 20 }}>
                  <Text style={styles.tituloPremium}>Event Name</Text>
                  <Text style={{ color: '#fff', marginVertical: 10 }}>Descripcion</Text>
                </Container>
              </LinearGradient>
            </View>
          </Container>
        ))}
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
  metodoPagoWrapper: { marginHorizontal: 5, marginTop: 15 },
  metodoPago: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#000', borderRadius: 5, paddingHorizontal: 18, paddingVertical: 12 },
  iconLarge: { width: 32, height: 32 },
  iconSmall: { width: 24, height: 24 },
  movimientosText: { color: '#9F4B97', fontWeight: '500' },
  planPremium: { borderRadius: 10, marginTop: 20, overflow: 'hidden' },
  tituloPremium: { fontSize: 23, color: '#fff', textDecorationStyle: 'solid' },
});