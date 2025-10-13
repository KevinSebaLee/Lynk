import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext.js'; // ajusta el path si es necesario
import ApiService from '@/services/api';

export default function NotificationsScreen() {
  const { user, authInitialized } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Esperar a que el contexto esté inicializado y el user cargado
    if (!authInitialized) return;
    if (!user?.id) return;

    const fetchNotifications = async () => {
      try {
        const data = await ApiService.getNotifications(user.id);
        setNotifications(data);
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar las notificaciones');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [authInitialized, user?.id]);

  if (!authInitialized || loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#B00020" />
      </View>
    );
  }

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    // Aquí puedes agregar el llamado a ApiService.deleteNotification(id) si lo necesitas
  };

  const renderItem = ({ item }) => (
    <View style={styles.notification}>
      <View style={styles.textSection}>
        <Text style={styles.notificationTitle}>{item.nombre}</Text>
        <Text style={styles.notificationBody}>{item.descripcion}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
        accessibilityLabel="Eliminar notificación"
      >
        <Text style={styles.deleteButtonText}>✖</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificaciones</Text>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id?.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tienes notificaciones</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  notification: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textSection: { flex: 1 },
  notificationTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  notificationBody: { color: '#555' },
  deleteButton: {
    marginLeft: 10,
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 18,
    color: '#B00020',
    fontWeight: 'bold',
  },
  emptyText: { textAlign: 'center', color: '#aaa', marginTop: 50 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});