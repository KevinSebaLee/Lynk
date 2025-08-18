import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ImageBackground,
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
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import ApiService from '../services/api';

const { width, height } = Dimensions.get('window');

// Helper function for unique IDs
let categoryIdCounter = 1;

const EventCard = ({ visible, onClose, eventName, eventFullDate, venue, priceRange, eventTime }) => {
  const [localVisible, setLocalVisible] = useState(visible);
  const [isAnimating, setIsAnimating] = useState(false);
  const isClosing = useRef(false);
  const translateY = useRef(new Animated.Value(height)).current;

  const [categories, setCategories] = useState([
    { id: categoryIdCounter++, name: 'Deportes', color: '#f3e9f9', textColor: '#642684' },
    { id: categoryIdCounter++, name: 'Música', color: '#e3f7ef', textColor: '#3ec19f' },
    { id: categoryIdCounter++, name: 'Global', color: '#eaf4fb', textColor: '#3792e3' },
  ]);

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
  const [visibilidad, setVisiblidad] = useState(false);
  const [ubicacion, setUbicacion] = useState('');
  const [presupuesto, setPresupuesto] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [color, setColor] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id);
  const [newCategory, setNewCategory] = useState('');
  const [categoryError, setCategoryError] = useState('');

  const [imageUri, setImageUri] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Process date information
  const dateObj = eventFullDate ? new Date(eventFullDate) : new Date();
  const day = dateObj.getDate();
  const monthShort = new Intl.DateTimeFormat('en-AR', { month: 'short' })
    .format(dateObj)
    .charAt(0)
    .toUpperCase() + 
    new Intl.DateTimeFormat('en-AR', { month: 'short' })
    .format(dateObj)
    .slice(1);

  const shortDate = dateObj.toLocaleDateString('es-AR');

  // Update local visibility when prop changes
  useEffect(() => {
    setLocalVisible(visible);
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

  // Animation effect
  useEffect(() => {
    if (localVisible) {
      // Open animation
      setIsAnimating(true);
      translateY.setValue(height);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 420,
        useNativeDriver: true,
      }).start(() => {
        setIsAnimating(false);
      });
    } else {
      // Close animation
      setIsAnimating(true);
      Animated.timing(translateY, {
        toValue: height,
        duration: 320,
        useNativeDriver: true,
      }).start(() => {
        setIsAnimating(false);
      });
    }
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
    setCategoryError('');
    setSelectedCategoryId(categories[0]?.id);
    setNewCategory('');
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

  const handlePrivadoChange = value => {
    setVisiblidad(!value);
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
        
        const uriParts = asset.uri.split('/');
        const fileName = asset.fileName || uriParts[uriParts.length - 1] || `photo-${Date.now()}.jpg`;
        const fileType = asset.type || (fileName.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg');
        
        setImageFile({
          uri: Platform.OS === 'android' ? asset.uri : asset.uri.replace('file://', ''),
          name: fileName,
          type: fileType
        });
      } else if (result.uri && typeof result.uri === 'string') {
        setImageUri(result.uri);
        
        const uriParts = result.uri.split('/');
        const fileName = uriParts[uriParts.length - 1] || `photo-${Date.now()}.jpg`;
        const fileType = fileName.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
        
        setImageFile({
          uri: Platform.OS === 'android' ? result.uri : result.uri.replace('file://', ''),
          name: fileName,
          type: fileType
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
    if (!nombre || !descripcion || !fecha || !horaInicio || !horaFin || !ubicacion) {
      setCategoryError('Por favor completa todos los campos requeridos.');
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
      formData.append('color', color || 'default');
      formData.append('id_categoria', JSON.stringify([selectedCategoryId]));

      if (imageFile && typeof imageFile.uri === 'string') {
        formData.append('imagen', imageFile);
      }

      const response = await ApiService.createEvento(formData);

      if (response && response.message) {
        handleCloseModal();
        Alert.alert('Éxito', 'Evento creado correctamente');
      } else {
        setCategoryError(response?.error || 'Error creando evento');
      }
    } catch (error) {
      console.error('Error creando evento:', error);
      setCategoryError('Error creando evento');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: imageUri || 'default-image-url' }}
        style={[styles.image, styles.imageRadius]}
      >
        <View style={styles.dateBox}>
          <Text style={styles.dateDay}>{day}</Text>
          <Text style={styles.dateMonth}>{monthShort}</Text>
        </View>
        <View style={styles.detailsOverlay}>
          <Text style={styles.eventName}>{eventName}</Text>
          <Text style={styles.eventInfo}>{venue}</Text>
          <Text style={styles.eventInfo}>{eventTime}</Text>
          {priceRange && <Text style={styles.price}>{priceRange}</Text>}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#f5f5f8',
    marginLeft: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  imageRadius: {
    borderRadius: 16,
  },
  dateBox: {
    position: 'absolute',
    top: 18,
    right: 14,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignItems: 'center',
    width: 62,
    zIndex: 2,
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 6,
    elevation: 2,
  },
  dateDay: {
    fontSize: 22,
    color: '#222',
    fontWeight: 'bold',
    lineHeight: 22,
  },
  dateMonth: {
    fontSize: 14,
    color: '#222',
    fontWeight: '600',
    marginTop: -2,
  },
  detailsOverlay: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.55)',
    height: '40%',
    padding: 18,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  eventName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventInfo: {
    color: '#f5f5f5',
    fontSize: 13,
    marginBottom: 2,
  },
  price: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 8,
  },
  // Modal styles
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
    height: 55,
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
    alignItems: 'center',
  },
  imageSelectedText: {
    color: '#642684',
    marginTop: 4,
    fontSize: 13,
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
  categoriaLabel: {
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    color: '#18193f',
    fontSize: 15,
    marginBottom: 7,
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
    marginTop: 12,
  },
  createBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default EventCard;