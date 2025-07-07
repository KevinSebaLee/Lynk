import React from 'react';
import { View, Text, ImageBackground, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const events = [
  {
    imageUri: 'https://danews.com.ar/wp-content/uploads/2024/11/unnamed-2024-11-08T222507.155-684x1024.jpg', // Replace with actual image path
    title: 'AMERI WORLD TOUR',
    venue: 'Movistar Arena',
  },
  {
    imageUri: 'https://assets.dev-filo.dift.io/img/2023/05/22/filo2(90)3597.png', // Replace with actual image path
    title: 'ELADIO CARRION',
    venue: 'Luna Park',
  },
];

const RecentEvents = ({ onSeeMore }) => (
  <View style={styles.container}>
    <View style={styles.headerRow}>
      <Text style={styles.header}>Eventos mas recientes</Text>
      <TouchableOpacity onPress={onSeeMore}>
        <Text style={styles.seeMore}>Ver más</Text>
      </TouchableOpacity>
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {events.map((event, idx) => (
        <View style={styles.card} key={idx}>
          <ImageBackground
            source={{ uri: event.imageUri }}
            style={styles.image}
            imageStyle={styles.imageRadius}
          >
            <View style={styles.infoOverlay}>
              <Text style={styles.title}>{event.title}</Text>
              <Text style={styles.venue}>{event.venue}</Text>
            </View>
          </ImageBackground>
        </View>
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
    marginBottom: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 8,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  seeMore: {
    color: '#b669fa',
    fontSize: 15,
    paddingRight:2,
  },
  card: {
    width: 210,
    height: 270,
    borderRadius: 28,
    overflow: 'hidden',
    marginHorizontal: 8,
    elevation: 3,
    backgroundColor: '#222',
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