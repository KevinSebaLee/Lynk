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
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/api';
import { APP_CONSTANTS } from '../constants/config';
import { useApi } from '../hooks/useApi';
import { Button } from '../components/common';

export default function SignUpScreen() {
  const [mail, setMail] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const signUpPic = require('../../assets/img/signPic.png');
  const arrow = { uri: 'https://cdn-icons-png.flaticon.com/512/154/154630.png' };
  const navigation = useNavigation();
  const { login } = useAuth();
  
  // Use the API hook for registration
  const { loading, execute: registerUser } = useApi(ApiService.register);

  const handleRegister = async () => {
    if (!mail || !contraseña || !nombre) {
      Alert.alert('Por favor completa todos los campos.');
      return;
    }
    
    if (contraseña !== confirmarContraseña) {
      Alert.alert('Las contraseñas no coinciden.');
      return;
    }
    
    try {
      const userData = {
        nombre: nombre,
        apellido: apellido,
        email: mail,
        contraseña: contraseña,
        id_pais: APP_CONSTANTS.DEFAULT_COUNTRY_ID,
        id_genero: APP_CONSTANTS.DEFAULT_GENDER_ID,
        id_premium: APP_CONSTANTS.DEFAULT_PREMIUM_ID,
      };
      
      const response = await registerUser(userData);
      
      if (response.token) {
        // Pass user data from registration response to login
        const userDataForCache = response.user || {
          user_nombre: nombre,
          user_apellido: apellido,
          user_email: mail,
          tickets: response.tickets || 0,
          plan_titulo: response.plan_titulo || 'Básico',
          eventosRecientes: response.eventosRecientes || []
        };
        
        await login(response.token, userDataForCache);
      }
    } catch (error) {
      // Error is already handled by the ApiService
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
            <Button
              title="Crear cuenta"
              onPress={handleRegister}
              loading={loading}
              style={styles.btnView}
            />
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