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
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import ApiService from '@/services/api';
import { APP_CONSTANTS } from '@/constants/config';
import { useApi } from '@/hooks/useApi';
import { UserTypeSelector}  from '@/components/auth/UserTypeSelector'
import { AuthFormField as FormField}  from '@/components/auth/FormField'
import { AuthButton } from '@/components/auth/AuthButton';

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
  const signUpPic = require('../../../assets/img/signPic.png');
  const arrow = { uri: 'https://cdn-icons-png.flaticon.com/512/154/154630.png' };
  const navigation = useNavigation();
  const { login } = useAuth();
  const { loading, execute: registerUser } = useApi(ApiService.register);

  const handleRegister = async () => {
    // Validar campos
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
        userData = {
          nombre,
          apellido: null,
          email: mail,
          contraseña,
          id_pais: APP_CONSTANTS.DEFAULT_COUNTRY_ID,
          id_genero: APP_CONSTANTS.DEFAULT_GENDER_ID,
          id_premium: APP_CONSTANTS.DEFAULT_PREMIUM_ID,
          telefono,
          cuil,
          direccion: domicilio,
          esEmpresa: true,
        };
      }

      const response = await registerUser(userData);

      if (response.token) {
        const userDataForCache = {
          user_nombre: nombre,
          user_apellido: userType === 'personal' ? apellido : '',
          user_email: mail,
          tickets: 0,
          plan_titulo: response.user?.plan_titulo || 'Básico',
          eventosRecientes: []
        };
        
        // Login will decode the token and set esEmpresa appropriately
        await login(response.token, userDataForCache);
        
        // Navigation will be handled automatically by the AuthContext and StackHomeNavigator
        // No need to manually navigate here as the auth state change will trigger re-render
      } else {
        console.error('Registration response missing token:', response);
        Alert.alert('Error', 'No se pudo completar el registro. Por favor intente de nuevo.');
      }
    } catch (error) {
      // El error ya es manejado por el handler global
    }
  };

  // Campos condicionales del formulario
  const renderFormFields = () => {
    if (userType === 'personal') {
      return (
        <>
          <FormField
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
          />
          <FormField
            placeholder="Apellido"
            value={apellido}
            onChangeText={setApellido}
          />
          <FormField
            placeholder="Email"
            value={mail}
            onChangeText={setMail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <FormField
            placeholder="Contraseña"
            value={contraseña}
            onChangeText={setContraseña}
            secureTextEntry
          />
          <FormField
            placeholder="Confirmar Contraseña"
            value={confirmarContraseña}
            onChangeText={setConfirmarContraseña}
            secureTextEntry
          />
        </>
      );
    } else {
      return (
        <>
          <FormField
            placeholder="Nombre empresa"
            value={nombre}
            onChangeText={setNombre}
          />
          <FormField
            placeholder="Teléfono"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
          />
          <FormField
            placeholder="Email"
            value={mail}
            onChangeText={setMail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <FormField
            placeholder="CUIL/CUIT"
            value={cuil}
            onChangeText={setCuil}
            keyboardType="numeric"
          />
          <FormField
            placeholder="Domicilio"
            value={domicilio}
            onChangeText={setDomicilio}
          />
          <FormField
            placeholder="Contraseña"
            value={contraseña}
            onChangeText={setContraseña}
            secureTextEntry
          />
          <FormField
            placeholder="Confirmar Contraseña"
            value={confirmarContraseña}
            onChangeText={setConfirmarContraseña}
            secureTextEntry
          />
        </>
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1}}>
      <ImageBackground  resizeMode="cover" style={{ flex: 1, justifyContent: 'center' }}>
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
          <UserTypeSelector 
            userType={userType}
            onUserTypeChange={setUserType}
          />
          <View style={styles.formSection}>
            {renderFormFields()}
            <StatusBar style='dark' />
            <AuthButton
              title="Crear cuenta"
              onPress={handleRegister}
              loading={loading}
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
  bottomSection: {
    display: 'flex',
    alignItems: 'center',    
    gap: 10,
    marginTop: 10,
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
  formSection: {
    alignItems: 'center',
    width: '100%',
  },
  bottomSection: {
    display: 'flex',
    alignItems: 'center',    
    gap: 10,
    marginTop: 10,
  },
  bottomSectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
});
