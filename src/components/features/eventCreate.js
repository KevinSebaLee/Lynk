import React, { useState, useEffect, useRef } from 'react';
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
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import ApiService from '../../services/api';
import { Button } from '../../components/common/Button';

const { width, height } = Dimensions.get('window');

const EventCreateModal = ({ visible, onClose }) => {
  // Use state variable for visibility to avoid animation issues
  const [localVisible, setLocalVisible] = useState(visible);
  const [isAnimating, setIsAnimating] = useState(false);
  const isClosing = useRef(false);
  const translateY = useRef(new Animated.Value(height)).current;

  // Form state
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
  const [formError, setFormError] = useState('');

  const [imageUri, setImageUri] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Update local visibility when prop changes
  useEffect(() => {
    if (visible !== localVisible) {
      setLocalVisible(visible);
    }
  }, [visible]);

  // Handle back button press
  useEffect(() => {
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

  // Reset form when modal is opened
  useEffect(() => {
    if (localVisible) {
      resetForm();
    }
  }, [localVisible]);

  // Animation effect - Run separately to avoid the useInsertionEffect warning
  useEffect(() => {
    let animationTimer;

    if (localVisible) {
      // Prepare animation
      translateY.setValue(height);
      setIsAnimating(true);
      
      // Delay animation slightly to prevent React scheduling issues
      animationTimer = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: 0,
          duration: 420,
          useNativeDriver: true,
        }).start(() => {
          setIsAnimating(false);
        });
      }, 10);
    } else if (isAnimating) {
      // Animation for closing
      animationTimer = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: height,
          duration: 320,
          useNativeDriver: true,
        }).start(() => {
          setIsAnimating(false);
        });
      }, 10);
    }

    return () => {
      if (animationTimer) clearTimeout(animationTimer);
    };
  }, [localVisible]);

  // Reset the form
  const resetForm = () => {
    setNombre('');
    setDescripcion('');
    setFecha('');
    setFechaDate(null);
    setHoraInicio('');
    setHoraInicioDate(null);
    setHoraFin('');
    setHoraFinDate(null);
    setUbicacion('');
    setPresupuesto('');
    setObjetivo('');
    setVisiblidad(false);
    setImageUri(null);
    setImageFile(null);
    setUploadError('');
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

  const handlePublicoChange = value => {
    setVisiblidad(value);
    if (value) {
      setPresupuesto('');
      setObjetivo('');
    }
  };

  // Image picker functions
  const handlePickImage = async () => {
    setUploadError('');
    Alert.alert(
      'Seleccionar imagen',
      '¿Cómo quieres seleccionar la imagen?',
      [
        {
          text: 'Galería',
          onPress: pickFromGallery
        },
        {
          text: 'Cámara',
          onPress: pickFromCamera
        },
        {
          text: 'Cancelar',
          style: 'cancel'
        }
      ]
    );
  };

  const pickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setUploadError('Permiso denegado para acceder a la galería.');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.7,
      });

      handleImagePickerResult(result);
    } catch (error) {
      console.error('Gallery picker error:', error);
      setUploadError('Error seleccionando imagen de la galería.');
    }
  };

  const pickFromCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        setUploadError('Permiso denegado para acceder a la cámara.');
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.7,
      });

      handleImagePickerResult(result);
    } catch (error) {
      console.error('Camera picker error:', error);
      setUploadError('Error al tomar la foto.');
    }
  };

  const handleImagePickerResult = (result) => {
    try {
      if (result.canceled) {
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        if (typeof asset.uri !== 'string' || !asset.uri) {
          throw new Error('URI inválido de imagen');
        }

        setImageUri(asset.uri);
        
        // Get file extension from URI
        const uriParts = asset.uri.split('.');
        const fileExtension = uriParts[uriParts.length - 1];
        
        // Create correct mimetype based on file extension
        let mimeType;
        if (fileExtension.toLowerCase() === 'jpg' || fileExtension.toLowerCase() === 'jpeg') {
          mimeType = 'image/jpeg';
        } else if (fileExtension.toLowerCase() === 'png') {
          mimeType = 'image/png';
        } else {
          mimeType = 'image/jpeg'; // Default to JPEG if unknown
        }
        
        // Create file object with proper type
        setImageFile({
          uri: Platform.OS === 'android' ? asset.uri : asset.uri.replace('file://', ''),
          name: `photo-${Date.now()}.${fileExtension}`,
          type: mimeType
        });
      } else if (result.uri && typeof result.uri === 'string') {
        setImageUri(result.uri);
        
        // Get file extension from URI
        const uriParts = result.uri.split('.');
        const fileExtension = uriParts[uriParts.length - 1];
        
        // Create correct mimetype based on file extension
        let mimeType;
        if (fileExtension.toLowerCase() === 'jpg' || fileExtension.toLowerCase() === 'jpeg') {
          mimeType = 'image/jpeg';
        } else if (fileExtension.toLowerCase() === 'png') {
          mimeType = 'image/png';
        } else {
          mimeType = 'image/jpeg'; // Default to JPEG if unknown
        }
        
        setImageFile({
          uri: Platform.OS === 'android' ? result.uri : result.uri.replace('file://', ''),
          name: `photo-${Date.now()}.${fileExtension}`,
          type: mimeType
        });
      } else {
        throw new Error('No se seleccionó ninguna imagen válida');
      }
    } catch (error) {
      console.error('Image selection error:', error);
      setUploadError(`Error seleccionando imagen: ${error.message}`);
    }
  };

  const handleCreateEvent = async () => {
    // Form validation
    if (!nombre || !descripcion || !fecha || !horaInicio || !horaFin || !ubicacion) {
      setFormError('Por favor completa todos los campos requeridos.');
      return;
    }
    
    if (!imageFile) {
      setFormError('Por favor selecciona una imagen para el evento.');
      return;
    }
    
    try {
      setIsLoading(true);
  
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('descripcion', descripcion);
      formData.append('fecha', fecha);
      formData.append('horaInicio', horaInicio);
      formData.append('horaFin', horaFin);
      formData.append('visibilidad', visibilidad ? '1' : '0');
      formData.append('ubicacion', ubicacion);
      formData.append('presupuesto', visibilidad ? '0' : (presupuesto || '0'));
      formData.append('objetivo', visibilidad ? '0' : (objetivo || '0'));
      formData.append('color', '#642684'); // Default color
      
      // Default category (1 = Deportes)
      formData.append('id_categoria', JSON.stringify([1]));
      
      // Add image with proper type
      if (imageFile) {
        console.log('Adding image to FormData:', {
          uri: imageFile.uri,
          name: imageFile.name,
          type: imageFile.type
        });
        
        // Ensure the image has the proper structure
        formData.append('imagen', {
          uri: imageFile.uri,
          name: imageFile.name,
          type: imageFile.type
        });
      }
      
      console.log('Submitting form data...');
      const response = await ApiService.createEvento(formData);
      
      // Check for special server interception response
      if (response && response.interceptedResponse) {
        setFormError('Error: Servidor no disponible. Por favor intenta más tarde.');
        console.error('Server response intercepted');
        return;
      }
      
      if (response && (response.message || response.eventId)) {
        handleCloseModal();
        Alert.alert('Éxito', 'Evento creado correctamente');
      } else if (response && response.error) {
        setFormError(response.error);
      } else {
        setFormError('Error desconocido al crear el evento');
      }
    } catch (error) {
      console.error('Error creando evento:', error);
      setFormError(`Error creando evento: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      visible={localVisible}
      onRequestClose={handleCloseModal}
      animationType="none"
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
            <Text style={styles.header}>Crear Evento</Text>
            <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
              {/* Image Picker */}
              <TouchableOpacity style={styles.imageBox} onPress={handlePickImage}>
                {imageUri ? (
                  <View style={styles.imageSelected}>
                    <Image source={{ uri: imageUri }} style={{ width: '100%', height: 180, borderRadius: 8 }} />
                    <Text style={styles.imageSelectedText}>Cambiar imagen</Text>
                    {uploadError ? <Text style={styles.errorText}>{uploadError}</Text> : null}
                  </View>
                ) : (
                  <>
                    <Ionicons name="image-outline" size={28} color="#642684" />
                    <Text style={styles.imageText}>Seleccionar imagen para el evento</Text>
                    {uploadError ? <Text style={styles.errorText}>{uploadError}</Text> : null}
                  </>
                )}
              </TouchableOpacity>

              {/* Form Fields */}
              <TextInput
                style={styles.input}
                placeholder="Nombre del evento"
                value={nombre}
                onChangeText={setNombre}
              />
              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Descripción"
                value={descripcion}
                onChangeText={setDescripcion}
                multiline
              />

              {/* Date and Time Pickers */}
              <View style={styles.row}>
                <TouchableOpacity
                  style={[styles.input, styles.dateInput]}
                  onPress={() => setShowFechaPicker(true)}
                >
                  <Text style={{ color: fecha ? '#000' : '#999' }}>
                    {fecha ? fecha : 'Fecha'}
                  </Text>
                </TouchableOpacity>
                {showFechaPicker && (
                  <DateTimePicker
                    value={fechaDate || new Date()}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={handleFechaChange}
                  />
                )}
              </View>

              <View style={styles.row}>
                <TouchableOpacity
                  style={[styles.input, styles.dateInput]}
                  onPress={() => setShowHoraInicioPicker(true)}
                >
                  <Text style={{ color: horaInicio ? '#000' : '#999' }}>
                    {horaInicio ? horaInicio : 'Hora inicio'}
                  </Text>
                </TouchableOpacity>
                {showHoraInicioPicker && (
                  <DateTimePicker
                    value={horaInicioDate || new Date()}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleHoraInicioChange}
                  />
                )}

                <TouchableOpacity
                  style={[styles.input, styles.dateInput]}
                  onPress={() => setShowHoraFinPicker(true)}
                >
                  <Text style={{ color: horaFin ? '#000' : '#999' }}>
                    {horaFin ? horaFin : 'Hora fin'}
                  </Text>
                </TouchableOpacity>
                {showHoraFinPicker && (
                  <DateTimePicker
                    value={horaFinDate || new Date()}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleHoraFinChange}
                  />
                )}
              </View>

              <TextInput
                style={styles.input}
                placeholder="Ubicación"
                value={ubicacion}
                onChangeText={setUbicacion}
              />

              {/* Privado Switch */}
              <View style={styles.privadoRow}>
                <Text style={styles.privadoLabel}>Evento publico</Text>
                <Switch
                  value={!visibilidad}
                  onValueChange={handlePublicoChange}
                  thumbColor={!visibilidad ? '#642684' : '#f4f3f4'}
                  trackColor={{ false: '#e6e1f7', true: '#c9b3f5' }}
                />
              </View>

              {/* Presupuesto and Objetivo (only shown for public events) */}
              {!visibilidad && (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Presupuesto"
                    value={presupuesto}
                    onChangeText={handleNumericChange(setPresupuesto)}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Objetivo"
                    value={objetivo}
                    onChangeText={handleNumericChange(setObjetivo)}
                    keyboardType="numeric"
                  />
                </>
              )}

              {/* Error display */}
              {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

              {/* Create Button */}
              {isLoading ? (
                <ActivityIndicator size="large" color="#642684" style={{ marginTop: 20 }} />
              ) : (
                <TouchableOpacity style={styles.createBtn} onPress={handleCreateEvent}>
                  <Text style={styles.createBtnText}>Crear evento</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  imageBox: {
    width: '100%',
    height: 200,
    borderRadius: 11,
    backgroundColor: '#f5f5f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 13,
    marginTop: 12,
  },
  imageText: {
    marginTop: 4,
    color: '#642684',
    fontSize: 13,
  },
  imageSelected: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageSelectedText: {
    color: '#642684',
    marginTop: 4,
    fontSize: 13,
    position: 'absolute',
    bottom: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 4,
    borderRadius: 4,
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
  dateInput: {
    flex: 1,
  },
  privadoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  privadoLabel: {
    color: '#666',
    fontSize: 15,
    marginRight: 8,
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

export default EventCreateModal;