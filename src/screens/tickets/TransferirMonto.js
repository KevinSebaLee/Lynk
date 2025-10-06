import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientBackground, Button } from '../../components/common';
import ApiService from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { getToken } from '../../utils/Token';

const TransferirMonto = ({ route, navigation }) => {
  const { usuario } = route.params;
  const { userDataCache } = useAuth();
  
  const [ticketAmount, setTicketAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [userTickets, setUserTickets] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [stage, setStage] = useState('input'); // 'input', 'confirm', 'success'
  const [error, setError] = useState(null);

  // Get current user's ID and available tickets
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user data to display available tickets
        const userData = await ApiService.getHomeData();
        if (userData && userData.user) {
          setUserTickets(userData.user.tickets || 0);
        }
        
        // Get current user ID from token
        const token = await getToken();
        if (token) {
          const decoded = jwtDecode(token);
          setCurrentUserId(decoded.id);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        Alert.alert('Error', 'No se pudo obtener la información del usuario');
      }
    };
    
    fetchUserData();
  }, []);

  // Generate avatar placeholder with user's initials
  const getInitials = (nombre, apellido) => {
    const first = nombre ? nombre.charAt(0).toUpperCase() : '?';
    const last = apellido ? apellido.charAt(0).toUpperCase() : '';
    return last ? `${first}${last}` : first;
  };

  // Get random but consistent color based on user ID
  const getRandomColor = (id) => {
    const colors = [
      '#642684', '#735BF2', '#8B64BC', '#996FD6', 
      '#A97BD1', '#B58BBF', '#C092E4', '#D5AAED'
    ];
    return colors[id % colors.length];
  };

  const handleAmountChange = (text) => {
    // Only allow numbers
    if (/^\d*$/.test(text)) {
      setTicketAmount(text);
      setError(null);
    }
  };

  const validateAmount = () => {
    const amount = parseInt(ticketAmount);
    
    if (!ticketAmount || isNaN(amount)) {
      setError('Por favor ingresa una cantidad válida');
      return false;
    }
    
    if (amount <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return false;
    }
    
    if (amount > userTickets) {
      setError('No tienes suficientes tickets disponibles');
      return false;
    }
    
    return true;
  };

  const handleContinue = () => {
    if (!currentUserId) {
      Alert.alert('Error', 'No se pudo identificar tu usuario');
      return;
    }
    
    if (validateAmount()) {
      setStage('confirm');
    }
  };

  const handleConfirm = async () => {
    if (!currentUserId) {
      Alert.alert('Error', 'No se pudo identificar tu usuario');
      return;
    }
    
    try {
      setLoading(true);
      
      // Get current date in the format expected by the backend
      const now = new Date();
      const date = now.toISOString();
      
      await ApiService.transferTickets({
        senderId: currentUserId,
        receiverId: usuario.id,
        tickets: parseInt(ticketAmount),
        date
      });
      
      setStage('success');
    } catch (err) {
      console.error('Transfer error:', err);
      Alert.alert(
        'Error', 
        err.message || 'Hubo un problema al transferir los tickets',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (stage === 'confirm') {
      setStage('input');
    } else {
      navigation.goBack();
    }
  };

  const handleDone = () => {
    navigation.navigate('tickets');
  };

  // Render different content based on the current stage
  const renderContent = () => {
    switch (stage) {
      case 'input':
        return (
          <>
            <View style={styles.userCard}>
              {usuario.pfp ? (
                <Image source={{uri: usuario.pfp}} style={styles.userAvatar} />
              ) : (
                <View style={[styles.userAvatarPlaceholder, { backgroundColor: getRandomColor(usuario.id) }]}>
                  <Text style={styles.userAvatarText}>
                    {getInitials(usuario.nombre, usuario.apellido)}
                  </Text>
                </View>
              )}
              
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {usuario.nombre} {usuario.apellido || ''}
                </Text>
                <Text style={styles.userAlias}>
                  ID: {usuario.id}
                </Text>
              </View>
            </View>
            
            <View style={styles.ticketsInfoCard}>
              <Text style={styles.ticketsInfoTitle}>Tickets disponibles</Text>
              <View style={styles.ticketsRow}>
                <FontAwesome5 name="ticket-alt" size={24} color="#642684" />
                <Text style={styles.ticketsCount}>{userTickets}</Text>
              </View>
            </View>
            
            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>¿Cuántos tickets quieres transferir?</Text>
              
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={ticketAmount}
                  onChangeText={handleAmountChange}
                  placeholder="Cantidad de tickets"
                  keyboardType="number-pad"
                  maxLength={8}
                />
              </View>
              
              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}
              
              <Button
                title="Continuar"
                onPress={handleContinue}
                disabled={!ticketAmount || loading || !currentUserId}
                style={styles.continueButton}
              />
            </View>
          </>
        );
        
      case 'confirm':
        return (
          <View style={styles.confirmContainer}>
            <View style={styles.confirmCard}>
              <Text style={styles.confirmTitle}>Confirma la transferencia</Text>
              
              <View style={styles.confirmDetails}>
                <Text style={styles.confirmLabel}>Destinatario:</Text>
                <Text style={styles.confirmValue}>{usuario.nombre} {usuario.apellido || ''}</Text>
                
                <Text style={styles.confirmLabel}>Cantidad:</Text>
                <View style={styles.ticketsConfirmRow}>
                  <FontAwesome5 name="ticket-alt" size={20} color="#642684" style={{marginRight: 8}} />
                  <Text style={styles.confirmValue}>{ticketAmount} tickets</Text>
                </View>
              </View>
              
              <Text style={styles.confirmWarning}>
                Esta acción no se puede deshacer. Los tickets serán transferidos inmediatamente.
              </Text>
              
              <View style={styles.confirmButtonsContainer}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={handleBack}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <Button
                  title="Confirmar"
                  onPress={handleConfirm}
                  loading={loading}
                  style={styles.confirmButton}
                />
              </View>
            </View>
          </View>
        );
        
      case 'success':
        return (
          <View style={styles.successContainer}>
            <View style={styles.successIconContainer}>
              <LinearGradient
                colors={['#735BF2', '#642684']}
                style={styles.successIconBackground}
              >
                <Ionicons name="checkmark" size={60} color="#fff" />
              </LinearGradient>
            </View>
            
            <Text style={styles.successTitle}>¡Transferencia Exitosa!</Text>
            <Text style={styles.successMessage}>
              Has transferido {ticketAmount} tickets a {usuario.nombre} {usuario.apellido || ''}
            </Text>
            
            <Button
              title="Finalizar"
              onPress={handleDone}
              style={styles.doneButton}
            />
          </View>
        );
    }
  };

  return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={handleBack}
              style={styles.backButton}
              disabled={loading || stage === 'success'}
            >
              <Ionicons name="arrow-back" size={24}  />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {stage === 'input' ? 'Transferir Tickets' : 
               stage === 'confirm' ? 'Confirmar Transferencia' : 'Transferencia Completada'}
            </Text>
          </View>
          
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {renderContent()}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#642684',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userAvatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userAlias: {
    fontSize: 14,
    color: '#777',
  },
  ticketsInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#642684',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  ticketsInfoTitle: {
    fontSize: 16,
    color: '#777',
    marginBottom: 8,
  },
  ticketsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketsCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#642684',
    marginLeft: 8,
  },
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#642684',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 16,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 16,
  },
  input: {
    fontSize: 18,
    height: 50,
    color: '#333',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginBottom: 12,
  },
  continueButton: {
    marginTop: 8,
  },
  confirmContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  confirmCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#642684',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmDetails: {
    marginBottom: 20,
  },
  confirmLabel: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  confirmValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  ticketsConfirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmWarning: {
    fontSize: 14,
    color: '#e67e22',
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#777',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    marginLeft: 8,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successIconBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  doneButton: {
    width: '100%',
  },
});

export default TransferirMonto;