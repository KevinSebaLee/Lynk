import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/layout/header.js';
import CalendarAgenda from '../components/features/agenda.js';
import { StatusBar } from 'expo-status-bar';
import { ScreenHeader } from '../components';

export default function Agenda() {
  return (
    <View style={styles.container}>
      <ScreenHeader 
        title="Agenda"
        showBackButton={true}
      />
      <View style={styles.calendarWrapper}>
        <CalendarAgenda />
      </View>
      <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop:60, backgroundColor:'#fff' },
  calendarWrapper: {
    flex: 1,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});