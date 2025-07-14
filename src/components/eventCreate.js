import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, Switch, Animated, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { height, width } = Dimensions.get('window');

export default function CreateEventModal({ visible, onClose }) {
  // Animation setup
  const translateY = useRef(new Animated.Value(height)).current;

  // Categories state
  const [categories, setCategories] = useState([
    { name: 'Deportes', color: '#f3e9f9', textColor: '#642684' },
    { name: 'Música', color: '#e3f7ef', textColor: '#3ec19f' },
    { name: 'Global', color: '#eaf4fb', textColor: '#3792e3' },
  ]);
  const [newCategory, setNewCategory] = useState('');
  const [categoryError, setCategoryError] = useState('');

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 420,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: height,
        duration: 320,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateY]);

  // Add new category
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
    setCategories([
      ...categories,
      {
        name: trimmedName,
        color: '#f5f5f8',
        textColor: '#642684',
      }
    ]);
    setNewCategory('');
    setCategoryError('');
  };

  // Delete category
  const handleDeleteCategory = (idx) => {
    setCategories(categories.filter((_, i) => i !== idx));
  };

  return (
    <Modal
      transparent
      animationType="none"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <Animated.View
          style={[
            styles.animatedCard,
            { transform: [{ translateY }] }
          ]}
        >
          <View style={styles.card}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={28} color="#642684" />
            </TouchableOpacity>
            <Text style={styles.header}>Crear evento</Text>
            <View style={styles.imageBox}>
              <Ionicons name="image-outline" size={40} color="#c7c9d8" />
            </View>
            <TextInput style={styles.input} placeholder="Nombre" />
            <TextInput style={styles.input} placeholder="Descripcion..." multiline />
            <View style={styles.row}>
              <TextInput style={[styles.input, styles.dateInput]} placeholder="Fecha" />
              <TouchableOpacity>
                <Ionicons name="calendar-outline" size={21} color="#642684" />
              </TouchableOpacity>
            </View>
            <View style={styles.row}>
              <View style={{flex: 1}}>
                <TextInput style={styles.input} placeholder="Comienzo" />
              </View>
              <TouchableOpacity>
                <Ionicons name="time-outline" size={21} color="#642684" />
              </TouchableOpacity>
              <View style={{flex: 1}}>
                <TextInput style={styles.input} placeholder="Fin" />
              </View>
              <TouchableOpacity>
                <Ionicons name="time-outline" size={21} color="#642684" />
              </TouchableOpacity>
            </View>
            <View style={styles.privadoRow}>
              <Text style={styles.privadoLabel}>Privado</Text>
              <Switch />
            </View>
            <Text style={styles.categoriaLabel}>Categoría</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
              {categories.map((cat, idx) => (
                <View key={cat.name + idx} style={[styles.chip, { backgroundColor: cat.color }]}>
                  <Text style={[styles.chipText, { color: cat.textColor }]}>{cat.name}</Text>
                  <TouchableOpacity style={styles.chipDelete} onPress={() => handleDeleteCategory(idx)}>
                    <Ionicons name="close-circle" size={16} color="#9F4B97" />
                  </TouchableOpacity>
                </View>
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
            <TouchableOpacity style={styles.createBtn}>
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
    shadowColor: "#000",
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