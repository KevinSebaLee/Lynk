import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ImageBackground, TouchableOpacity, Platform, StyleSheet, Text, View, Image, KeyboardAvoidingView, Alert, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import ApiService from '@/services/api';
import { useApi } from '@/hooks/useApi';
import { FormField, AuthButton } from '@/components';

export default function LogInScreen() {
  const [mail, setMail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const loginPic = require('../../../assets/img/login.png');
  const bgLogin = require('../../../assets/img/bgLogin.png');
  const arrow = { uri: 'https://cdn-icons-png.flaticon.com/512/154/154630.png' };
  const navigation = useNavigation();
  const { login } = useAuth();

  const { loading, execute: loginUser } = useApi(ApiService.login);

  const handleLogin = async () => {
    if (!mail || !contraseña) {
      Alert.alert('Por favor ingresa tu email y contraseña.');
      return;
    }

    try {
      const response = await loginUser(mail, contraseña);

      await login(response.token);
    } catch (error) {
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
            <FormField
              value={mail}
              onChangeText={setMail}
              placeholder="Ingrese su email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <FormField
              value={contraseña}
              onChangeText={setContraseña}
              placeholder="Ingrese su contraseña"
              secureTextEntry={true}
            />
            <StatusBar style='dark' />
            <AuthButton
              title="Ingresar"
              onPress={handleLogin}
              loading={loading}
            />
          </KeyboardAvoidingView>
          <View style={styles.bottomSectionRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 15 }}>No tienes cuenta? </Text>
              <Pressable onPress={() => navigation.navigate('signUpScreen')}>
                <Text style={{ color: '#642684', fontSize: 15, textDecorationLine: 'underline' }}>Crear cuenta</Text>
              </Pressable>
            </View>
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
  container: { flex: 2, backgroundColor: 'transparent', alignItems: 'center' },
  bottomSectionRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingBottom: 0,
  },
});
