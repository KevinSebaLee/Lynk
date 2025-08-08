import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ApiService from '../services/api.js';


export default function Register() {
  const navigation = useNavigation();
  const logo = require('../../assets/img/signPic.png');

  // Form states
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmContraseña, setConfirmContraseña] = useState('');
  
  // Business-specific fields
  const [cuil, setCuil] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  
  // Form control states
  const [esEmpresa, setEsEmpresa] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Default IDs (these should ideally come from API)
  const id_pais = 1; // Default country ID
  const id_genero = 1; // Default gender ID
  const id_premium = 1; // Default premium plan ID
  
  const toggleUserType = (isCompany) => {
    setEsEmpresa(isCompany);
    // Reset business fields if switching to personal account
    if (!isCompany) {
      setCuil('');
      setTelefono('');
      setDireccion('');
    }
  };
  
  const validateForm = () => {
    if (!nombre || !email || !contraseña || !confirmContraseña) {
      setError('Por favor complete todos los campos requeridos');
      return false;
    }
    
    // Only validate apellido if not a business
    if (!esEmpresa && !apellido) {
      setError('Por favor complete todos los campos requeridos');
      return false;
    }
    
    if (contraseña !== confirmContraseña) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    
    if (esEmpresa && (!cuil || !telefono || !direccion)) {
      setError('Por favor complete todos los campos de empresa');
      return false;
    }
    
    setError('');
    return true;
  };
  
  const handleRegister = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      const userData = {
        nombre,
        apellido: esEmpresa ? '' : apellido, // Empty string for business
        email,
        contraseña,
        id_pais,
        id_genero,
        id_premium,
        esEmpresa
      };
      
      // Only add business fields if registering as a company
      if (esEmpresa) {
        userData.cuil = cuil;
        userData.telefono = telefono;
        userData.direccion = direccion;
      }
      
      const response = await ApiService.register(userData);
      
      if (response && response.token) {
        // Registration successful
        Alert.alert(
          "Registro exitoso", 
          "Tu cuenta ha sido creada correctamente",
          [{ text: "OK", onPress: () => navigation.navigate('Login') }]
        );
      }
    } catch (err) {
      setError(err.message || 'Error al registrar. Intente nuevamente.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#642684" />
          </TouchableOpacity>
          <Text style={styles.title}>Crear cuenta</Text>
        </View>
        
        {/* Logo Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/img/signPic.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        {/* Account type selection */}
        <View style={styles.accountTypeContainer}>
          <TouchableOpacity 
            style={[styles.accountTypeButton, !esEmpresa && styles.accountTypeSelected]}
            onPress={() => toggleUserType(false)}
          >
            <Text style={[styles.accountTypeText, !esEmpresa && styles.accountTypeTextSelected]}>
              Personal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.accountTypeButton, esEmpresa && styles.accountTypeSelected]}
            onPress={() => toggleUserType(true)}
          >
            <Text style={[styles.accountTypeText, esEmpresa && styles.accountTypeTextSelected]}>
              Empresa
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Basic info fields */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
          />
          
          {/* Only show apellido for personal accounts */}
          {!esEmpresa && (
            <TextInput
              style={styles.input}
              placeholder="Apellido"
              value={apellido}
              onChangeText={setApellido}
            />
          )}
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={contraseña}
            onChangeText={setContraseña}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmar contraseña"
            value={confirmContraseña}
            onChangeText={setConfirmContraseña}
            secureTextEntry
          />
          
          {/* Business-specific fields */}
          {esEmpresa && (
            <>
              <Text style={styles.sectionTitle}>Datos de la empresa</Text>
              <TextInput
                style={styles.input}
                placeholder="CUIL/CUIT"
                value={cuil}
                onChangeText={setCuil}
                keyboardType="number-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="Teléfono"
                value={telefono}
                onChangeText={setTelefono}
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="Dirección"
                value={direccion}
                onChangeText={setDireccion}
              />
            </>
          )}
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <TouchableOpacity 
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.registerButtonText}>Registrarse</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#18193f',
    marginLeft: 10,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 150,
    height: 150,
  },
  accountTypeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#f5f5f8',
    overflow: 'hidden',
  },
  accountTypeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  accountTypeSelected: {
    backgroundColor: '#642684',
  },
  accountTypeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  accountTypeTextSelected: {
    color: '#fff',
  },
  formContainer: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#18193f',
    marginTop: 10,
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#f5f5f8',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  errorText: {
    color: '#d72f5a',
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: '#642684',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#666',
    fontSize: 16,
  },
  loginLink: {
    color: '#642684',
    fontSize: 16,
    fontWeight: '500',
  },
});