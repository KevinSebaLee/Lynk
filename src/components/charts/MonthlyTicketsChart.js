import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DIMENSIONS } from '@/constants';

const { screenWidth: width } = DIMENSIONS;

const MonthlyTicketsChart = ({ data = [], selectedMonth, onMonthSelect }) => {
  
  if (!data.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay datos de tickets mensuales</Text>
      </View>
    );
  }

  const maxTickets = Math.max(...data.map(item => item.tickets || 0));

  const getMonthName = (monthNum) => {
    const months = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    return months[monthNum - 1] || monthNum;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tickets por Mes</Text>
      
      <View style={styles.chartContainer}>
        <View style={styles.barsContainer}>
          {data.map((item, index) => {
            const hasTickets = item.tickets > 0;
            const isSelected = selectedMonth === item.month;
            
            // Calculate bar height with minimum 25px for visibility
            const barHeight = hasTickets 
              ? Math.max((item.tickets / maxTickets) * 120, 25)
              : 0;
            
            // Purple color scheme
            const barColor = isSelected ? '#8B3A9E' : '#9F4B97';
            
            return (
              <TouchableOpacity
                key={`ticket-${item.month}-${index}`}
                style={styles.barContainer}
                onPress={() => hasTickets && onMonthSelect && onMonthSelect(item.month)}
                activeOpacity={hasTickets ? 0.7 : 1}
              >
                <View style={styles.barWrapper}>
                  {hasTickets && (
                    <>
                      <Text style={styles.ticketCount}>{item.tickets}</Text>
                      <View
                        style={[
                          styles.bar,
                          {
                            height: barHeight,
                            backgroundColor: barColor,
                          }
                        ]}
                      />
                    </>
                  )}
                </View>
                <Text style={[
                  styles.monthLabel,
                  isSelected && styles.monthLabelSelected,
                  !hasTickets && styles.monthLabelEmpty,
                ]}>
                  {getMonthName(item.month)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    width: '100%',
    height: 160,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 2,
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 140,
    width: '100%',
  },
  bar: {
    width: '85%',
    borderRadius: 8,
    minHeight: 25,
  },
  ticketCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  monthLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
    color: '#666',
  },
  monthLabelSelected: {
    color: '#8B3A9E',
    fontWeight: '600',
  },
  monthLabelEmpty: {
    color: '#ccc',
  },
  emptyContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 40,
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default MonthlyTicketsChart;