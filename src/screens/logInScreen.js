import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ImageBackground, TouchableOpacity, Platform, StyleSheet, Text, TextInput, View, Image, KeyboardAvoidingView, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { storeToken } from '../utils/Token.js';
import { API } from '@env';

// Use your permanent ngrok URL for the API base
const API_URL = "https://stirring-intense-sheep.ngrok-free.app";


export default function logInScreen() {
  const [mail, setMail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [loading, setLoading] = useState(false);
  const loginPic = require('../../assets/img/login.png');
  const bgLogin = require('../../assets/img/bgLogin.png');
  const arrow = { uri: 'https://cdn-icons-png.flaticon.com/512/154/154630.png' };
  const navigation = useNavigation();


  const handleLogin = async () => {
    if (!mail || !contraseña) {
      Alert.alert('Por favor ingresa tu email y contraseña.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: mail,
        contraseña: contraseña,
      }, { timeout: 5000 });
      setLoading(false);
      await storeToken(response.data.token);
      navigation.navigate(''home'', { user: response.data });

    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data && error.response.data.error) {
        Alert.alert('Error', error.response.data.error);
      } else if (error.request) {
        Alert.alert('Error', 'No response from server. Check your network or API URL.');
      } else {
        Alert.alert('Error', `Unexpected error: ${error.message}`);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={bgLogin} resizeMode="cover" style={{ flex: 1, justifyContent: 'center' }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('inicioScreen')}>
            <Image style={styles.arrow} source={arrow} />
          </TouchableOpacity>
          <Text style={styles.headerText}> Bienvenido de vuelta</Text>
        </View>
        <View style={styles.picView}>
          <Image style={styles.logPic} source={loginPic} />
        </View>
        <View style={{ flex: 4 }}>
          <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TextInput style={styles.input} onChangeText={setMail} value={mail} placeholder="Ingrese su email" autoCapitalize="none" keyboardType="email-address" />
            <TextInput style={styles.input} onChangeText={setContraseña} value={contraseña} placeholder="Ingrese su contraseña" secureTextEntry />
            <StatusBar style='dark' />
            <TouchableOpacity style={[styles.btnView, { opacity: loading ? 0.6 : 1 }]} onPress={handleLogin} disabled={loading}>
              <Text style={{ textAlign: 'center', color: '#ffffff' }}>{loading ? 'Ingresando...' : 'Ingresar'}</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
          <View style={styles.bottomSection}>
            <Text style={{ fontSize: 15 }}>
              No tienes cuenta?{' '}
              <Pressable onPress={() => navigation.navigate('signUpScreen')}>
                <Text style={{ color: '#642684', fontSize: 15, textDecorationLine: 'underline' }}>Crear cuenta</Text>
              </Pressable>
            </Text>
            <View style={styles.redes}>
              <Text style={{ fontSize: 15, textAlign: 'center', marginBottom: 10 }}>O continua con </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                <Image style={{ width: 30, height: 30 }} source={{ uri: 'https://cdn.iconscout.com/icon/free/png-512/free-google-logo-icon-download-in-svg-png-gif-file-formats--brands-pack-logos-icons-189824.png?f=webp&w=256' }} />
                <Image style={{ width: 48, height: 48 }} source={{ uri: 'https://static.vecteezy.com/system/resources/previews/042/148/632/non_2x/instagram-logo-instagram-social-media-icon-free-png.png' }} />
                <Image style={{ width: 30, height: 30 }} source={{ uri: 'https://cdn.pixabay.com/photo/2021/06/15/12/51/facebook-6338508_1280.png' }} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>


);
}


const styles = StyleSheet.create({
  header: { flex: 1, marginTop: 60, marginLeft: 20, flexDirection: 'row' },
  redes: { width: 300, height: 150, marginTop: 15 },
  arrow: { resizeMode: 'contain', marginTop: 10, width: 25, height: 25, marginRight: 10, marginLeft: 15 },
  logPic: { resizeMode: 'contain', flex: 7, justifyContent: 'center', marginRight: 10 },
  picView: { flex: 3, justifyContent: 'center', alignItems: 'center', marginBottom: 20, marginTop: 40 },
  headerText: { fontSize: 22, marginTop: 5 },
  btnView: { display: 'flex', justifyContent: 'center', alignContent: 'center', width: 300, borderRadius: 5, marginBottom: 45, backgroundColor: '#642684', height: 45 },
  container: { flex: 2, backgroundColor: 'transparent', alignItems: 'center' },
  input: { height: 45, width: 300, margin: 12, borderWidth: 1, borderRadius: 5, padding: 10, borderColor: '#642684', backgroundColor: 'white' },
  bottomSection: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
