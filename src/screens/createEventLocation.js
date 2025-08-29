import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useApi } from '../hooks/useApi';
import ApiService from '../services/api';

export default function CreateEventLocation() {
  const [name, setName] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');
  const [locationId, setLocationId] = useState(''); // This should be selected from a list
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const { execute: createLocation } = useApi(ApiService.createEventLocation);

  const handleCreate = async () => {
    if (!name.trim() || !fullAddress.trim() || !maxCapacity || !locationId) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos.');
      return;
    }

    if (name.trim().length < 3) {
      Alert.alert('Error', 'El nombre debe tener al menos 3 caracteres.');
      return;
    }

    if (fullAddress.trim().length < 3) {
      Alert.alert('Error', 'La dirección debe tener al menos 3 caracteres.');
      return;
    }

    const capacity = parseInt(maxCapacity);
    if (isNaN(capacity) || capacity <= 0) {
      Alert.alert('Error', 'La capacidad máxima debe ser un número mayor a 0.');
      return;
    }

    try {
      setLoading(true);
      
      const locationData = {
        name: name.trim(),
        full_address: fullAddress.trim(),
        max_capacity: capacity.toString(),
        id_location: parseInt(locationId) || 1, // Default location ID
        latitude: latitude || '-34.5889',
        longitude: longitude || '-58.4173'
      };

      const response = await createLocation(locationData);
      
      if (response && (response.id || response.message)) {
        Alert.alert('Éxito', 'Ubicación creada correctamente', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', 'No se pudo crear la ubicación');
      }
    } catch (error) {
      console.error('Error creating location:', error);
      Alert.alert('Error', 'Error al crear la ubicación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#642684', '#ffffff', '#ffffff']} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nueva Ubicación</Text>
        </View>

        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <Text style={styles.label}>Nombre de la ubicación *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Ej: Movistar Arena"
              maxLength={100}
            />

            <Text style={styles.label}>Dirección completa *</Text>
            <TextInput
              style={styles.input}
              value={fullAddress}
              onChangeText={setFullAddress}
              placeholder="Ej: Humboldt 450, C1414 CABA"
              maxLength={200}
              multiline
            />

            <Text style={styles.label}>Capacidad máxima *</Text>
            <TextInput
              style={styles.input}
              value={maxCapacity}
              onChangeText={setMaxCapacity}
              placeholder="Ej: 15000"
              keyboardType="numeric"
              maxLength={10}
            />

            <Text style={styles.label}>ID de Localidad *</Text>
            <TextInput
              style={styles.input}
              value={locationId}
              onChangeText={setLocationId}
              placeholder="Ej: 3397"
              keyboardType="numeric"
              maxLength={10}
            />

            <Text style={styles.label}>Latitud (opcional)</Text>
            <TextInput
              style={styles.input}
              value={latitude}
              onChangeText={setLatitude}
              placeholder="Ej: -34.593488"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Longitud (opcional)</Text>
            <TextInput
              style={styles.input}
              value={longitude}
              onChangeText={setLongitude}
              placeholder="Ej: -58.447358"
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={[styles.createButton, loading && styles.buttonDisabled]}
              onPress={handleCreate}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.createButtonText}>Crear Ubicación</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  form: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  createButton: {
    backgroundColor: '#642684',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});