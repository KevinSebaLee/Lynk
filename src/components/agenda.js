import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import Header from './header.js';
import { useApi } from "../hooks/useApi";
import ApiService from '../services/api.js';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const WEEKDAYS_ES = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  let d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

export default function Agenda() {
  const now = new Date();
  const initialYear = now.getFullYear();
  const initialMonth = now.getMonth();
  const initialDay = now.getDate();

  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [events, setEvents] = useState([]);
  const navigation = useNavigation();

  const numDays = getDaysInMonth(year, month);
  const firstDayOfWeek = getFirstDayOfWeek(year, month);

  const { execute: loadEvents } = useApi(ApiService.getEventosAgendados);

  // Filtra los eventos para un día concreto
  function getEventsForDay(year, month, day) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    // Si la fecha que viene del backend está en otro formato, hay que convertirla aquí.
    return events.filter(e => {e.fecha === dateStr;});
  }

  useEffect(() => {
    const getEventosAgendados = async () => {
      try {
        const data = await loadEvents();
        if (Array.isArray(data)) {
          setEvents(data);
          console.log("event data", data);
        }
      } catch (err) {
        setEvents([]);
        console.error("Error loading events", err);
      }
    };
    getEventosAgendados();
  }, []);

  // Navegación de meses
  const goToPrevMonth = () => {
    if (month === 0) {
      setMonth(11); setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
    setSelectedDay(1);
  };
  const goToNextMonth = () => {
    if (month === 11) {
      setMonth(0); setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
    setSelectedDay(1);
  };

  let daysArray = [];
  let prevMonthDays = [];
  if (firstDayOfWeek > 0) {
    let prevMonth = month === 0 ? 11 : month - 1;
    let prevMonthYear = month === 0 ? year - 1 : year;
    let prevMonthNumDays = getDaysInMonth(prevMonthYear, prevMonth);
    for (let i = prevMonthNumDays - firstDayOfWeek + 1; i <= prevMonthNumDays; i++) {
      prevMonthDays.push({ day: i, isOtherMonth: true });
    }
  }

  for (let i = 1; i <= numDays; i++) {
    daysArray.push({ day: i, isOtherMonth: false });
  }

  let totalCells = prevMonthDays.length + daysArray.length;
  let nextMonthDays = [];
  if (totalCells % 7 !== 0) {
    let needed = 7 - (totalCells % 7);
    for (let i = 1; i <= needed; i++) {
      nextMonthDays.push({ day: i, isOtherMonth: true });
    }
  }
  const fullCalendar = [...prevMonthDays, ...daysArray, ...nextMonthDays];

  // Eventos del día seleccionado
  const selectedDayEvents = getEventsForDay(year, month, selectedDay);

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={goToPrevMonth} style={styles.chevronBtn}>
            <Text style={styles.chevron}>{'<'}</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.monthText}>{MONTHS_ES[month]}</Text>
            <Text style={styles.yearText}>{year}</Text>
          </View>
          <TouchableOpacity onPress={goToNextMonth} style={styles.chevronBtn}>
            <Text style={styles.chevron}>{'>'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.weekdaysRow}>
          {WEEKDAYS_ES.map((w, idx) => (
            <Text key={w + idx} style={styles.weekdayText}>{w}</Text>
          ))}
        </View>
        <View style={styles.daysGrid}>
          {fullCalendar.map((item, idx) => {
            const isSelected = !item.isOtherMonth && item.day === selectedDay;
            const dayEvents = !item.isOtherMonth ? getEventsForDay(year, month, item.day) : [];
            console.log(dayEvents[0])

            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.dayCell,
                  item.isOtherMonth && styles.dayCellOtherMonth,
                  isSelected && styles.dayCellSelected
                ]}
                disabled={item.isOtherMonth}
                onPress={() => setSelectedDay(item.day)}
                activeOpacity={0.8}
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
                    <View key={j} style={[styles.dot, { backgroundColor: ev.color }]} />
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        {/* Mostrar los eventos del día seleccionado debajo del calendario */}
        <ScrollView style={styles.eventList}>
          {selectedDayEvents.length > 0 ? (
            selectedDayEvents.map((ev, idx) => (
              <View key={idx} style={styles.eventCard}>
                <Text style={{ fontWeight: 'bold', color: ev.color }}>{ev.nombre}</Text>
                <Text>{ev.descripcion}</Text>
                <Text>Ubicación: {ev.ubicacion}</Text>
                <Text>Visibilidad: {ev.visibilidad}</Text>
                <Text>Presupuesto: {ev.presupuesto}</Text>
                <Text>Objetivo: {ev.objetivo}</Text>
                {/* Si tienes imagen podrías mostrarla */}
                {/* <Image source={{ uri: ev.imagen }} style={{ width: 40, height: 40 }} /> */}
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

const CELL_SIZE = Math.floor((width - 32) / 7);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  calendarContainer: {
    margin: 18,
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    shadowColor: '#642684',
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 2,
    flex: 1
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
    justifyContent: 'flex-start',
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
    padding: 8,
    shadowColor: '#642684',
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  noEventsText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 16,
  },
});