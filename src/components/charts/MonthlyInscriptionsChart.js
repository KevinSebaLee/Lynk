import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

const MonthlyInscriptionsChart = ({ data = [], selectedMonth, onMonthSelect }) => {
  if (!data.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay datos de inscripciones mensuales</Text>
      </View>
    );
  }

  const maxInscriptions = Math.max(...data.map(item => item.inscriptions || 0));
  const chartWidth = width - 40;
  const barWidth = (chartWidth - (data.length - 1) * 8) / data.length;

  const getMonthName = (monthNum) => {
    const months = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    return months[monthNum - 1] || monthNum;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inscripciones por Mes</Text>
      
      <View style={styles.chartContainer}>
        <View style={styles.barsContainer}>
          {data.map((item, index) => {
            const barHeight = maxInscriptions > 0 ? (item.inscriptions / maxInscriptions) * 120 : 0;
            const isSelected = selectedMonth === item.month;
            
            return (
              <TouchableOpacity
                key={index}
                style={[styles.barContainer, { width: barWidth }]}
                onPress={() => onMonthSelect && onMonthSelect(item.month)}
              >
                <View style={styles.barWrapper}>
                  <Text style={styles.inscriptionCount}>{item.inscriptions || 0}</Text>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: barHeight,
                        backgroundColor: isSelected ? '#642684' : '#E3F2FD',
                      }
                    ]}
                  />
                </View>
                <Text style={[
                  styles.monthLabel,
                  { color: isSelected ? '#642684' : '#666' }
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
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 160,
    paddingHorizontal: 8,
  },
  barContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 140,
  },
  bar: {
    width: '80%',
    borderRadius: 4,
    minHeight: 4,
  },
  inscriptionCount: {
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

export default MonthlyInscriptionsChart;