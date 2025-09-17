import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../components/header.js';
import { LinearGradient } from 'expo-linear-gradient';
import { useApi } from '../hooks/useApi';
import ApiService from '../services/api.js';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { SearchBar, CategoryFilter, EventGrid } from '../components';

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
          <View style={styles.gridRow}>
            <View style={styles.gridColumn}>
              {leftEvents.map((ev, i) => (
                <TouchableOpacity
                  key={ev.id || i}
                  style={[
                    styles.card,
                    { width: CARD_WIDTH, height: ev.big ? CARD_HEIGHT_BIG : CARD_HEIGHT_SMALL }
                  ]}
                  activeOpacity={0.9}
                  onPress={() => handleEventPress(ev)}
                >
                  <Image source={getImageSource(ev.imagen)} style={styles.cardImage} />
                  <View style={styles.cardOverlay}>
                    <View style={styles.cardTitleRow}>
                      <Image source={iconForCategory(ev.categoria_nombre)} style={styles.cardIcon} />
                      <Text style={styles.cardTitle}>{ev.nombre}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.gridColumn}>
              {rightEvents.map((ev, i) => (
                <TouchableOpacity
                  key={ev.id || i}
                  style={[
                    styles.card,
                    { width: CARD_WIDTH, height: CARD_HEIGHT_SMALL }
                  ]}
                  activeOpacity={0.9}
                  onPress={() => handleEventPress(ev)}
                >
                  <Image source={getImageSource(ev.imagen)} style={styles.cardImage} />
                  <View style={styles.cardOverlay}>
                    <View style={styles.cardTitleRow}>
                      <Image source={iconForCategory(ev.categoria_nombre)} style={styles.cardIcon} />
                      <Text style={styles.cardTitle}>{ev.nombre}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9e1ed',
    borderRadius: 9,
    marginBottom: 6,
    paddingHorizontal: 9,
    height: 38,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#4d3769',
    paddingVertical: 7,
    paddingLeft: 6,
    backgroundColor: 'transparent',
  },
  searchIcon: {
    width: 21,
    height: 21,
    tintColor: '#6e55a3',
    marginLeft: 2,
  },
  categoryScroll: {
    marginBottom: 7,
    paddingVertical: 3,
  },
  categoryChip: {
    backgroundColor: '#f5f3fa',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 7,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  categoryChipSelected: {
    backgroundColor: '#642684',
    borderColor: '#642684',
  },
  categoryText: {
    fontSize: 14,
    color: '#6e55a3',
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  eventsScroll: {
    flex: 1,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  gridColumn: {
    flex: 1,
    flexDirection: 'column',
  },
  card: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#cfc7e0',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 7,
    marginHorizontal: 2,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 13,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  cardTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 8,
    textShadowColor: '#222',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  cardIcon: {
    width: 19,
    height: 19,
    tintColor: '#fff',
  },
});