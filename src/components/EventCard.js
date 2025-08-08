import React from 'react';
import { View, Text, ImageBackground, StyleSheet, ScrollView } from 'react-native';


const EventCard = ({ imageUri, eventName, eventFullDate, venue, priceRange, eventTime }) => {
  const dateParts = typeof eventFullDate === 'string' ? eventFullDate.split(' ') : ['--', '--'];


  const dateObj = new Date(eventFullDate);
  const day = dateObj.getDate();
  const dayString = day.toString() // Ensures two digits, e.g., "06"
  let monthShort = dateObj.toLocaleString('en-AR', { month: 'short' }); // "Apr"
  monthShort = monthShort.charAt(0).toUpperCase() + monthShort.slice(1);


  const shortDate = dateObj.toLocaleDateString('es-AR'); // e.g., "06/04/2025"

  const [visibilidad, setVisiblidad] = useState(false);
  const [ubicacion, setUbicacion] = useState('');
  const [presupuesto, setPresupuesto] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [color, setColor] = useState(null);

  const [imageUri, setImageUri] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      
      // Try to call onClose if it exists
      try {
        if (typeof onClose === 'function') {
          onClose();
        } else {
          console.warn('CreateEventModal: onClose is not a function');
        }
      } catch (e) {
        console.error('Error calling onClose:', e);
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

  // Enhanced image picker with camera option
  const handlePickImage = async () => {
    setUploadError('');
    
    // Show picker options
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

  // Pick image from gallery
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

  // Pick image from camera
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

  // Handle result from either gallery or camera
  const handleImagePickerResult = (result) => {
    try {
      if (result.canceled) {
        return;
      }

      // Reset any previous image state
      setImageUri(null);
      setImageFile(null);

      // Handle new API format (assets array)
      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        if (typeof asset.uri !== 'string' || !asset.uri) {
          throw new Error('URI inválido de imagen');
        }

        console.log('Image selected:', asset.uri);
        setImageUri(asset.uri);
        
        // Get filename from URI or generate one
        const uriParts = asset.uri.split('/');
        const fileName = asset.fileName || uriParts[uriParts.length - 1] || `photo-${Date.now()}.jpg`;
        
        // Get file type or default to jpg
        const fileType = asset.type || (fileName.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg');
        
        // Create formatted file object for upload
        setImageFile({
          uri: Platform.OS === 'android' ? asset.uri : asset.uri.replace('file://', ''),
          name: fileName,
          type: fileType
        });
      }
      // Handle old API format (single uri)
      else if (result.uri && typeof result.uri === 'string') {
        console.log('Image selected (legacy):', result.uri);
        setImageUri(result.uri);
        
        // Get filename from URI or generate one
        const uriParts = result.uri.split('/');
        const fileName = uriParts[uriParts.length - 1] || `photo-${Date.now()}.jpg`;
        
        // Determine file type based on extension
        const fileType = fileName.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
        
        // Create formatted file object for upload
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

      // Properly format the image for upload
      if (imageFile && typeof imageFile.uri === 'string') {
        formData.append('imagen', {
          uri: imageFile.uri,
          name: imageFile.name,
          type: imageFile.type
        });
        console.log('Adding image to form:', {
          uri: imageFile.uri.substring(0, 50) + '...',
          name: imageFile.name,
          type: imageFile.type
        });
      }

      console.log('Sending data to API...');
      const response = await ApiService.createEvento(formData);

      if (response && response.message) {
        handleCloseModal();
        Alert.alert('Éxito', 'Evento creado correctamente');
      } else {
        setCategoryError(response?.error || 'Error creando evento');
      }
    } catch (error) {
      setCategoryError('Error creando evento');
      console.error('Error creando evento:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal 
      transparent 
      animationType="none" 
      visible={localVisible || isAnimating || isClosing.current}
      onRequestClose={handleCloseModal}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={handleCloseModal} 
        />
        <Animated.View style={[styles.animatedCard, { transform: [{ translateY }] }]}>
          <View style={styles.card}>
            <TouchableOpacity style={styles.closeBtn} onPress={handleCloseModal}>
              <Ionicons name="close" size={28} color="#642684" />
            </TouchableOpacity>
            <Text style={styles.header}>Crear evento</Text>
            <ScrollView 
              style={styles.scrollContainer} 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}
            >
              <TouchableOpacity style={styles.imageBox} onPress={handlePickImage}>
                {imageUri ? (
                  <View style={styles.imageSelected}>
                    <Ionicons name="checkmark-circle" size={36} color="#642684" />
                    <Text style={styles.imageSelectedText}>Imagen seleccionada</Text>
                  </View>
                ) : (
                  <Ionicons name="image-outline" size={40} color="#c7c9d8" />
                )}
                <Text style={styles.imageText}>Seleccionar imagen</Text>
              </TouchableOpacity>
              {uploadError ? <Text style={styles.errorText}>{uploadError}</Text> : null}
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
                <View style={{ flex: 1 }}>
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
                <View style={{ flex: 1 }}>
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
              <TouchableOpacity style={styles.createBtn} onPress={handleCreateEvent} disabled={isLoading}>
                <Text style={styles.createBtnText}>{isLoading ? 'Creando...' : 'Crear evento'}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
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
    maxHeight: height * 0.87,
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
});


export default EventCard;