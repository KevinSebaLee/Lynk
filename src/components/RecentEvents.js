import React from 'react';
import { View, Text, ImageBackground, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';


const RecentEvents = ({ imageUri, eventName, venue }) => (
  <View style={styles.card}>
   
          <ImageBackground
            source={{ uri: imageUri }}
            style={styles.image}
            imageStyle={styles.imageRadius}
          >
            <View style={styles.infoOverlay}>
              <Text style={styles.title}>{eventName}</Text>
              <Text style={styles.venue}>{venue}</Text>
            </View>
          </ImageBackground>
  </View>
);


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
