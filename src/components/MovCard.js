import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.min(width * 0.92, 420);

const MovCard = ({ tickets, onGetMore, onTransfer, style }) => (
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
      <FontAwesome5 name="ticket-alt" size={28} color="#fff" style={{marginRight: 8}} />
      <Text style={styles.ticketsNumber}>{tickets}</Text>
    </View>
    <View style={styles.actionsRow}>
      <ActionButton icon={<MaterialIcons name="shopping-cart" size={28} color="#fff" />} label="Comprar" onPress={onGetMore} />
      <ActionButton icon={<Ionicons name="cash" size={28} color="#fff" />} label="Transferir" onPress={onTransfer} />
      <ActionButton icon={<MaterialIcons name="cached" size={28} color="#fff" />} label="Canjear" />
      <ActionButton icon={<Ionicons name="person-circle-outline" size={28} color="#fff" />} label="Tu ID" />
    </View>
  </LinearGradient>
);

const ActionButton = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.actionContainer} onPress={onPress} disabled={!onPress}>
    <View style={styles.actionCircle}>{icon}</View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    minHeight: 0.47 * CARD_WIDTH,
    alignSelf: 'center',
    padding: CARD_WIDTH * 0.06,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#2d1d3a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    maxWidth: 420,
    justifyContent: 'center'
  },
  qrIcon: {
    position: 'absolute',
    top: 24,
    right: 24,
    opacity: 0.94,
    zIndex: 2,
  },
  subtitle: {
    marginLeft: 10,
    fontSize: CARD_WIDTH * 0.038,
    letterSpacing: 1,
    fontWeight: '500',
    color: '#ffffff',
    opacity: 0.6,
    marginBottom: 8,
  },
  ticketsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginVertical: 8,
  },
  ticketsNumber: {
    fontSize: CARD_WIDTH * 0.1,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
    paddingHorizontal: 5,
  },
  actionContainer: {
    alignItems: 'center',
  },
  actionCircle: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 40,
    padding: 12,
    marginBottom: 6,
  },
  actionLabel: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
  },
});

export default MovCard;