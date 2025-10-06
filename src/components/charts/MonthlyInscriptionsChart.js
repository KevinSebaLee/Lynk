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
            const hasInscriptions = item.inscriptions > 0;
            const isSelected = selectedMonth === item.month;
            
            // Calculate bar height with minimum 25px for visibility
            const barHeight = hasInscriptions 
              ? Math.max((item.inscriptions / maxInscriptions) * 120, 25)
              : 0;
            
            // Purple color scheme
            const barColor = isSelected ? '#8B3A9E' : '#9F4B97';
            
            return (
              <TouchableOpacity
                key={`inscription-${item.month}-${index}`}
                style={styles.barContainer}
                onPress={() => hasInscriptions && onMonthSelect && onMonthSelect(item.month)}
                activeOpacity={hasInscriptions ? 0.7 : 1}
              >
                <View style={styles.barWrapper}>
                  {hasInscriptions && (
                    <>
                      <Text style={styles.inscriptionCount}>{item.inscriptions}</Text>
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
                  !hasInscriptions && styles.monthLabelEmpty,
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

export default MonthlyInscriptionsChart;