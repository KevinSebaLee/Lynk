import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import Header from '../components/header.js';
import { LinearGradient } from 'expo-linear-gradient';
import { useApi } from "../hooks/useApi";
import ApiService from '../services/api.js';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const CATEGORIES = ["Musica", "Exposiciones", "Stand Up Show", "Theater", "Más"];

export default function Eventos() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [events, setEvents] = useState([]);
  const navigation = useNavigation();

  const { execute: loadEvents } = useApi(ApiService.getEventos);

  useEffect(() => {
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
  }, []);

  // Responsive card sizes (Pinterest-style)
  const CARD_WIDTH = (width - 36) / 2;
  const CARD_HEIGHT_BIG = CARD_WIDTH * 1.53; // first card
  const CARD_HEIGHT_SMALL = CARD_WIDTH * 1.08; // others

  // Filtering logic
  const filteredEvents = events.filter(ev => {
    const nameMatch = (ev.nombre || '').toLowerCase().includes(search.toLowerCase());
    const categoryMatch = selectedCategory ? (ev.categoria_nombre || '').toLowerCase().includes(selectedCategory.toLowerCase()) : true;
    return nameMatch && categoryMatch;
  });

  // Arrange events in Pinterest-style columns
  // First event bigger, others alternate
  const leftEvents = [];
  const rightEvents = [];
  filteredEvents.forEach((ev, idx) => {
    if (idx === 0) {
      leftEvents.push({ ...ev, big: true });
    } else if (idx % 2 === 1) {
      rightEvents.push(ev);
    } else {
      leftEvents.push(ev);
    }
  });

  // Dummy icons (replace with your own or based on category)
  const iconForCategory = cat => {
    switch (cat?.toLowerCase()) {
      case 'musica': return require('../../assets/img/icons/comprar.png');
      case 'exposiciones': return require('../../assets/img/icons/comprar.png');
      case 'stand up show': return require('../../assets/img/icons/comprar.png');
      case 'theater': return require('../../assets/img/icons/comprar.png');
      default: return require('../../assets/img/icons/comprar.png');
    }
  };

  // Navigate to the correct screen name!
  const handleEventPress = (event) => {
    navigation.navigate('eventoElegido', { event });
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#642684', '#ffffff', '#ffffff']} style={{ flex: 1 }}>
        <Header nombre="Kevin" />
        <View style={styles.topBar}>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar evento..."
              placeholderTextColor="#4d3769"
            />
            <Image
              source={require('../../assets/img/icons/comprar.png')}
              style={styles.searchIcon}
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                style={[
                  styles.categoryChip,
                  selectedCategory === cat && styles.categoryChipSelected
                ]}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.categoryTextSelected
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
                  <Image source={{ uri: ev.imagen }} style={styles.cardImage} />
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
                  <Image source={{ uri: ev.imagen }} style={styles.cardImage} />
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