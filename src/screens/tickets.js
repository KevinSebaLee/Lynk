import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Image, Dimensions, Pressable, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import Header from '../components/header.js';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import MovCard from '../components/MovCard.js';
import PieChartCard from '../components/PieChartCard.js';
import React, { useState, useCallback } from 'react';
import ApiService from '../services/api';
import { LoadingSpinner } from '../components/common';
import TransferList from '../components/TransferList';

const width = Dimensions.get('window').width;
const arrow = { uri: 'https://cdn-icons-png.flaticon.com/512/154/154630.png' };

// Define colors globally for the component
const CATEGORY_COLORS = {
  'Transferencia': '#FF6384',
  'Eventos': '#36A2EB',
  'Entretenimiento': '#FFCE56',
  'Otros': '#4BC0C0'
};

export default function Tickets() {
  const [ticketsData, setTicketsData] = useState(0);
  const [ticketsMonth, setTicketsMonth] = useState(0);
  const [ticketCategories, setTicketCategories] = useState([]);
  const [movements, setMovements] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  // Define colors outside the effect to avoid redeclaration
  const colors = {
    'Eventos': '#FF6384',
    'Restaurantes': '#36A2EB',
    'Entretenimiento': '#FFCE56',
    'Otros': '#4BC0C0'
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      setLoading(true);
      setError(null);

      const fetchData = async () => {
        try {
          // Get tickets data which includes movements
          const response = await ApiService.getTickets();
          console.log('Full tickets response:', JSON.stringify(response, null, 2));
          
          if (isActive) {
            // Process tickets data
            setTicketsData(response.tickets || 0);
            setTicketsMonth(response.ticketsMonth || 0);
            
            // Process movements data
            const movimientos = response.movimientos || [];
            setMovements(movimientos);
            
            // Calculate categories from movements
            const categoryTotals = new Map();
            const categoryTransactions = new Map();
            
            // Process movements by category
            movimientos.forEach(mov => {
              const categoria = mov.categoria_nombre || 'Transferencia';
              // Track total amount - divide by 2 to account for sender/receiver duplication
              const ticketAmount = (mov.tickets || Math.abs(mov.monto)) / 2;
              const currentTotal = categoryTotals.get(categoria) || 0;
              categoryTotals.set(categoria, currentTotal + ticketAmount);
              
              // Track transaction count - divide by 2 to account for sender/receiver duplication
              const currentCount = categoryTransactions.get(categoria) || 0;
              categoryTransactions.set(categoria, currentCount + 0.5); // Add 0.5 instead of 1 to count each transaction once
            });
            
            // Log the total calculated from movements
            const calculatedTotal = Array.from(categoryTotals.values()).reduce((sum, val) => sum + val, 0);
            console.log('Total tickets from movements:', calculatedTotal, 'ticketsMonth from API:', response.ticketsMonth);
            
            // Create categories array for pie chart
            const categories = [];
            
            // Add entries from transactions
            for (const [name, amount] of categoryTotals.entries()) {
              if (amount > 0) {
                categories.push({
                  name,
                  amount: Number(amount),
                  count: categoryTransactions.get(name) || 0,
                  color: CATEGORY_COLORS[name] || colors[name] || '#642684'
                });
              }
            }
            
            // If we have multiple transaction types, add them
            if (categories.length === 0) {
              // Fallback - add a dummy category if nothing else
              categories.push({
                name: 'Sin movimientos',
                amount: 100,
                count: 0,
                color: '#CCCCCC'
              });
            }
            
            console.log('Setting categories with real data:', categories);
            setTicketCategories(categories);
          }
        } catch (err) {
          if (isActive) {
            setError('No se pudieron cargar los tickets.');
            console.error('Error loading tickets:', err);
          }
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };

      fetchData();
      return () => { isActive = false; };
    }, [])
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <SafeAreaView>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <Text style={{ color: 'red', fontSize: 18, marginBottom: 12 }}>{error}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10, backgroundColor: '#eee', borderRadius: 5 }}>
            <Text>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={styles.arrow} source={arrow} />
        </TouchableOpacity>
        <Text style={styles.headerText}> Tus tickets</Text>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.ticketWrapper}>
          <MovCard
            tickets={Number(ticketsData) || 0}
            onGetMore={() => Alert.alert('¡Función para conseguir más tickets!')}
            onTransfer={() => navigation.navigate('Transferir')}
            onRedeem={() => navigation.navigate('Cupones')}
          />
        </View>

        <View style={styles.categoriesSection}>
          <PieChartCard 
            categories={ticketCategories.map(cat => ({
              ...cat,
              // Normalize the amounts to match ticketsMonth total if needed
              amount: ticketsMonth > 0 ? Math.round(cat.amount) : cat.amount
            }))} 
            title="Distribución de Tickets"
            subtitle={`Total de tickets usados este mes: ${ticketsMonth}`} 
          />
        </View>
        
        {/* Transfer History */}
        <View style={styles.transferListContainer}>
          <TransferList movimientos={movements} />
        </View>
        
        {/* Extra padding to ensure scrolling works */}
        <View style={styles.bottomPadding} />
      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 50,
  },
  bottomPadding: {
    height: 80,
  },
  header: {
    marginTop: 30,
    marginLeft: 20,
    flexDirection: 'row',
    marginBottom: 20,
  },
  arrow: {
    resizeMode: 'contain',
    marginTop: 5,
    width: 25,
    height: 25,
    marginRight: 10,
  },
  headerText: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#151C2A',
  },

  ticketWrapper: {
    marginVertical: 10,
  },
  transferListContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  categoriesSection: {
    backgroundColor: '#fff',
    paddingBottom: 10,
  },
});