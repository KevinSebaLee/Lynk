import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ImageBackground, TouchableOpacity, Platform, StyleSheet, Text, TextInput, View, Image, KeyboardAvoidingView, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API } from '@env';

const API_URL = API;

export default function SignUpScreen() {
  const [mail, setMail] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [loading, setLoading] = useState(false);

  const signPic = require('../../assets/img/signPic.png');
  const bgLogin = require('../../assets/img/bgLogin.png');
  const arrow = { uri: 'https://cdn-icons-png.flaticon.com/512/154/154630.png' };

  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!mail || !contraseña || !nombre || !apellido || !confirmarContraseña) {
      Alert.alert('Por favor ingresa todos los datos.');
      return;
    }
    if (contraseña !== confirmarContraseña) {
      Alert.alert('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/register`, {
        nombre: nombre,
        apellido: apellido,
        email: mail,
        contraseña: contraseña,
        id_pais: 10,
        id_genero: 1,
        id_premium: 1
      }, { timeout: 5000 });
      setLoading(false);
      navigation.navigate('home', { user: response.data });
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
          <Text style={styles.headerText}> Bienvenido a Lynk</Text>
        </View>
        <View style={styles.picView}>
          <Image style={styles.signPic} source={signPic} />
        </View>
        <View style={{ flex: 4 }}>
          <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TextInput style={styles.input} onChangeText={setNombre} value={nombre} placeholder="Ingrese su nombre" />
            <TextInput style={styles.input} onChangeText={setApellido} value={apellido} placeholder="Ingrese su apellido" />
            <TextInput style={styles.input} onChangeText={setMail} value={mail} placeholder="Ingrese su email" autoCapitalize="none" keyboardType="email-address" />
            <TextInput style={styles.input} onChangeText={setContraseña} value={contraseña} placeholder="Ingrese su contraseña" secureTextEntry />
            <TextInput style={styles.input} onChangeText={setConfirmarContraseña} value={confirmarContraseña} placeholder="Confirmar contraseña" secureTextEntry />
            <StatusBar style='dark' />
            <TouchableOpacity style={[styles.btnView, { opacity: loading ? 0.6 : 1 }]} onPress={handleRegister} disabled={loading}>
              <Text style={{ textAlign: 'center', color: '#ffffff' }}>{loading ? 'Registrando...' : 'Ingresar'}</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
          <View style={styles.bottomSection}>
            <Text style={{ fontSize: 15 }}>
              Ya tienes cuenta?{' '}
              <Pressable style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={() => navigation.navigate('logInScreen')}>
                <Text style={{ color: '#642684', fontSize: 15, textDecorationLine: 'underline', paddingTop: 3 }}>Log in</Text>
              </Pressable>
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flex: 1, marginTop: 60, marginLeft: 20, flexDirection: 'row' },
  signPic: { resizeMode: 'cover', width: 250, height: 250 },
  arrow: { resizeMode: 'contain', marginTop: 10, width: 25, height: 25, marginRight: 10, marginLeft: 15 },
  picView: { flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 60, marginTop: 5 },
  headerText: { fontSize: 22, marginTop: 5 },
  btnView: { display: 'flex', justifyContent: 'center', alignContent: 'center', width: 300, borderRadius: 5, marginBottom: 45, backgroundColor: '#642684', height: 45 },
  container: { flex: 2, backgroundColor: 'transparent', alignItems: 'center' },
  input: { height: 45, width: 300, margin: 12, borderWidth: 1, borderRadius: 5, padding: 10, borderColor: '#642684', backgroundColor: 'white' },
  bottomSection: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});