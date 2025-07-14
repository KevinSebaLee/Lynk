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
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/api';
import { APP_CONSTANTS } from '../constants/config';
import { useApi } from '../hooks/useApi';
import { Button } from '../components/common';

export default function SignUpScreen() {
  const [userType, setUserType] = useState('personal');
  const [mail, setMail] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cuil, setCuil] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const signUpPic = require('../../assets/img/signPic.png');
  const arrow = { uri: 'https://cdn-icons-png.flaticon.com/512/154/154630.png' };
  const navigation = useNavigation();
  const { login } = useAuth();
  const { loading, execute: registerUser } = useApi(ApiService.register);

  const handleRegister = async () => {
    // Validate fields
    if (userType === 'personal') {
      if (!mail || !contraseña || !nombre || !apellido) {
        Alert.alert('Por favor completa todos los campos.');
        return;
      }
      if (contraseña !== confirmarContraseña) {
        Alert.alert('Las contraseñas no coinciden.');
        return;
      }
    } else {
      if (!mail || !contraseña || !nombre || !telefono || !cuil || !domicilio) {
        Alert.alert('Por favor completa todos los campos de empresa.');
        return;
      }
      if (contraseña !== confirmarContraseña) {
        Alert.alert('Las contraseñas no coinciden.');
        return;
      }
    }

    try {
      let userData;
      if (userType === 'personal') {
        userData = {
          nombre,
          apellido,
          email: mail,
          contraseña,
          id_pais: APP_CONSTANTS.DEFAULT_COUNTRY_ID,
          id_genero: APP_CONSTANTS.DEFAULT_GENDER_ID,
          id_premium: APP_CONSTANTS.DEFAULT_PREMIUM_ID,
        };
      } else {
        // For "empresa", adapt as per your backend requirements
        userData = {
          nombre,
          telefono,
          email: mail,
          cuil,
          domicilio,
          contraseña,
          id_pais: APP_CONSTANTS.DEFAULT_COUNTRY_ID,
          id_genero: APP_CONSTANTS.DEFAULT_GENDER_ID,
          id_premium: APP_CONSTANTS.DEFAULT_PREMIUM_ID,
        };
      }

      const response = await registerUser(userData);

      if (response.token) {
        const userDataForCache = {
          user_nombre: nombre,
          user_apellido: apellido,
          user_email: mail,
          tickets: 0,
          plan_titulo: response.user?.plan_titulo || 'Básico',
          eventosRecientes: []
        };
        await login(response.token, userDataForCache);
      } else {
        console.error("Registration response missing token:", response);
        Alert.alert("Error", "No se pudo completar el registro. Por favor intente de nuevo.");
      }
    } catch (error) {
      // Already handled by error handler
    }
  };

  // Conditional form fields
  const renderFormFields = () => {
    if (userType === 'personal') {
      return (
        <>
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
        </>
      );
    } else {
      return (
        <>
          <TextInput
            style={styles.input}
            onChangeText={setNombre}
            value={nombre}
            placeholder="Nombre empresa"
          />
          <TextInput
            style={styles.input}
            onChangeText={setTelefono}
            value={telefono}
            placeholder="Teléfono"
            keyboardType="phone-pad"
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
            onChangeText={setCuil}
            value={cuil}
            placeholder="CUIL/CUIT"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            onChangeText={setDomicilio}
            value={domicilio}
            placeholder="Domicilio"
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
        </>
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1}}>
      <ImageBackground source={bgLogin} resizeMode="cover" style={{ flex: 1, justifyContent: 'center' }}>
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

          {/* Only show image if Personal is selected */}
          
            <View style={styles.picView}>
              <Image style={styles.logPic} source={signUpPic} />
            </View>
         

          {/* Tabs */}
          <View style={styles.tabBar}>
            <TouchableOpacity onPress={() => setUserType('personal')}>
              <Text style={[styles.tabText, userType === 'personal' && styles.tabTextActive]}>Personal</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setUserType('empresa')}>
              <Text style={[styles.tabText, userType === 'empresa' && styles.tabTextActive]}>Empresa</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formSection}>
            {renderFormFields()}
            <StatusBar style='dark' />
            <Button
              title="Crear cuenta"
              onPress={handleRegister}
              loading={loading}
              style={styles.btnView}
            />
            <View style={styles.bottomSectionRow}>
  <Text style={{ fontSize: 15 }}>¿Ya tienes cuenta? </Text>
  <Pressable onPress={() => navigation.navigate('logInScreen')}>
    <Text style={{ color: '#642684', fontSize: 15, textDecorationLine: 'underline' }}>
      Iniciar sesión
    </Text>
  </Pressable>
</View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
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
    marginTop:20,
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
    fontSize: 20,
    marginTop: 20,
  },
  btnView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    borderRadius: 5,
    marginBottom: 10,
    margin:10,
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
    margin: 10,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    borderColor: '#642684',
    backgroundColor: 'white',
  },
<<<<<<< HEAD
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 14,
=======
  bottomSection: {
    display: 'flex',
    alignItems: 'center',    
    gap: 10,
>>>>>>> 6ba813d2bfbf32bec7c225ac28decf468e157c56
    marginTop: 10,
  },
  tabText: {
    fontSize: 17,
    color: '#999',
    marginHorizontal: 10,
    fontWeight: '500',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    paddingBottom: 3,
  },
  tabTextActive: {
    color: '#642684',
    borderBottomColor: '#642684',
    borderBottomWidth: 2,
  },
  bottomSectionRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 10,
  marginBottom: 15,
},
});