import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { DIMENSIONS } from '@/constants';

const { screenWidth: width } = DIMENSIONS;

const TicketDisplay = ({ 
  ticketAmount, 
  title = "Tickets Disponibles", 
  subtitle = "Movimientos",
  showPurchaseIcon = true,
  style 
}) => {
  return (
    <View style={[styles.tickets, style]}>
      <View style={styles.textoTicket}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.movimientosText}>{subtitle}</Text>
      </View>
      <View style={styles.ticketTotal}>
        <View style={styles.cantidadTickets}>
          <Image 
            source={require('../../../assets/img/icons/tickets.png')} 
            style={styles.iconTicket} 
          />
          <Text style={styles.numeroTickets}>{ticketAmount}</Text>
        </View>
        {showPurchaseIcon && (
          <Image 
            source={require('../../../assets/img/icons/comprar.png')} 
            style={styles.iconCart} 
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tickets: { 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    paddingVertical: 25, 
    paddingHorizontal: 20,
    marginHorizontal: 5,
  },
  textoTicket: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingRight: 10, 
    paddingLeft: 5, 
    marginBottom: 10 
  },
  titleText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  ticketTotal: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 10 
  },
  cantidadTickets: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 10 
  },
  numeroTickets: { 
    fontSize: 40, 
    fontWeight: '600',
    color: '#333',
  },
  iconTicket: { 
    width: 40, 
    height: 40, 
    marginRight: 10 
  },
  iconCart: { 
    width: 30, 
    height: 30 
  },
  movimientosText: { 
    color: '#9F4B97', 
    fontWeight: '500' 
  },
});

export default TicketDisplay;
