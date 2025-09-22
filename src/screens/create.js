import React, { memo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Dimensions } from 'react-native';
import Header from '../components/header.js';
import Container from '../components/container.js';
import { LinearGradient } from 'expo-linear-gradient';
import { TicketDisplay } from '../components';

const width = Dimensions.get('window').width;

/**
 * Create Screen - Displays ticket creation interface
 * Uses memoization to prevent unnecessary re-renders
 */
const Create = memo(() => {
  // Fixed ticket amount (could be made dynamic in future versions)
  const ticketAmount = '50.000';
  
  return (
    <View style={styles.container}>
      {/* Gradient background */}
      <LinearGradient colors={['#642684', '#ffffff']} style={{ flex: 1 }}>
        <StatusBar style="light" />
        
        {/* Header component */}
        <Header nombre='Kevin' />
        
        {/* Main content container */}
        <Container>
          <TicketDisplay
            ticketAmount={ticketAmount}
            title="Crear Disponibles"
            subtitle="Movimientos"
            showPurchaseIcon={true}
          />
        </Container>
      </LinearGradient>
    </View>
  );
});

// Styles for the Create screen
const styles = StyleSheet.create({
  // Main container style
  container: { 
    flex: 0.6 // Takes up 60% of screen height
  },
});

export default Create;