import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/header.js';
import CalendarAgenda from '../components/agenda.js';

export default function Agenda() {
  return (
    <View style={styles.container}>
        <View style={styles.calendarWrapper}>
          <CalendarAgenda />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  calendarWrapper: {
    flex: 1,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});