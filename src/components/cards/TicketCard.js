import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

// Pre-calculate dimensions for better performance
const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.min(width * 0.92, 420);

/**
 * TicketCard component displays available tickets and provides an action to get more
 * 
 * @param {Object} props - Component props
 * @param {number} props.tickets - Number of available tickets
 * @param {Function} props.onGetMore - Callback function when "Get more tickets" is pressed
 * @param {Object} props.style - Additional styles for the card container
 * @returns {React.ReactElement} Rendered component
 */
const TicketCard = memo(({ tickets, onGetMore, style }) => (
  <LinearGradient
    colors={['#735BF2', '#642684']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.card, style]}
  >
    {/* QR Icon in the top right corner */}
    <View style={styles.qrIcon}>
      <Ionicons name="qr-code-outline" size={40} color="#F5F5F5" />
    </View>
    {/* Subtitle */}
    <Text style={styles.subtitle}>Tickets disponibles</Text>
    {/* Main number with icon */}
    <View style={styles.ticketsRow}>
      <FontAwesome5 name="ticket-alt" size={28} color="#fff" style={{marginRight: 8}} />
      <Text style={styles.ticketsNumber}>{tickets}</Text>
    </View>
    {/* Gradient button with new style */}
    <TouchableOpacity 
      style={styles.buttonWrapper} 
      activeOpacity={0.90} 
      onPress={onGetMore}
      accessibilityLabel="Consigue más tickets"
      accessibilityRole="button"
    >
      <LinearGradient
        colors={['#A990F9', '#735BF2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.button}
      >
        <MaterialIcons name="add-circle-outline" size={20} color="#fff" style={{marginRight: 10}} />
        <Text style={styles.buttonText}>Consigue más tickets</Text>
      </LinearGradient>
    </TouchableOpacity>
  </LinearGradient>
));

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
  buttonWrapper: {
    marginTop: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: width - 180,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: CARD_WIDTH * 0.04,
    textAlign: 'center',
  },
});

export default TicketCard;