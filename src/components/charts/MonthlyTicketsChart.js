import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DIMENSIONS } from '@/constants';

const { screenWidth: width } = DIMENSIONS;

// Convert any "month" value (number or ISO string) into 1..12
const getMonthNumber = (value) => {
  if (value == null) return null;

  if (typeof value === 'number') {
    if (Number.isNaN(value)) return null;
    return Math.min(12, Math.max(1, value));
  }

  if (typeof value === 'string') {
    const isoLike = /^\d{4}-\d{2}(-\d{2})?/;
    let d;
    if (isoLike.test(value) && value.length <= 7) {
      // YYYY-MM -> make it a safe date
      d = new Date(`${value}-01`);
    } else {
      d = new Date(value);
    }
    if (!Number.isNaN(d.getTime())) {
      return d.getMonth() + 1;
    }
  }

  return null;
};

const getMonthName = (monthNum) => {
  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];
  if (typeof monthNum === 'number' && monthNum >= 1 && monthNum <= 12) {
    return months[monthNum - 1];
  }
  return String(monthNum ?? '');
};

const MonthlyTicketsChart = ({ data = [], selectedMonth, onMonthSelect }) => {
  // Normalize incoming data to a stable shape for rendering
  const normalizedData = (Array.isArray(data) ? data : [])
    .map((item) => {
      // Use total_tickets from backend, fallback to tickets if provided
      const tickets = Number(item?.tickets ?? item?.total_tickets ?? 0) || 0;

      // Normalize month into 1..12 number
      const monthRaw = item?.month ?? item?.date ?? item?.Month ?? item?.MonthNumber;
      const month = getMonthNumber(monthRaw);

      return { month, tickets };
    })
    .filter((item) => item.month !== null);

  if (!normalizedData.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay datos de tickets mensuales</Text>
      </View>
    );
  }

  const maxTickets = Math.max(...normalizedData.map(item => item.tickets || 0)) || 1;
  const chartWidth = width - 40;
  const barWidth = (chartWidth - (normalizedData.length - 1) * 8) / normalizedData.length;

  // Normalize the selected month
  const selectedNum = getMonthNumber(selectedMonth);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tickets por Mes</Text>

      <View style={styles.chartContainer}>
        <View style={styles.barsContainer}>
          {normalizedData.map((item, index) => {
            const barHeight = (item.tickets / maxTickets) * 120;
            const isSelected = selectedNum != null ? (selectedNum === item.month) : false;
            const hasTickets = (item.tickets || 0) > 0;

            // Color rules:
            // - Selected -> purple
            // - Has tickets but not selected -> black
            // - No tickets -> light gray
            let barColor = '#E3E3E3';
            if (isSelected) {
              barColor = '#642684';
            } else if (hasTickets) {
              barColor = '#000000';
            }

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