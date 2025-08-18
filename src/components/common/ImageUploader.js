import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const ImageUploader = ({ imageUri, onImageSelected, error }) => {
  const handlePickImage = async () => {
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
        Alert.alert('Permiso denegado', 'Necesitamos permisos para acceder a tu galería.');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.7,
      });

      handleImageResult(result);
    } catch (error) {
      console.error('Gallery picker error:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen de la galería.');
    }
  };

  const pickFromCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos permisos para acceder a tu cámara.');
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.7,
      });

      handleImageResult(result);
    } catch (error) {
      console.error('Camera picker error:', error);
      Alert.alert('Error', 'No se pudo tomar la foto.');
    }
  };

  const handleImageResult = (result) => {
    if (result.canceled) return;

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      if (!asset.uri) return;

      // Create a file object from the image URI
      const uriParts = asset.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      const file = {
        uri: asset.uri,
        name: `photo-${Date.now()}.${fileType}`,
        type: `image/${fileType}`,
      };

      onImageSelected(asset.uri, file);
    }
  };

  return (
    <TouchableOpacity onPress={handlePickImage} style={styles.container}>
      {imageUri ? (
        <View style={styles.imagePreview}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <TouchableOpacity 
            style={styles.changeButton}
            onPress={handlePickImage}
          >
            <Text style={styles.changeText}>Cambiar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="image-outline" size={36} color="#642684" />
          <Text style={styles.text}>Toca para subir una imagen</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderStyle: 'dashed',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  text: {
    marginTop: 10,
    color: '#642684',
    fontSize: 14,
  },
  error: {
    marginTop: 5,
    color: 'red',
    fontSize: 12,
  },
  imagePreview: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  changeButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ImageUploader;