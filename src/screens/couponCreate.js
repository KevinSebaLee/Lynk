import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  BackHandler,
  Platform,
  Animated,
  Dimensions,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import ApiService from '../services/api';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const CouponCreateModal = ({ visible, onClose }) => {
  const navigation = useNavigation();
  
  // Animation and visibility state
  const [localVisible, setLocalVisible] = useState(visible);
  const [isAnimating, setIsAnimating] = useState(false);
  const isClosing = useRef(false);
  const translateY = useRef(new Animated.Value(height)).current;

  // Form state
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [descuento, setDescuento] = useState('');
  const [codigo, setCodigo] = useState('');
  const [fechaExpiracion, setFechaExpiracion] = useState('');
  const [fechaExpiracionDate, setFechaExpiracionDate] = useState(null);
  const [showFechaPicker, setShowFechaPicker] = useState(false);
  const [minCompra, setMinCompra] = useState('');
  const [categoria, setCategoria] = useState('');
  const [maxUsos, setMaxUsos] = useState('');
  const [esActivo, setEsActivo] = useState(true);
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Update local visibility when prop changes
  React.useEffect(() => {
    if (visible !== localVisible) {
      setLocalVisible(visible);
    }
  }, [visible]);

  // Handle back button press
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (localVisible && !isClosing.current) {
          handleCloseModal();
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [localVisible]);

  // Initialize form when modal opens
  React.useEffect(() => {
    if (localVisible) {
      // Only initialize default values if they're empty
      if (!fechaExpiracion) {
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        setFechaExpiracion(nextMonth.toISOString().split('T')[0]);
        setFechaExpiracionDate(nextMonth);
      }
      
      if (!codigo) {
        // Generate a default coupon code
        const randomCode = 'COUPON' + Math.random().toString(36).substr(2, 6).toUpperCase();
        setCodigo(randomCode);
      }
      
      setFormError('');
    }
  }, [localVisible]);

  // Animation logic
  React.useEffect(() => {
    translateY.setValue(height);
  }, []);

  React.useEffect(() => {
    if (!localVisible && !isAnimating) {
      return;
    }
    
    let animationTimer;

    if (localVisible) {
      setIsAnimating(true);
      animationTimer = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: 0,
          duration: 420,
          useNativeDriver: true,
        }).start(() => {
          setIsAnimating(false);
        });
      });
    } else if (isAnimating) {
      animationTimer = requestAnimationFrame(() => {
        Animated.timing(translateY, {
          toValue: height,
          duration: 320,
          useNativeDriver: true,
        }).start(() => {
          setIsAnimating(false);
          if (onClose && isClosing.current) {
            isClosing.current = false;
            onClose();
          }
        });
      });
    }

    return () => {
      if (animationTimer) cancelAnimationFrame(animationTimer);
    };
  }, [localVisible, isAnimating, onClose]);

  // Reset form completely
  const resetForm = () => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    setNombre('');
    setDescripcion('');
    setDescuento('');
    setCodigo('COUPON' + Math.random().toString(36).substr(2, 6).toUpperCase());
    setFechaExpiracion(nextMonth.toISOString().split('T')[0]);
    setFechaExpiracionDate(nextMonth);
    setMinCompra('');
    setCategoria('');
    setMaxUsos('');
    setEsActivo(true);
    setFormError('');
  };

  // Close modal with animation
  const handleCloseModal = () => {
    if (isClosing.current || isAnimating) return;
    
    isClosing.current = true;
    setLocalVisible(false);
    
    Animated.timing(translateY, {
      toValue: height,
      duration: 320,
      useNativeDriver: true,
    }).start(() => {
      isClosing.current = false;
      if (typeof onClose === 'function') {
        onClose();
      }
    });
  };

  const handleFechaChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowFechaPicker(false);
    }
    
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      setFechaExpiracionDate(newDate);
      const dateString = newDate.toISOString().split('T')[0];
      setFechaExpiracion(dateString);
    }
  };

  const handleNumericChange = setter => value => {
    const filtered = value.replace(/[^0-9]/g, '');
    setter(filtered);
  };

  const handleCreateCoupon = async () => {
    // Form validation
    if (!nombre || !descripcion || !descuento || !codigo || !fechaExpiracion) {
      setFormError('Por favor completa todos los campos requeridos.');
      return;
    }

    if (parseInt(descuento) <= 0 || parseInt(descuento) > 100) {
      setFormError('El descuento debe ser entre 1 y 100.');
      return;
    }

    try {
      setIsLoading(true);

      const couponData = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        descuento: parseInt(descuento),
        codigo: codigo.toUpperCase().trim(),
        fecha_expiracion: fechaExpiracionDate.toISOString(),
        min_compra: minCompra ? parseInt(minCompra) : 0,
        categoria: categoria.trim() || 'General',
        max_usos: maxUsos ? parseInt(maxUsos) : null,
        estado: esActivo ? 'activo' : 'inactivo'
      };
      
      console.log('Submitting coupon data:', couponData);
      const response = await ApiService.createCoupon(couponData);
      
      if (response && (response.message || response.id)) {
        resetForm();
        handleCloseModal();
        Alert.alert('¡Éxito!', 'Cupón creado correctamente');
      } else if (response && response.error) {
        setFormError(response.error);
      } else {
        setFormError('Error desconocido al crear el cupón');
      }
    } catch (error) {
      console.error('Error creando cupón:', error);
      setFormError(`Error creando cupón: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      transparent={true}
      visible={localVisible}
      onRequestClose={handleCloseModal}
      animationType="none"
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.animatedCard,
            { transform: [{ translateY: translateY }] }
          ]}
        >
          <TouchableOpacity style={styles.closeBtn} onPress={handleCloseModal}>
            <Ionicons name="close" size={24} color="#222" />
          </TouchableOpacity>
          <View style={styles.card}>
            <Text style={styles.header}>Crear Cupón</Text>
            <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
              
              {/* Form Fields */}
              <TextInput
                style={styles.input}
                placeholder="Nombre del cupón"
                value={nombre}
                onChangeText={setNombre}
                maxLength={50}
              />
              
              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Descripción"
                value={descripcion}
                onChangeText={setDescripcion}
                multiline
                maxLength={200}
              />

              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Descuento (%)"
                  value={descuento}
                  onChangeText={handleNumericChange(setDescuento)}
                  keyboardType="numeric"
                  maxLength={3}
                />
                
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Código"
                  value={codigo}
                  onChangeText={(value) => setCodigo(value.toUpperCase())}
                  maxLength={20}
                />
              </View>

              {/* Date Picker */}
              <View style={styles.row}>
                <TouchableOpacity
                  style={[styles.input, styles.dateInput]}
                  onPress={() => {
                    if (!fechaExpiracionDate) {
                      const nextMonth = new Date();
                      nextMonth.setMonth(nextMonth.getMonth() + 1);
                      setFechaExpiracionDate(nextMonth);
                    }
                    setShowFechaPicker(true);
                  }}
                >
                  <Text style={{ color: fechaExpiracion ? '#000' : '#999' }}>
                    {fechaExpiracion ? fechaExpiracion : 'Fecha de expiración'}
                  </Text>
                  <Ionicons 
                    name="calendar-outline" 
                    size={16} 
                    color="#642684" 
                    style={styles.dateIcon} 
                  />
                </TouchableOpacity>
                {showFechaPicker && (
                  <DateTimePicker
                    value={fechaExpiracionDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={handleFechaChange}
                    minimumDate={new Date()}
                  />
                )}
              </View>

              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Compra mínima ($)"
                  value={minCompra}
                  onChangeText={handleNumericChange(setMinCompra)}
                  keyboardType="numeric"
                />
                
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Usos máximos"
                  value={maxUsos}
                  onChangeText={handleNumericChange(setMaxUsos)}
                  keyboardType="numeric"
                />
              </View>

              <TextInput
                style={styles.input}
                placeholder="Categoría (ej: Eventos, Restaurantes)"
                value={categoria}
                onChangeText={setCategoria}
                maxLength={30}
              />

              {/* Active Switch */}
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Cupón activo</Text>
                <Switch
                  value={esActivo}
                  onValueChange={setEsActivo}
                  thumbColor={esActivo ? '#642684' : '#f4f3f4'}
                  trackColor={{ false: '#e6e1f7', true: '#c9b3f5' }}
                />
              </View>

              {/* Error display */}
              {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

              {/* Create Button */}
              {isLoading ? (
                <ActivityIndicator size="large" color="#642684" style={{ marginTop: 20 }} />
              ) : (
                <TouchableOpacity style={styles.createBtn} onPress={handleCreateCoupon}>
                  <Text style={styles.createBtnText}>Crear cupón</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const CouponCreate = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#151C2A" />
        </TouchableOpacity>
        <Text style={styles.screenHeaderText}>Crear Cupón</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.screenContent}>
        <TouchableOpacity 
          style={styles.openModalBtn}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.openModalBtnText}>Crear Nuevo Cupón</Text>
        </TouchableOpacity>
      </View>

      <CouponCreateModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Screen styles
  screenContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  screenHeaderText: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#151C2A',
  },
  screenContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openModalBtn: {
    backgroundColor: '#642684',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  openModalBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Modal styles (following eventCreate pattern)
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(80, 60, 110, 0.18)',
    justifyContent: 'flex-end',
  },
  animatedCard: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: width,
    maxHeight: height * 0.87,
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  card: {
    padding: 22,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    right: 14,
    top: 14,
    zIndex: 10,
    padding: 4,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 13,
    color: '#18193f',
  },
  scrollContainer: {
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  input: {
    backgroundColor: '#f5f5f8',
    borderRadius: 7,
    padding: 10,
    width: '100%',
    fontSize: 15,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 9,
    width: '100%',
  },
  halfInput: {
    flex: 1,
  },
  dateInput: {
    flex: 1,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateIcon: {
    position: 'absolute',
    right: 10,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  switchLabel: {
    color: '#666',
    fontSize: 15,
    fontWeight: '500',
  },
  errorText: {
    color: '#d72f5a',
    fontSize: 13,
    marginBottom: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  createBtn: {
    backgroundColor: '#642684',
    borderRadius: 8,
    paddingVertical: 14,
    width: '100%',
    marginTop: 12,
  },
  createBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CouponCreate;
