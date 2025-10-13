import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import ApiService from '../../services/api';
import { LoadingSpinner } from '../../components/common';
import { ScreenHeader } from '../../components';

export default function EventCoupons() {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const load = async () => {
        setLoading(true);
        setError(null);
        try {
          // Debe devolver SOLO los eventos que tienen cupones
          const data = await ApiService.getEventsWithCoupons?.();
          if (isActive && Array.isArray(data)) {
            setEvents(data);
          }
        } catch (e) {
          if (isActive) setError('No se pudieron cargar los eventos');
        } finally {
          if (isActive) setLoading(false);
        }
      };
      load();
      return () => { isActive = false; };
    }, [])
  );

  const handleRefresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ApiService.getEventsWithCoupons?.();
      if (Array.isArray(data)) setEvents(data);
    } catch (e) {
      setError('Error al refrescar eventos');
    } finally {
      setLoading(false);
    }
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  const renderItem = ({ item }) => (
    
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigation.navigate('cupones', { idEvent: item.id })}
    >
      <Text style={styles.eventName}>{item.nombre}</Text>
      <Text style={styles.eventDate}>{formatDate(item.fecha)}</Text>

    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={['#642684', '#ffffff']} style={{ flex: 1 }}>
        <ScreenHeader title="Eventos con cupones" onBack={() => navigation.goBack()} />
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <View style={styles.center}>
            <Text>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={events}
            keyExtractor={(item, idx) => item.id?.toString() || String(idx)}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', marginTop: 40 }}>
                No hay eventos con cupones
              </Text>
            }
            onRefresh={handleRefresh}
            refreshing={loading}
          />
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#642684',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  eventName: { fontSize: 16, fontWeight: 'bold', color: '#642684' },
  eventDate: { fontSize: 12, color: '#666', marginTop: 4 },
});