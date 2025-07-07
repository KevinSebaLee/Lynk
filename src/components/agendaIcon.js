import React from 'react';
import { Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const agenda = require('../../assets/img/agenda.png');
export default function AgendaIcon({ style }) {
  return (
    <Image
      source={agenda}
      style={[styles.img, style]}
      resizeMode="contain"
      accessible
      accessibilityLabel="Ícono de agenda"
    />
  );
}

const styles = StyleSheet.create({
  img: {
    width: width,
    height: width * 0.80,
  },
});