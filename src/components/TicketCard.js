import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

const TicketCard = ({ tickets = "50.750", onGetMore, style }) => (
  <LinearGradient
    colors={['#735BF2', '#642684']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.card, style]}
  >
    {/* QR Icon arriba a la derecha */}
    <View style={styles.qrIcon}>
      <Ionicons name="qr-code-outline" size={40} color="#F5F5F5" />
    </View>
    {/* Subtítulo */}
    <Text style={styles.subtitle}>Tickets disponibles</Text>
    {/* Número principal con ícono */}
    <View style={styles.ticketsRow}>
      <FontAwesome5 name="ticket-alt" size={30} color="#fff" style={{marginRight: 8}} />
      <Text style={styles.ticketsNumber}>{tickets}</Text>
    </View>
    {/* Botón */}
    <TouchableOpacity style={styles.button} onPress={onGetMore}>
      <MaterialIcons name="add-circle-outline" size={20} color="#7D3C98" style={{marginRight: 5}} />
      <Text style={styles.buttonText}>Consigue más tickets</Text>
    </TouchableOpacity>
  </LinearGradient>
);

const styles = StyleSheet.create({
  card: {
    width: 370,
    minHeight: 210,
    alignSelf: 'center',
    marginVertical: 20,
    padding: 24,
    borderRadius: 16,
    // El gradiente reemplaza el backgroundColor
    shadowColor: "#2d1d3a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    maxWidth: 420,
    justifyContent: 'center'
  },
  qrIcon: {
    position: 'absolute',
    top: 26,
    right: 25,
    opacity: 0.94,
    zIndex: 2,
  }, 
  subtitle: {
    top: 1,
    left: 15,
    fontSize: 13,
    letterSpacing: 1,
    fontWeight: '500',
    color: '#ffffff',
    opacity: 0.6,
    marginBottom: 8,
  },
  ticketsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    left: 15,
    marginVertical: 8,
  },
  ticketsNumber: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignSelf: 'center',
    right: 36,
    marginTop: 10,
    paddingVertical: 9,
    paddingHorizontal: 18,
    backgroundColor: '#fff',
    borderRadius: 9,
    
  },
  buttonText: {
    color: '#7D3C98',
    fontWeight: '700',
    fontSize: 15,
  },
});

export default TicketCard;