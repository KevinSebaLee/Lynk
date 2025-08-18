import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, Switch, Animated, Dimensions, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ApiService from '../services/api';
import DateTimePicker from '@react-native-community/datetimepicker';

const { height, width } = Dimensions.get('window');

// Helper function for unique IDs (you may want to use UUID or your DB's IDs in production)
let categoryIdCounter = 1;

export default function CreateEventModal({ visible, onClose }) {
  const translateY = useRef(new Animated.Value(height)).current;

  // Each category now has an id
  const [categories, setCategories] = useState([
    { id: categoryIdCounter++, name: 'Deportes', color: '#f3e9f9', textColor: '#642684' },
    { id: categoryIdCounter++, name: 'Música', color: '#e3f7ef', textColor: '#3ec19f' },
    { id: categoryIdCounter++, name: 'Global', color: '#eaf4fb', textColor: '#3792e3' },
  ]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id);

  // State for fields
  const [newCategory, setNewCategory] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [fechaDate, setFechaDate] = useState(null);
  const [showFechaPicker, setShowFechaPicker] = useState(false);

  const [horaInicio, setHoraInicio] = useState('');
  const [horaInicioDate, setHoraInicioDate] = useState(null);
  const [showHoraInicioPicker, setShowHoraInicioPicker] = useState(false);

  const [horaFin, setHoraFin] = useState('');
  const [horaFinDate, setHoraFinDate] = useState(null);
  const [showHoraFinPicker, setShowHoraFinPicker] = useState(false);

  const [visibilidad, setVisiblidad] = useState(true);
  const [ubicacion, setUbicacion] = useState('');
  const [presupuesto, setPresupuesto] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [color, setColor] = useState(null);
  const [imagenVerificar, setImagenVerificar] = useState(null);

  const createEvento = ApiService.createEvento;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : height,
      duration: visible ? 420 : 320,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const handleFechaChange = (event, selectedDate) => {
    setShowFechaPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFechaDate(selectedDate);
      setFecha(selectedDate.toISOString().split('T')[0]);
    }
  };

  const handleHoraInicioChange = (event, selectedDate) => {
    setShowHoraInicioPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setHoraInicioDate(selectedDate);
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      setHoraInicio(`${hours}:${minutes}`);
    }
  };

  const handleHoraFinChange = (event, selectedDate) => {
    setShowHoraFinPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setHoraFinDate(selectedDate);
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      setHoraFin(`${hours}:${minutes}`);
    }
  };

  const handleNumericChange = setter => value => {
    const filtered = value.replace(/[^0-9]/g, '');
    setter(filtered);
  };

  const handlePrivadoChange = value => {
    setVisiblidad(value);
    if (value) {
      setPresupuesto('');
      setObjetivo('');
    }
  };

  const handleAddCategory = () => {
    const trimmedName = newCategory.trim();
    if (!trimmedName) {
      setCategoryError('Ingresa un nombre');
      return;
    }
    if (categories.some(cat => cat.name.toLowerCase() === trimmedName.toLowerCase())) {
      setCategoryError('Ya existe esa categoría');
      return;
    }
    const newCat = {
      id: categoryIdCounter++,
      name: trimmedName,
      color: '#f5f5f8',
      textColor: '#642684',
    };
    setCategories([...categories, newCat]);
    setNewCategory('');
    setCategoryError('');
    setSelectedCategoryId(newCat.id);
  };

  const handleDeleteCategory = (idx) => {
    const deletedId = categories[idx].id;
    const newCategories = categories.filter((_, i) => i !== idx);
    setCategories(newCategories);

    if (selectedCategoryId === deletedId) {
      setSelectedCategoryId(newCategories[0]?.id);
    }
  };

  const handleSelectCategory = id => setSelectedCategoryId(id);

  const handleCreateEvent = async () => {
    if (!nombre || !descripcion || !fecha || !horaInicio || !horaFin || !ubicacion) {
      setCategoryError('Por favor completa todos los campos requeridos.');
      return;
    }
    try {
      // Always send id_categoria as an array
      const eventData = {
        id_categoria: [selectedCategoryId], // <-- Always array!
        nombre,
        descripcion,
        fecha,
        horaInicio,
        horaFin,
        visibilidad,
        ubicacion,
        presupuesto: visibilidad ? 0 : presupuesto,
        objetivo: visibilidad ? 0 : objetivo,
        color,
        imagen: imagenVerificar,
      };

      const response = await createEvento(eventData);
      console.log('Evento creado:', response);
      onClose();
    } catch (error) {
      console.error('Error creando evento:', error);
    }
  };

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <Animated.View style={[styles.animatedCard, { transform: [{ translateY }] }]}>
          <View style={styles.card}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={28} color="#642684" />
            </TouchableOpacity>
            <Text style={styles.header}>Crear evento</Text>
            <View style={styles.imageBox}>
              <Ionicons name="image-outline" size={40} color="#c7c9d8" />
            </View>
            <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
            <TextInput style={styles.input} placeholder="Descripcion..." multiline value={descripcion} onChangeText={setDescripcion} />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.dateInput]}
                placeholder="Fecha"
                value={fecha}
                editable={false}
              />
              <TouchableOpacity onPress={() => setShowFechaPicker(true)}>
                <Ionicons name="calendar-outline" size={21} color="#642684" />
              </TouchableOpacity>
              {showFechaPicker && (
                <DateTimePicker
                  value={fechaDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleFechaChange}
                />
              )}
            </View>
            <View style={styles.row}>
              <View style={{flex: 1}}>
                <TextInput
                  style={styles.input}
                  placeholder="Comienzo"
                  value={horaInicio}
                  editable={false}
                />
              </View>
              <TouchableOpacity onPress={() => setShowHoraInicioPicker(true)}>
                <Ionicons name="time-outline" size={21} color="#642684" />
              </TouchableOpacity>
              {showHoraInicioPicker && (
                <DateTimePicker
                  value={horaInicioDate || new Date()}
                  mode="time"
                  display="default"
                  onChange={handleHoraInicioChange}
                  is24Hour={true}
                />
              )}
              <View style={{flex: 1}}>
                <TextInput
                  style={styles.input}
                  placeholder="Fin"
                  value={horaFin}
                  editable={false}
                />
              </View>
              <TouchableOpacity onPress={() => setShowHoraFinPicker(true)}>
                <Ionicons name="time-outline" size={21} color="#642684" />
              </TouchableOpacity>
              {showHoraFinPicker && (
                <DateTimePicker
                  value={horaFinDate || new Date()}
                  mode="time"
                  display="default"
                  onChange={handleHoraFinChange}
                  is24Hour={true}
                />
              )}
            </View>
            <TextInput style={styles.input} placeholder="Ubicación" value={ubicacion} onChangeText={setUbicacion} />
            {!visibilidad && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Presupuesto"
                  value={presupuesto}
                  keyboardType="numeric"
                  onChangeText={handleNumericChange(setPresupuesto)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Objetivo"
                  value={objetivo}
                  keyboardType="numeric"
                  onChangeText={handleNumericChange(setObjetivo)}
                />
              </>
            )}
            <View style={styles.privadoRow}>
              <Text style={styles.privadoLabel}>Privado</Text>
              <Switch value={visibilidad} onValueChange={handlePrivadoChange} />
            </View>
            <Text style={styles.categoriaLabel}>Categoría</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
              {categories.map((cat, idx) => (
                <TouchableOpacity key={cat.id} onPress={() => handleSelectCategory(cat.id)}>
                  <View style={[
                    styles.chip,
                    { backgroundColor: cat.color, borderWidth: selectedCategoryId === cat.id ? 2 : 0, borderColor: '#642684' }
                  ]}>
                    <Text style={[styles.chipText, { color: cat.textColor }]}>{cat.name}</Text>
                    <TouchableOpacity style={styles.chipDelete} onPress={() => handleDeleteCategory(idx)}>
                      <Ionicons name="close-circle" size={16} color="#9F4B97" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.addCategoryRow}>
              <TextInput
                style={styles.addCategoryInput}
                value={newCategory}
                onChangeText={setNewCategory}
                placeholder="Agregar nueva categoría"
                placeholderTextColor="#642684"
              />
              <TouchableOpacity style={styles.addCategoryBtn} onPress={handleAddCategory}>
                <Ionicons name="add" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
            {categoryError ? (
              <Text style={styles.errorText}>{categoryError}</Text>
            ) : null}
            <TouchableOpacity style={styles.createBtn} onPress={handleCreateEvent}>
              <Text style={styles.createBtnText}>Crear evento</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(80, 60, 110, 0.18)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    width: width,
    height: height,
  },
  animatedCard: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: width,
    height: height * 0.87,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    width: width,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 11,
    alignItems: 'center',
    position: 'relative',
    marginBottom: 0,
  },
  closeBtn: {
    position: 'absolute',
    right: 14,
    top: 14,
    zIndex: 10,
    padding: 4
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 13,
    color: '#18193f'
  },
  imageBox: {
    width: '100%',
    height: 55,
    borderRadius: 11,
    backgroundColor: '#f5f5f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 13,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f5f5f8',
    borderRadius: 7,
    padding: 10,
    width: '100%',
    fontSize: 15,
    marginBottom: 10
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 9,
    width: '100%'
  },
  dateInput: {
    flex: 1
  },
  privadoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12
  },
  privadoLabel: {
    color: '#666',
    fontSize: 15,
    marginRight: 8,
    fontWeight: '500'
  },
  categoriaLabel: {
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    color: '#18193f',
    fontSize: 15,
    marginBottom: 7
  },
  chipRow: {
    flexDirection: 'row',
    marginBottom: 7,
    width: '100%',
    paddingVertical: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 7,
  },
  chipText: {
    fontSize: 15,
    fontWeight: '500',
    marginRight: 4,
  },
  chipDelete: {
    marginLeft: 2,
    padding: 1,
  },
  addCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 4,
    marginTop: 4,
  },
  addCategoryInput: {
    flex: 1,
    backgroundColor: '#f5f5f8',
    borderRadius: 7,
    padding: 9,
    fontSize: 14,
    marginRight: 7,
    borderWidth: 1,
    borderColor: '#e6e1f7',
    color: '#642684',
  },
  addCategoryBtn: {
    backgroundColor: '#642684',
    borderRadius: 7,
    padding: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#d72f5a',
    fontSize: 13,
    marginBottom: 4,
    marginTop: -2,
    alignSelf: 'flex-start',
  },
  createBtn: {
    backgroundColor: '#642684',
    borderRadius: 8,
    paddingVertical: 14,
    width: '100%',
    marginTop: 12
  },
  createBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  }
});