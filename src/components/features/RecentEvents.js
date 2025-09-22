import React, { memo } from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';

/**
 * RecentEvents component displays a card with an event image, name, and venue
 * 
 * @param {Object} props - Component props
 * @param {string} props.imageUri - URI of the event image
 * @param {string} props.eventName - Name of the event
 * @param {string} props.venue - Venue where the event takes place
 * @returns {React.ReactElement} Rendered component
 */
const RecentEvents = memo(({ imageUri, eventName, venue }) => (
  <View style={styles.card}>
    <ImageBackground
      source={{ uri: imageUri }}
      style={styles.image}
      imageStyle={styles.imageRadius}
      // Adding resizeMode to improve image loading performance
      resizeMode="cover"
    >
      <View style={styles.infoOverlay}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{eventName}</Text>
        <Text style={styles.venue} numberOfLines={1} ellipsizeMode="tail">{venue}</Text>
      </View>
    </ImageBackground>
  </View>
));


const styles = StyleSheet.create({
  container: {
    marginTop: 18,
    marginBottom: 15,
    height: 300,
  },


  card: {
    width: 210,
    height: 270,
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 0,
    marginLeft: 10,
    elevation: 3,
    backgroundColor: '#3a007f',
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  imageRadius: {
    borderRadius: 28,
  },
  infoOverlay: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 16,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  title: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 6,
    letterSpacing: 1,
  },
  venue: {
    color: '#ededed',
    fontSize: 15,
    fontWeight: '400',
  },
});


export default RecentEvents;
