import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';

const { width } = Dimensions.get('window');

const EventCard = ({ 
  imageUri, 
  eventName, 
  eventFullDate, 
  venue, 
  priceRange, 
  eventTime 
}) => {
  // Process date information
  const dateObj = eventFullDate ? new Date(eventFullDate) : new Date();
  const day = dateObj.getDate();
  const monthShort = new Intl.DateTimeFormat('en-AR', { month: 'short' })
    .format(dateObj)
    .charAt(0)
    .toUpperCase() + 
    new Intl.DateTimeFormat('en-AR', { month: 'short' })
    .format(dateObj)
    .slice(1);

  return (
    <TouchableOpacity style={styles.container} onPress={() => Alert.alert('Evento', eventName)}>
      <ImageBackground
        source={{ uri: imageUri || 'https://via.placeholder.com/400x220' }}
        style={[styles.image, styles.imageRadius]}
      >
        <View style={styles.dateBox}>
          <Text style={styles.dateDay}>{day}</Text>
          <Text style={styles.dateMonth}>{monthShort}</Text>
        </View>
        <View style={styles.detailsOverlay}>
          <Text style={styles.eventName}>{eventName}</Text>
          <Text style={styles.eventInfo}>{venue}</Text>
          <Text style={styles.eventInfo}>{eventTime}</Text>
          {priceRange && <Text style={styles.price}>{priceRange}</Text>}
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#f5f5f8',
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  imageRadius: {
    borderRadius: 16,
  },
  dateBox: {
    position: 'absolute',
    top: 18,
    right: 14,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignItems: 'center',
    width: 62,
    zIndex: 2,
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 6,
    elevation: 2,
  },
  dateDay: {
    fontSize: 22,
    color: '#222',
    fontWeight: 'bold',
    lineHeight: 22,
  },
  dateMonth: {
    fontSize: 14,
    color: '#222',
    fontWeight: '600',
    marginTop: -2,
  },
  detailsOverlay: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.55)',
    height: '40%',
    padding: 18,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  eventName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventInfo: {
    color: '#f5f5f5',
    fontSize: 13,
    marginBottom: 2,
  },
  price: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 8,
  },
});

export default EventCard;