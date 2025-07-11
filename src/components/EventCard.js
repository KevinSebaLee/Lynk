import React from 'react';
import { View, Text, ImageBackground, StyleSheet, ScrollView } from 'react-native';


const EventCard = ({ imageUri, eventName, eventFullDate, venue, priceRange, eventTime }) => {
  const dateParts = typeof eventFullDate === 'string' ? eventFullDate.split(' ') : ['--', '--'];


  const dateObj = new Date(eventFullDate);
  const day = dateObj.getDate();
  const dayString = day.toString() // Ensures two digits, e.g., "06"
  let monthShort = dateObj.toLocaleString('en-AR', { month: 'short' }); // "Apr"
  monthShort = monthShort.charAt(0).toUpperCase() + monthShort.slice(1);


  const shortDate = dateObj.toLocaleDateString('es-AR'); // e.g., "06/04/2025"


  return (
    <>
     
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.card}>
          <ImageBackground
            source={{ uri: imageUri }}
            style={styles.image}
            imageStyle={styles.imageRadius}
          >
            {/* Date Box */}
            <View style={styles.dateBox}>
              <Text style={styles.dateDay}>{dayString}</Text>
              <Text style={styles.dateMonth}>{monthShort}</Text>
            </View>
            {/* Details Overlay */}
            <View style={styles.detailsOverlay}>
              <Text style={styles.eventName}>{eventName}</Text>
              <Text style={styles.eventInfo}>
                {eventTime} {shortDate}
              </Text>
              <Text style={styles.eventInfo}>{venue}</Text>
              <Text style={styles.price}>{priceRange}</Text>
            </View>
          </ImageBackground>
        </View>
      </ScrollView>
    </>
  );
};


const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    width: 290,
    height: 340,
    backgroundColor: '#222',
    elevation: 3,
    marginHorizontal: 0,
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
