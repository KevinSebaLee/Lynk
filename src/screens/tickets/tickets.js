import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import ApiService from '@/services/api';
import { DIMENSIONS } from '@/constants';
import {
  LoadingSpinner,
  ScreenHeader,
  TicketDisplay,
  TransferList,
  MonthlyTicketsChart,
  MovCard,
  PieChartCard
} from '@/components';

const width = DIMENSIONS.screenWidth;
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
  const [monthlyTickets, setMonthlyTickets] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
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

          // Get monthly tickets data (processes same data, doesn't make new API call)
          const monthlyResponse = await ApiService.getMonthlyTickets();

          if (isActive) {
            // Process tickets data
            setTicketsData(response.tickets || 0);

            // Calculate total tickets from movements (more accurate than the API value)
            let totalTickets = 0;
            if (response.movimientos && response.movimientos.length > 0) {
              totalTickets = response.movimientos.reduce((sum, mov) => {
                // Use absolute value since we only care about the total usage
                return sum + Math.abs(mov.monto || 0);
              }, 0);
              // Removed division by 2
            }

            // Use calculated value or fall back to API value
            setTicketsMonth(totalTickets || response.ticketsMonth || 0);

            // Process movements data
            const movimientos = response.movimientos || [];
            setMovements(movimientos);


            // Set monthly tickets data
            if (monthlyResponse && Array.isArray(monthlyResponse)) {
              setMonthlyTickets(monthlyResponse);
              // Default select the most recent month
              if (monthlyResponse.length > 0) {
                setSelectedMonth(monthlyResponse[monthlyResponse.length - 1]);
              }
            }

            // Calculate categories from movements
            const categoryTotals = new Map();
            const categoryTransactions = new Map();

            // Create a map to track which transfers have been counted
            const processedTransferIds = new Set();

            // Process movements by category
            movimientos.forEach(mov => {
              // Skip transactions with invalid or zero amounts
              if (!mov.monto || isNaN(mov.monto)) return;

              const categoria = mov.categoria_nombre || 'Transferencia';

              // Use the absolute value of monto for the ticket amount
              const ticketAmount = Math.abs(mov.monto);

              // For transfers, check if we've already counted this transaction
              if (categoria === 'Transferencia' && mov.transaccion_id) {
                // If we've already processed this transaction, skip it
                if (processedTransferIds.has(mov.transaccion_id)) {
                  return;
                }
                // Mark this transaction as processed
                processedTransferIds.add(mov.transaccion_id);
              }

              const currentTotal = categoryTotals.get(categoria) || 0;
              categoryTotals.set(categoria, currentTotal + ticketAmount);

              // Track transaction count
              const currentCount = categoryTransactions.get(categoria) || 0;
              categoryTransactions.set(categoria, currentCount + 1);
            });

            // Log the total calculated from movements
            const calculatedTotal = Array.from(categoryTotals.values()).reduce((sum, val) => sum + val, 0);

            // Create categories array for pie chart
            const categories = [];

            // Add entries from transactions - use transaction counts, not ticket amounts
            for (const [name, _] of categoryTotals.entries()) {
              // Get the transaction count for this category
              const count = categoryTransactions.get(name) || 0;

              if (count > 0) {
                categories.push({
                  name,
                  // Use the count as the "amount" for the pie chart segments
                  amount: count,
                  // Keep track of the actual ticket amount in a separate property
                  ticketAmount: Number(categoryTotals.get(name) || 0),
                  count: count,
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

  // Store loading and error states to handle conditionally in the return
  const isLoading = loading;
  const hasError = error;

  return (
    isLoading ? (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner />
        </View>
      </SafeAreaView>
    ) : hasError ? (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <Text style={{ color: 'red', fontSize: 18, marginBottom: 12 }}>{error}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10, backgroundColor: '#eee', borderRadius: 5 }}>
            <Text>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    ) : (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader
          title="Tus tickets"
          onBackPress={() => navigation.goBack()}
          titleColor="#151C2A"
        />

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.ticketWrapper}>
            <TicketDisplay
              ticketAmount={Number(ticketsData) || 0}
              title="Tickets Disponibles"
              subtitle="Movimientos"
              showPurchaseIcon={true}
            />
          </View>

          <View style={styles.categoriesSection}>
            <PieChartCard
              categories={ticketCategories}
              title="Distribución de Tickets"
              subtitle={ticketsMonth > 0 ?
                `Total de tickets usados: ${Number(ticketsMonth).toLocaleString('es-ES')}` :
                'No hay datos de uso de tickets'
              }
            />
          </View>

          {/* Monthly Tickets Chart */}
          <View style={styles.chartSection}>
            <MonthlyTicketsChart
              data={monthlyTickets} 
              selectedMonth={selectedMonth}
              onMonthSelect={setSelectedMonth} 
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
    )
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  chartSection: {
    backgroundColor: '#fff',
    paddingBottom: 10,
    marginBottom: 20,
  },
});