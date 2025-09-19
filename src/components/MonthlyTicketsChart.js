import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { GradientBarChart } from './GradientBarChart';



const SCREEN_WIDTH = Dimensions.get('window').width;
const BAR_WIDTH = 45;
const MONTH_WIDTH = 80;
const VISIBLE_MONTHS = Math.floor((SCREEN_WIDTH - 50) / MONTH_WIDTH);

const MonthlyTicketsChart = ({ monthlyData = [], onMonthPress }) => {
  const scrollViewRef = useRef(null);
  const [activeMonthIndex, setActiveMonthIndex] = useState(monthlyData.length - 1);
  
  // Format month names in Spanish
  const formatMonth = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Error';
      
      // Get month name in Spanish with first letter uppercase
      let monthName = date.toLocaleDateString('es-ES', { month: 'short' })
        .replace('.', '') // Remove any periods
        .charAt(0).toUpperCase() + date.toLocaleDateString('es-ES', { month: 'short' }).slice(1);
      
      // Add year
      return `${monthName}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Error';
    }
  };
  
  // Find the highest value for scaling
  const maxTickets = Math.max(
    ...monthlyData.map(item => Number(item.total_tickets) || 0), 
    50 // Minimum scale value to avoid empty charts
  );
  
  // Scroll to the active month when component mounts or activeMonthIndex changes
  const scrollToActiveMonth = () => {
    if (scrollViewRef.current && monthlyData.length > 0) {
      // Calculate scroll position to center the selected month
      // For left-to-right scrolling (newest months on the right):
      const scrollPosition = Math.max(0, (activeMonthIndex * MONTH_WIDTH) - (SCREEN_WIDTH - MONTH_WIDTH) / 2);
      scrollViewRef.current.scrollTo({ x: scrollPosition, animated: true });
    }
  };
  
  // Handle month selection
  const handleMonthPress = (reversedIndex) => {
    // Convert the reversed index to the original index
    const originalIndex = monthlyData.length - 1 - reversedIndex;
    setActiveMonthIndex(originalIndex);
    if (onMonthPress) {
      onMonthPress(monthlyData[originalIndex]);
    }
    
    // Scroll to center the selected month
    setTimeout(scrollToActiveMonth, 100);
  };

  // Show placeholder if no data
  if (!monthlyData || monthlyData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Uso de Tickets Mensual</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay datos disponibles</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Uso de Tickets Mensual</Text>
      <View style={styles.chartContainer}>
        {/* Month labels and bars */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onLayout={scrollToActiveMonth}
        >
          {[...monthlyData].reverse().map((item, index) => {
            // Reverse the index to match the original array
            const originalIndex = monthlyData.length - 1 - index;
            const isActive = originalIndex === activeMonthIndex;
            const barHeight = Math.max(
              20, // Minimum visible height
              (Number(item.total_tickets) / maxTickets) * 120 // Updated to match new container height
            );
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.monthColumn,
                  isActive && styles.activeMonthColumn
                ]}
                onPress={() => handleMonthPress(index)}
                activeOpacity={0.7}
              >
                {/* Month label moved to the top */}
                <Text style={[
                  styles.monthLabel,
                  isActive && styles.activeMonthLabel
                ]}>
                  {formatMonth(item.month)}
                </Text>
                
                <View style={styles.barWrapper}>
                  <View style={[
                    styles.barContainer,
                    { height: 120 } // Updated to match barWrapper height
                  ]}>
                    <View style={[
                      styles.barFill,
                      isActive && styles.activeBarFill,
                      { height: barHeight }
                    ]}>
                      {isActive && (
                        <View style={styles.valueContainer}>
                          <Text style={styles.valueText}>
                            {Math.round(Number(item.total_tickets))}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      
      {/* Details for selected month */}
      {activeMonthIndex >= 0 && activeMonthIndex < monthlyData.length && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailLabel}>
            {formatMonth(monthlyData[activeMonthIndex]?.month)}
          </Text>
          <Text style={styles.detailValue}>
            {Math.round(Number(monthlyData[activeMonthIndex]?.total_tickets || 0))} tickets
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#642684',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(100, 38, 132, 0.05)',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#151C2A',
    marginBottom: 20,
  },
  chartContainer: {
    height: 170, // Adjusted height
    marginBottom: 20,
  },
  scrollContent: {
    paddingHorizontal: 10,
    alignItems: 'flex-start', // Changed to flex-start to align from top
    height: '100%',
  },
  monthColumn: {
    width: MONTH_WIDTH,
    alignItems: 'center',
    justifyContent: 'flex-start', // Changed to flex-start to align from top
    height: 150, // Added explicit height
  },
  activeMonthColumn: {
    elevation: 3,
  },
  monthLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 5,
    marginTop: 0,
    fontWeight: '600',
  },
  activeMonthLabel: {
    color: '#642684',
    fontWeight: '700',
  },
  barWrapper: {
    height: 120, // Reduced height to make room for labels
    width: BAR_WIDTH,
    justifyContent: 'flex-end',
    paddingBottom: 0, // Removed padding since labels are now above
  },
  barContainer: {
    width: BAR_WIDTH,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    backgroundColor: '#B388FF',
    borderRadius: 8,
    position: 'absolute',
    bottom: 0,
    shadowColor: '#642684',
    shadowOffset: {
      width: 0, 
      height: 3
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  activeBarFill: {
    backgroundColor: '#642684',
    shadowColor: '#642684',
    shadowOffset: {
      width: 0, 
      height: 4
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },
  valueContainer: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    bottom: 0,
    paddingVertical: 5,
  },
  valueText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  detailLabel: {
    fontSize: 16,
    color: '#151C2A',
    fontWeight: '700',
  },
  detailValue: {
    fontSize: 16,
    color: '#642684',
    fontWeight: '700',
  },
  emptyContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#757575',
    fontSize: 14,
  },
});

export default MonthlyTicketsChart;
