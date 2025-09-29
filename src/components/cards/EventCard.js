import React, { useMemo, memo } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { DIMENSIONS } from '@/constants';

const { screenWidth: width } = DIMENSIONS;

/**
 * EventCard - Displays an event with image, date, and details
 * 
 * @param {string} imageUri - URI for the event image
 * @param {string} eventName - Name of the event
 * @param {string|Date} eventFullDate - Full date of the event
 * @param {string} venue - Event venue/location
 * @param {string} priceRange - Price range for the event
 * @param {string} eventTime - Time of the event
 * @param {function} onPress - Function to call when card is pressed
 */
const EventCard = memo(({ 
  imageUri, 
  eventName, 
  eventFullDate, 
  venue, 
  priceRange, 
  eventTime,
  onPress
}) => {
  // Process and format date information with memoization to prevent recalculation
  const dateInfo = useMemo(() => {
    const dateObj = eventFullDate ? new Date(eventFullDate) : new Date();
    
    // Get day number (1-31)
    const day = dateObj.getDate();
    
    // Format month name with first letter capitalized
    const formatter = new Intl.DateTimeFormat('es-ES', { month: 'short' });
    const monthStr = formatter.format(dateObj);
    const monthShort = monthStr.charAt(0).toUpperCase() + monthStr.slice(1);
    
    return { day, monthShort };
  }, [eventFullDate]);

  // Default handler if no onPress is provided
  const handlePress = onPress || (() => {});

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <ImageBackground
        source={{ uri: imageUri || 'https://via.placeholder.com/400x220' }}
        style={[styles.image, styles.imageRadius]}
        // Add performance optimizations for image loading
        fadeDuration={300}
      >
        {/* Date display box */}
        <View style={styles.dateBox}>
          <Text style={styles.dateDay}>{dateInfo.day}</Text>
          <Text style={styles.dateMonth}>{dateInfo.monthShort}</Text>
        </View>
        
        {/* Event details overlay */}
        <View style={styles.detailsOverlay}>
          <Text style={styles.eventName} numberOfLines={1} ellipsizeMode="tail">
            {eventName}
          </Text>
          <Text style={styles.eventInfo} numberOfLines={1} ellipsizeMode="tail">
            {venue}
          </Text>
          {eventTime && (
            <Text style={styles.eventInfo}>{eventTime}</Text>
          )}
          {priceRange && (
            <Text style={styles.price}>{priceRange}</Text>
          )}
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#f5f5f8',
    marginLeft: 10,
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