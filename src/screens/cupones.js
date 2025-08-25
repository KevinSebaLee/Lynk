import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity, SafeAreaView, ScrollView, Alert, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MovCard from '../components/MovCard.js';
import ApiService from '../services/api';
import { API_CONFIG } from '../constants/config';

const width = Dimensions.get('window').width;
const arrow = { uri: 'https://cdn-icons-png.flaticon.com/512/154/154630.png' };

// FUNCION PARA OBTENER LA IMAGEN DEL EVENTO
const getImageSource = (imagen) => {
  if (typeof imagen === 'string' && imagen.startsWith('/uploads/')) {
    return { uri: `${API_CONFIG.BASE_URL}${imagen}` };
  }
  if (typeof imagen === 'string' && imagen.startsWith('data:image')) {
    return { uri: imagen };
  }
  return require('../../assets/img/fallback_image.jpg');
};

function EventoFotoCard({ imagen }) {
  return (
    <Pressable style={styles.eventCard} onPress={() => {}}>
      <Image
        source={getImageSource(imagen)}
        style={styles.eventImage}
        resizeMode="cover"
      />
    </Pressable>
  );
}

export default function Cupones() {
  const [ticketsData, setTicketsData] = useState({});
  const [eventos, setEventos] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    ApiService.getTickets()
      .then(data => setTicketsData(data[0] || {}))
      .catch(() => setTicketsData({}));

    ApiService.getEventosAgendados()
      .then(data => setEventos(data || []))
      .catch(() => setEventos([]));
  }, []);

  // Grid en filas de 2
  const renderEventosGrid = () => {
    const rows = [];
    for (let i = 0; i < eventos.length; i += 2) {
      rows.push(
        <View style={styles.eventRow} key={i}>
          <EventoFotoCard imagen={eventos[i]?.imagen} />
          {eventos[i + 1] && <EventoFotoCard imagen={eventos[i + 1]?.imagen} />}
        </View>
      );
    }
    return rows;
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image style={styles.arrow} source={arrow} />
          </TouchableOpacity>
          <Text style={styles.headerText}> Cupones</Text>
        </View>

        <Pressable style={{ marginTop: 10 }}>
          <View style={styles.ticketWrapper}>
            <MovCard
              tickets={ticketsData?.tickets || 0}
              onGetMore={() => Alert.alert('¡Función para conseguir más tickets!')}
              onTransfer={() => navigation.navigate('Transferir')}
              onRedeem={() => navigation.navigate('Cupones')}
            />
          </View>
        </Pressable>

        <View style={styles.eventosSection}>
          {eventos.length === 0 ? (
            <Text style={styles.emptyText}>No tienes eventos agendados.</Text>
          ) : (
            renderEventosGrid()
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const CARD_HEIGHT = 110;
const CARD_MARGIN = 10;

const styles = StyleSheet.create({
  header: {
    flex: 1,
    marginTop: 30,
    marginLeft: 20,
    flexDirection: 'row',
    marginBottom: 20,
  },
  arrow: {
    resizeMode: 'contain',
    marginTop: 5,
    width: 25,
    height: 25,
    marginRight: 10,
  },
  headerText: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#151C2A',
  },
  ticketWrapper: {
    marginVertical: 10,
  },
  eventosSection: {
    marginTop: 14,
    paddingBottom: 20,
    paddingHorizontal: 12,
  },
  eventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: CARD_MARGIN,
  },
  eventCard: {
    width: (width - 48) / 2, // 2 cards por fila con margen
    height: CARD_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    marginRight: CARD_MARGIN,
    elevation: 2,
    shadowColor: '#642684',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  eventImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    backgroundColor: '#eee',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#aaa',
  },
});