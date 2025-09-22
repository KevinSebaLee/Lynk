import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Header from '../../components/layout/header.js';
import { LinearGradient } from 'expo-linear-gradient';
import { useApi } from '../../hooks/useApi.js';
import ApiService from '../../services/api.js';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { SearchBar, CategoryFilter, EventGrid } from '../../components/index.js';

const CATEGORIES = ['Musica', 'Exposiciones', 'Stand Up Show', 'Theater', 'Más'];

export default function Eventos() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [events, setEvents] = useState([]);
  const navigation = useNavigation();

  const { execute: loadEvents } = useApi(ApiService.getEventos);

  useFocusEffect(
    React.useCallback(() => {
      const getEvents = async () => {
        try {
          const data = await loadEvents();
          if (Array.isArray(data)) {
            setEvents(data);
          }
        } catch (err) {
          setEvents([]);
        }
      };
      getEvents();
    }, [])
  );

  // Filtering logic
  const filteredEvents = events.filter(ev => {
    const nameMatch = (ev.nombre || '').toLowerCase().includes(search.toLowerCase());
    const categoryMatch = selectedCategory ? (ev.categoria_nombre || '').toLowerCase().includes(selectedCategory.toLowerCase()) : true;
    return nameMatch && categoryMatch;
  });

  // Navigate to the correct screen name!
  const handleEventPress = (event) => {
    navigation.navigate('eventoElegido', { event });
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#642684', '#ffffff', '#ffffff']} style={{ flex: 1 }}>
        <Header nombre="Kevin" />
        <View style={styles.topBar}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar eventos..."
          />
          <CategoryFilter
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        </View>
        <ScrollView
          style={styles.eventsScroll}
          contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        >
          <EventGrid
            events={filteredEvents}
            onEventPress={handleEventPress}
          />
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: 11,
    paddingBottom: 4,
    backgroundColor: 'transparent',
    marginTop: 3,
  },
  eventsScroll: {
    flex: 1,
  },
});