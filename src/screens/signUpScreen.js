import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  TouchableOpacity,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  KeyboardAvoidingView,
  Pressable,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API } from '@env';

const API_URL = API || "https://stirring-intense-sheep.ngrok-free.app";

export default function SignUpScreen() {
  const [mail, setMail] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [loading, setLoading] = useState(false);
  const signUpPic = require('../../assets/img/signPic.png');
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
      const response = await axios.post(`${API_URL}/register`, {
        nombre: nombre,
        apellido: apellido,
        email: mail,
        contraseña: contraseña,
        id_pais: 10,
        id_genero: 1,
        id_premium: 1,
      }, { timeout: 5000 });
      setLoading(false);

      if (response.data.token) {
        await login(response.data.token);
      }
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f6f2ff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('inicioScreen')}>
              <Image style={styles.arrow} source={arrow} />
            </TouchableOpacity>
            <Text style={styles.headerText}> Crear una cuenta</Text>
          </View>
          
          <View style={styles.picView}>
            <Image style={styles.logPic} source={signUpPic} />
          </View>
          
          <View style={styles.formSection}>
            <TextInput
              style={styles.input}
              onChangeText={setNombre}
              value={nombre}
              placeholder="Nombre"
            />
            <TextInput
              style={styles.input}
              onChangeText={setApellido}
              value={apellido}
              placeholder="Apellido"
            />
            <TextInput
              style={styles.input}
              onChangeText={setMail}
              value={mail}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              onChangeText={setContraseña}
              value={contraseña}
              placeholder="Contraseña"
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              onChangeText={setConfirmarContraseña}
              value={confirmarContraseña}
              placeholder="Confirmar Contraseña"
              secureTextEntry
            />
            <StatusBar style='dark' />
            <TouchableOpacity
              style={[styles.btnView, { opacity: loading ? 0.6 : 1 }]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={{ textAlign: 'center', color: '#ffffff' }}>
                {loading ? 'Creando...' : 'Crear cuenta'}
              </Text>
            </TouchableOpacity>
            <View style={styles.bottomSection}>
              <Text style={{ fontSize: 15 }}>
                ¿Ya tienes cuenta?{' '}
                <Pressable onPress={() => navigation.navigate('logInScreen')}>
                  <Text style={{ color: '#642684', fontSize: 15, textDecorationLine: 'underline' }}>
                    Iniciar sesión
                  </Text>
                </Pressable>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#f6f2ff',
    paddingBottom: 30,
  },
  header: {
    marginTop: 40,
    marginLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    resizeMode: 'contain',
    width: 25,
    height: 25,
    marginRight: 10,
    marginLeft: 15,
  },
  logPic: {
    resizeMode: 'contain',
    width: '80%',
    height: 220,
  },
  picView: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 30,
  },
  headerText: {
    fontSize: 22,
    marginTop: 5,
  },
  btnView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    borderRadius: 5,
    marginBottom: 45,
    backgroundColor: '#642684',
    height: 45,
    alignSelf: 'center',
  },
  formSection: {
    alignItems: 'center',
    width: '100%',
  },
  input: {
    height: 45,
    width: 300,
    margin: 12,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    borderColor: '#642684',
    backgroundColor: 'white',
  },
  bottomSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
});