import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { TouchableOpacity, Platform, StyleSheet, Text, TextInput, View, Image, KeyboardAvoidingView, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API } from '@env';

const API_URL = API || "https://stirring-intense-sheep.ngrok-free.app";

export default function SignUpScreen() {
  const [mail, setMail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(false);
  const signUpPic = require('../../assets/img/signPic.png'); // Adjust path or image if needed
  const arrow = { uri: 'https://cdn-icons-png.flaticon.com/512/154/154630.png' };
  const navigation = useNavigation();
  const { login } = useAuth();

  const handleRegister = async () => {
    if (!mail || !contraseña || !nombre) {
      Alert.alert('Por favor completa todos los campos.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email: mail,
        contraseña: contraseña,
        nombre: nombre,
      }, { timeout: 5000 });
      setLoading(false);

      // Use login from auth context if the response includes a token
      if (response.data.token) {
        await login(response.data.token);
      }
      
      // Navigation will happen automatically due to authentication state change

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
    <View style={{ flex: 1, backgroundColor: '#f6f2ff', justifyContent: 'center' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('inicioScreen')}>
          <Image style={styles.arrow} source={arrow} />
        </TouchableOpacity>
        <Text style={styles.headerText}> Crear una cuenta</Text>
      </View>
      <View style={styles.picView}>
        <Image style={styles.logPic} source={signUpPic} />
      </View>
      <View style={{ flex: 4 }}>
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TextInput style={styles.input} onChangeText={setNombre} value={nombre} placeholder="Nombre" />
          <TextInput style={styles.input} onChangeText={setMail} value={mail} placeholder="Email" autoCapitalize="none" keyboardType="email-address" />
          <TextInput style={styles.input} onChangeText={setContraseña} value={contraseña} placeholder="Contraseña" secureTextEntry />
          <StatusBar style='dark' />
          <TouchableOpacity style={[styles.btnView, { opacity: loading ? 0.6 : 1 }]} onPress={handleRegister} disabled={loading}>
            <Text style={{ textAlign: 'center', color: '#ffffff' }}>{loading ? 'Creando...' : 'Crear cuenta'}</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
        <View style={styles.bottomSection}>
          <Text style={{ fontSize: 15 }}>
            ¿Ya tienes cuenta?{' '}
            <Pressable onPress={() => navigation.navigate('logInScreen')}>
              <Text style={{ color: '#642684', fontSize: 15, textDecorationLine: 'underline' }}>Iniciar sesión</Text>
            </Pressable>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flex: 1, marginTop: 60, marginLeft: 20, flexDirection: 'row' },
  arrow: { resizeMode: 'contain', marginTop: 10, width: 25, height: 25, marginRight: 10, marginLeft: 15 },
  logPic: { resizeMode: 'contain', flex: 7, justifyContent: 'center', marginRight: 10 },
  picView: { flex: 3, justifyContent: 'center', alignItems: 'center', marginBottom: 20, marginTop: 40 },
  headerText: { fontSize: 22, marginTop: 5 },
  btnView: { display: 'flex', justifyContent: 'center', alignContent: 'center', width: 300, borderRadius: 5, marginBottom: 45, backgroundColor: '#642684', height: 45 },
  container: { flex: 2, backgroundColor: 'transparent', alignItems: 'center' },
  input: { height: 45, width: 300, margin: 12, borderWidth: 1, borderRadius: 5, padding: 10, borderColor: '#642684', backgroundColor: 'white' },
  bottomSection: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});