import React, { memo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import Header from '../components/header.js';
import Container from '../components/container.js';
import { LinearGradient } from 'expo-linear-gradient';

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
          {/* Tickets information card */}
          <View style={styles.tickets}>
            {/* Header text row */}
            <View style={styles.textoTicket}>
              <Text>Crear Disponibles</Text>
              <Text style={styles.movimientosText}>Movimientos</Text>
            </View>
            
            {/* Ticket count and purchase button row */}
            <View style={styles.ticketTotal}>
              {/* Ticket count with icon */}
              <View style={styles.cantidadTickets}>
                <Image 
                  source={require('../../assets/img/icons/tickets.png')} 
                  style={styles.iconTicket} 
                />
                <Text style={styles.numeroTickets}>{ticketAmount}</Text>
              </View>
              
              {/* Purchase button */}
              <Image 
                source={require('../../assets/img/icons/comprar.png')} 
                style={styles.iconCart} 
              />
            </View>
          </View>
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
  
  // Ticket information card
  tickets: { 
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 25, 
    paddingHorizontal: 20 
  },
  
  // Header text row
  textoTicket: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingLeft: 5,
    marginBottom: 10 
  },
  
  // Tickets total and purchase button row
  ticketTotal: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10 
  },
  
  // Container for ticket count and icon
  cantidadTickets: { 
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10 
  },
  
  // Ticket count text
  numeroTickets: { 
    fontSize: 40,
    fontWeight: '600' 
  },
  
  // Ticket icon
  iconTicket: { 
    width: 40,
    height: 40,
    marginRight: 10 
  },
  
  // Cart/purchase icon
  iconCart: { 
    width: 30,
    height: 30 
  },
  
  // "Movements" text style
  movimientosText: { 
    color: '#9F4B97',
    fontWeight: '500' 
  },
});

export default Create;