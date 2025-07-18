import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ImageBackground, TouchableOpacity, Platform, StyleSheet, Text, TextInput, View, Image, KeyboardAvoidingView, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/api';
import { useApi } from '../hooks/useApi';
import { Button } from '../components/common';

export default function LogInScreen() {
  const [mail, setMail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const loginPic = require('../../assets/img/login.png');
  const bgLogin = require('../../assets/img/bgLogin.png');
  const arrow = { uri: 'https://cdn-icons-png.flaticon.com/512/154/154630.png' };
  const navigation = useNavigation();
  const { login } = useAuth();
  
  // Use the API hook for login
  const { loading, execute: loginUser } = useApi(ApiService.login);

  const handleLogin = async () => {
    if (!mail || !contraseña) {
      Alert.alert('Por favor ingresa tu email y contraseña.');
      return;
    }
    
    try {
      const response = await loginUser(mail, contraseña);
      
      // Use the AuthContext login function to update authentication state
      await login(response.token);
      
      // The tab navigator will automatically switch to authenticated view
      // No need to manually navigate

    } catch (error) {
      // Error is already handled by the ApiService
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
            <Button
              title="Ingresar"
              onPress={handleLogin}
              loading={loading}
              style={styles.btnView}
            />
          </KeyboardAvoidingView>
          <View style={styles.bottomSectionRow}>
            <Text>
              No tienes cuenta?{' '}
              <Pressable onPress={() => navigation.navigate('signUpScreen')}>
                <Text style={{ color: '#642684', fontSize: 15, textDecorationLine: 'underline' }}>Crear cuenta</Text>
              </Pressable>
            </Text>
            <View style={styles.redes}>
              <Text style={{ fontSize: 15, textAlign: 'center', marginBottom: 10 }}>O continua con </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                <Image style={{ width: 30, height: 30 }} source={{ uri: 'https://cdn.iconscout.com/icon/free/png-512/free-google-logo-icon-download-in-svg-png-gif-file-formats--brands-pack-logos-1.png' }} />
                <Image style={{ width: 48, height: 48 }} source={{ uri: 'https://static.vecteezy.com/system/resources/previews/042/148/632/non_2x/instagram-logo-instagram-social-media-icon-free-png.png' }} />
                <Image style={{ width: 30, height: 30 }} source={{ uri: 'https://cdn.pixabay.com/photo/2021/06/15/12/51/facebook-6338508_1280.png' }} />
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
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
  bottomSectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingBottom: 50,
  },  
});