import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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
import ApiService from '../services/api';
import { useNavigation } from '@react-navigation/native';
import { 
  FormField, 
  DatePickerField, 
  FormRow, 
  FormModal,
  ScreenHeader 
} from '../components';

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
    <FormModal
      visible={localVisible}
      onClose={handleCloseModal}
      title="Crear Cupón"
      translateY={translateY}
      onSubmit={handleCreateCoupon}
      submitText="Crear cupón"
      isLoading={isLoading}
    >
      {/* Form Fields */}
      <FormField
        placeholder="Nombre del cupón"
        value={nombre}
        onChangeText={setNombre}
        maxLength={50}
      />
      
      <FormField
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline={true}
        maxLength={200}
      />

      <FormRow>
        <FormField
          placeholder="Descuento (%)"
          value={descuento}
          onChangeText={handleNumericChange(setDescuento)}
          keyboardType="numeric"
          maxLength={3}
          style={styles.halfInput}
        />
        
        <FormField
          placeholder="Código"
          value={codigo}
          onChangeText={(value) => setCodigo(value.toUpperCase())}
          maxLength={20}
          style={styles.halfInput}
        />
      </FormRow>

      {/* Date Picker */}
      <DatePickerField
        value={fechaExpiracion}
        onPress={() => {
          if (!fechaExpiracionDate) {
            const nextMonth = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            setFechaExpiracionDate(nextMonth);
          }
          setShowFechaPicker(true);
        }}
        placeholder="Fecha de expiración"
        showPicker={showFechaPicker}
        onDateChange={handleFechaChange}
        dateValue={fechaExpiracionDate}
      />

      <FormRow>
        <FormField
          placeholder="Compra mínima ($)"
          value={minCompra}
          onChangeText={handleNumericChange(setMinCompra)}
          keyboardType="numeric"
          style={styles.halfInput}
        />
        
        <FormField
          placeholder="Usos máximos"
          value={maxUsos}
          onChangeText={handleNumericChange(setMaxUsos)}
          keyboardType="numeric"
          style={styles.halfInput}
        />
      </FormRow>

      <FormField
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
    </FormModal>
  );
};

const CouponCreate = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.screenContainer}>
      <ScreenHeader 
        title="Crear Cupón"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      
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
  
  // Form styles
  halfInput: {
    flex: 1,
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
});

export default CouponCreate;
