import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useApi } from '@/hooks/useApi';
import ApiService from '@/services/api';
import Header from './header';

// Pre-calculate dimensions for better performance
const { width } = Dimensions.get('window');

// Constants for localization
const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const WEEKDAYS_ES = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

/**
 * Get the number of days in a specific month
 * 
 * @param {number} year - The year
 * @param {number} month - The month (0-11)
 * @returns {number} Number of days in the month
 */
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get the first day of the week for a month (0=Monday, 6=Sunday)
 * 
 * @param {number} year - The year
 * @param {number} month - The month (0-11)
 * @returns {number} The first day of the week (0-6)
 */
function getFirstDayOfWeek(year, month) {
  let d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

/**
 * Agenda component displays a calendar with events
 * 
 * @returns {React.ReactElement} Rendered component
 */
export default function Agenda() {
  // Initialize with current date
  const now = new Date();
  const initialYear = now.getFullYear();
  const initialMonth = now.getMonth();
  const initialDay = now.getDate();

  // State management
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [events, setEvents] = useState([]);
  const navigation = useNavigation();

  // API hook for loading events
  const { execute: loadEvents } = useApi(ApiService.getEventosAgendados);

  // Memoized calendar calculations
  const numDays = useMemo(() => getDaysInMonth(year, month), [year, month]);
  const firstDayOfWeek = useMemo(() => getFirstDayOfWeek(year, month), [year, month]);

  /**
   * Filter events for a specific day
   * 
   * @param {number} year - The year
   * @param {number} month - The month (0-11)
   * @param {number} day - The day of the month
   * @returns {Array} Filtered events
   */
  const getEventsForDay = useCallback((year, month, day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.fecha.split("T")[0] === dateStr);
  }, [events]);

  // Load events when screen gains focus
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getEventosAgendados = async () => {
        try {
          const data = await loadEvents();
          if (isActive && Array.isArray(data)) {
            setEvents(data);
          }
        } catch (err) {
          if (isActive) setEvents([]);
          console.error("Error loading events", err);
        }
      };
      getEventosAgendados();

      // Cleanup: avoid setting state if component is unfocused
      return () => { isActive = false; };
    }, [loadEvents])
  );

  // Month navigation handlers
  const goToPrevMonth = useCallback(() => {
    setYear(prevYear => {
      setMonth(prevMonth => {
        if (prevMonth === 0) {
          return 11;
        } else {
          return prevMonth - 1;
        }
      });
      return prevMonth => prevMonth === 0 ? prevYear - 1 : prevYear;
    });
    setSelectedDay(1);
  }, []);

  const goToNextMonth = useCallback(() => {
    setYear(prevYear => {
      setMonth(prevMonth => {
        if (prevMonth === 11) {
          return 0;
        } else {
          return prevMonth + 1;
        }
      });
      return prevMonth => prevMonth === 11 ? prevYear + 1 : prevYear;
    });
    setSelectedDay(1);
  }, []);

  // Calculate calendar days (memoized to prevent unnecessary recalculations)
  const fullCalendar = useMemo(() => {
    let daysArray = [];
    let prevMonthDays = [];
    
    // Calculate previous month days to show
    if (firstDayOfWeek > 0) {
      let prevMonth = month === 0 ? 11 : month - 1;
      let prevMonthYear = month === 0 ? year - 1 : year;
      let prevMonthNumDays = getDaysInMonth(prevMonthYear, prevMonth);
      for (let i = prevMonthNumDays - firstDayOfWeek + 1; i <= prevMonthNumDays; i++) {
        prevMonthDays.push({ day: i, isOtherMonth: true });
      }
    }

    // Current month days
    for (let i = 1; i <= numDays; i++) {
      daysArray.push({ day: i, isOtherMonth: false });
    }

    // Next month days to fill the calendar grid
    let totalCells = prevMonthDays.length + daysArray.length;
    let nextMonthDays = [];
    if (totalCells % 7 !== 0) {
      let needed = 7 - (totalCells % 7);
      for (let i = 1; i <= needed; i++) {
        nextMonthDays.push({ day: i, isOtherMonth: true });
      }
    }

    return [...prevMonthDays, ...daysArray, ...nextMonthDays];
  }, [firstDayOfWeek, month, numDays, year]);

  // Memoized selected day events to prevent recalculation on each render
  const selectedDayEvents = useMemo(() => 
    getEventsForDay(year, month, selectedDay),
    [getEventsForDay, year, month, selectedDay]
  );

  // Memoized calendar header
  const renderCalendarHeader = useMemo(() => (
    <View style={styles.headerRow}>
      <TouchableOpacity 
        onPress={goToPrevMonth} 
        style={styles.chevronBtn}
        accessibilityLabel="Previous month"
        accessibilityRole="button"
      >
        <Text style={styles.chevron}>{'<'}</Text>
      </TouchableOpacity>
      <View>
        <Text style={styles.monthText}>{MONTHS_ES[month]}</Text>
        <Text style={styles.yearText}>{year}</Text>
      </View>
      <TouchableOpacity 
        onPress={goToNextMonth} 
        style={styles.chevronBtn}
        accessibilityLabel="Next month"
        accessibilityRole="button"
      >
        <Text style={styles.chevron}>{'>'}</Text>
      </TouchableOpacity>
    </View>
  ), [month, year, goToPrevMonth, goToNextMonth]);

  // Memoized weekday headers
  const renderWeekdays = useMemo(() => (
    <View style={styles.weekdaysRow}>
      {WEEKDAYS_ES.map((w, idx) => (
        <Text key={w + idx} style={styles.weekdayText}>{w}</Text>
      ))}
    </View>
  ), []);

  // Day selection handler
  const handleDaySelect = useCallback((day) => {
    setSelectedDay(day);
  }, []);

  // Memoized event day indicator
  const DayCell = useCallback(({ item, idx }) => {
    const isSelected = !item.isOtherMonth && item.day === selectedDay;
    const dayEvents = !item.isOtherMonth ? getEventsForDay(year, month, item.day) : [];

    return (
      <TouchableOpacity
        key={idx}
        style={[
          styles.dayCell,
          item.isOtherMonth && styles.dayCellOtherMonth,
          isSelected && styles.dayCellSelected
        ]}
        disabled={item.isOtherMonth}
        onPress={() => handleDaySelect(item.day)}
        activeOpacity={0.8}
        accessibilityLabel={`${item.day} de ${MONTHS_ES[month]} de ${year}`}
        accessibilityRole="button"
      >
        <Text style={[
          styles.dayText,
          item.isOtherMonth ? styles.dayTextOtherMonth : null,
          isSelected ? styles.dayTextSelected : null
        ]}>
          {item.day}
        </Text>
        <View style={styles.dotsRow}>
          {dayEvents.map((ev, j) => (
            <View 
              key={j} 
              style={[styles.dot, { backgroundColor: '#642684' }]} 
              accessibilityLabel="Evento"
            />
          ))}
        </View>
      </TouchableOpacity>
    );
  }, [selectedDay, getEventsForDay, year, month, handleDaySelect]);

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        {/* Calendar header with month/year and navigation */}
        {renderCalendarHeader}
        
        {/* Weekdays header row */}
        {renderWeekdays}
        
        {/* Calendar days grid */}
        <View style={styles.daysGrid}>
          {fullCalendar.map((item, idx) => (
            <DayCell key={idx} item={item} idx={idx} />
          ))}
        </View>
        
        {/* Events list for selected day */}
        <ScrollView 
          style={styles.eventList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          {selectedDayEvents.length > 0 ? (
            selectedDayEvents.map((ev, idx) => (
              <View 
                key={idx} 
                style={styles.eventCard}
                accessibilityLabel={`Evento: ${ev.nombre}`}
                accessibilityRole="summary"
              >
                <Text style={styles.eventTitle}>{ev.nombre}</Text>
                <Text style={styles.eventDescription}>{ev.descripcion}</Text>
                <Text style={styles.eventLocation}>Ubicación: {ev.ubicacion}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noEventsText}>No hay eventos para este día.</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

// Pre-calculate cell size for the calendar grid
const CELL_SIZE = Math.floor((width - 32) / 7);

// Use StyleSheet for better performance
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  calendarContainer: {
    margin: 4,
    marginLeft: 10,
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 0,
    flex: 1,
    shadowColor: '#642684',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginVertical: 5,
    marginTop: 10,
  },
  chevronBtn: {
    padding: 8,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: {
    fontSize: 25,
    color: "#642684",
    fontWeight: 'bold',
  },
  monthText: {
    fontSize: 20,
    color: "#222",
    fontWeight: 'bold',
    textAlign: 'center',
  },
  yearText: {
    fontSize: 13,
    color: "#888",
    textAlign: 'center',
    marginTop: -3,
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 6,
    paddingHorizontal: 7,
  },
  weekdayText: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
    width: CELL_SIZE,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 10,
    marginTop: 6,
  },
  dayCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: CELL_SIZE / 2.1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
    marginHorizontal: 0,
  },
  dayCellOtherMonth: {
    backgroundColor: 'transparent',
  },
  dayCellSelected: {
    backgroundColor: '#735BF2',
  },
  dayText: {
    fontSize: 17,
    color: '#222',
    fontWeight: '600',
    textAlign: 'center',
  },
  dayTextOtherMonth: {
    color: '#d2d2d2',
    fontWeight: '400',
  },
  dayTextSelected: {
    color: '#fff',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 3,
    minHeight: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 2,
  },
  eventList: {
    marginTop: 10,
    maxHeight: 180,
  },
  eventCard: {
    backgroundColor: '#f7f7fa',
    borderRadius: 10,
    marginVertical: 4,
    padding: 10,
    shadowColor: '#642684',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  eventTitle: {
    fontWeight: 'bold', 
    color: '#642684',
    fontSize: 15,
    marginBottom: 2,
  },
  eventDescription: {
    color: '#333',
    marginBottom: 2,
  },
  eventLocation: {
    color: '#555',
    fontSize: 13,
  },
  noEventsText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 16,
  },
});