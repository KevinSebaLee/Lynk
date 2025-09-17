import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EventDetails = ({ eventDetails, fullDate, eventData }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {eventDetails.name} <Ionicons name="heart-outline" size={16} color="#9F4B97" />
      </Text>
      <Text style={styles.subtitle}>{eventData.categoria_nombre || 'Evento'}</Text>
      
      {/* Price information (if available) */}
      {eventDetails.price && (
        <Text style={styles.price}>Precio: ${eventDetails.price}</Text>
      )}
      
      {/* Capacity information (if available) */}
      {eventDetails.capacity && (
        <Text style={styles.capacity}>Capacidad: {eventDetails.capacity} personas</Text>
      )}
      
      {/* Duration information (if available) */}
      {eventDetails.duration && (
        <Text style={styles.duration}>Duración: {eventDetails.duration} minutos</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  price: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9F4B97',
    marginBottom: 3,
  },
  capacity: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  duration: {
    fontSize: 14,
    color: '#555',
    marginBottom: 18,
  },
});

export default EventDetails;
