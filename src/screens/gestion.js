import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Header, Container, TicketDisplay } from '@/components';

const width = Dimensions.get('window').width;

export default function Gestion() {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#642684', '#ffffff']} style={{ flex: 1 }}>
        <StatusBar style="light" />
        <Header nombre='Kevin' />
        <Container>
          <TicketDisplay
            ticketAmount="50.000"
            title="Tickets Disponibles"
            subtitle="Movimientos"
            showPurchaseIcon={true}
          />
          <View style={styles.metodoPagoWrapper}>
            <View style={styles.metodoPago}>
              <Image source={require('../../assets/img/icons/mercadoPago.png')} style={styles.iconLarge} />
              <Image source={require('../../assets/img/icons/qr.png')} style={styles.iconSmall} />
            </View>
          </View>
        </Container>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 0.6 },
  metodoPagoWrapper: { marginHorizontal: 5, marginTop: 15 },
  metodoPago: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#000', borderRadius: 5, paddingHorizontal: 18, paddingVertical: 12 },
  iconLarge: { width: 32, height: 32 },
  iconSmall: { width: 24, height: 24 },
});