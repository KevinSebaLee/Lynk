import React from 'react';
import { View, ScrollView, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { API_CONFIG } from '../../constants/config';
import { DIMENSIONS } from '@/constants';

const { screenWidth: width } = DIMENSIONS;

const EventGrid = ({ events, onEventPress }) => {
  // Responsive card sizes (Pinterest-style)
  const CARD_WIDTH = (width - 36) / 2;
  const CARD_HEIGHT_BIG = CARD_WIDTH * 1.53; // first card
  const CARD_HEIGHT_SMALL = CARD_WIDTH * 1.08; // others

  // Arrange events in Pinterest-style columns
  const leftEvents = [];
  const rightEvents = [];
  events.forEach((ev, idx) => {
    if (idx === 0) {
      leftEvents.push({ ...ev, big: true });
    } else if (idx % 2 === 1) {
      rightEvents.push(ev);
    } else {
      leftEvents.push(ev);
    }
  });

  const getImageSource = (imagen) => {
    if (typeof imagen === 'string' && imagen.startsWith('/uploads/')) {
      return { uri: `${API_CONFIG.BASE_URL}${imagen}` };
    }
    if (typeof imagen === 'string' && imagen.startsWith('data:image')) {
      return { uri: imagen };
    }
    return require('../../../assets/img/fallback_image.jpg');
  };

  const iconForCategory = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'musica': return require('../../../assets/img/icons/comprar.png');
      case 'exposiciones': return require('../../../assets/img/icons/comprar.png');
      case 'stand up show': return require('../../../assets/img/icons/comprar.png');
      case 'theater': return require('../../../assets/img/icons/comprar.png');
      default: return require('../../../assets/img/icons/comprar.png');
    }
  };

  const renderEventCard = (ev, big = false) => {
    const cardHeight = big ? CARD_HEIGHT_BIG : CARD_HEIGHT_SMALL;
    
    return (
      <TouchableOpacity
        key={ev.id}
        style={[styles.card, { width: CARD_WIDTH, height: cardHeight }]}
        onPress={() => onEventPress(ev)}
      >
        <Image source={getImageSource(ev.imagen)} style={styles.cardImage} />
        <View style={styles.cardOverlay}>
          <View style={styles.cardTitleRow}>
            <Image source={iconForCategory(ev.categoria_nombre)} style={styles.cardIcon} />
            <Text style={styles.cardTitle} numberOfLines={2}>
              {ev.nombre || 'Sin título'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.eventsScroll} showsVerticalScrollIndicator={false}>
      <View style={styles.gridContainer}>
        <View style={styles.gridRow}>
          <View style={styles.gridColumn}>
            {leftEvents.map(ev => renderEventCard(ev, ev.big))}
          </View>
          <View style={styles.gridColumn}>
            {rightEvents.map(ev => renderEventCard(ev))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  eventsScroll: {
    flex: 1,
  },
  gridContainer: {
    paddingHorizontal: 11,
    paddingBottom: 20,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  gridColumn: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: 2,
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
    flex: 1,
  },
  cardIcon: {
    width: 19,
    height: 19,
    tintColor: '#fff',
  },
});

export default EventGrid;
