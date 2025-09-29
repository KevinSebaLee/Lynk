import React from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { DIMENSIONS } from '@/constants';

const { screenWidth: width } = DIMENSIONS;
const CIRCLE_SIZE = width * 0.84;
const MAP_SIZE = width * 0.36;

const EventHeader = ({ imageSource, mapUrl, onBackPress }) => {
  return (
    <LinearGradient colors={['#aeea00', '#ffffff']} style={styles.headerGradient}>
      {/* Back button */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBackPress}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {/* Event image and map section */}
      <View style={styles.imageContainer}>
        <ImageBackground
          source={imageSource}
          style={styles.eventImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.5)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.eventCircle}>
            <View style={styles.mapWrapper}>
              <Image
                source={{ uri: mapUrl }}
                style={styles.mapImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']}
                style={StyleSheet.absoluteFill}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 44,
    paddingHorizontal: 16,
    paddingBottom: 0,
    overflow: 'visible',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    zIndex: 10,
  },
  imageContainer: {
    alignItems: 'center',
    position: 'relative',
    marginBottom: -40,
  },
  eventImage: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE * 0.65,
    borderRadius: 12,
    overflow: 'hidden',
  },
  eventCircle: {
    position: 'absolute',
    bottom: -42,
    right: 12,
    backgroundColor: '#fff',
    width: MAP_SIZE,
    height: MAP_SIZE,
    borderRadius: MAP_SIZE / 2,
    overflow: 'hidden',
    padding: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  mapWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: (MAP_SIZE - 12) / 2,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
});

export default EventHeader;
