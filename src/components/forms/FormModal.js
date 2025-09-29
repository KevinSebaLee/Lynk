import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Animated,
  Dimensions,
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const FormModal = ({ 
  visible, 
  onClose, 
  title, 
  children, 
  translateY,
  onSubmit,
  submitText = 'Guardar',
  isLoading = false 
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="none"
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.animatedCard,
            { transform: [{ translateY: translateY }] }
          ]}
        >
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={24} color="#222" />
          </TouchableOpacity>
          
          <View style={styles.card}>
            <Text style={styles.header}>{title}</Text>
            
            <ScrollView 
              style={styles.scrollContainer} 
              contentContainerStyle={styles.scrollContent}
            >
              {children}
              
              <TouchableOpacity 
                style={[styles.submitBtn, isLoading && styles.disabledBtn]} 
                onPress={onSubmit}
                disabled={isLoading}
              >
                <Text style={styles.submitBtnText}>
                  {isLoading ? 'Cargando...' : submitText}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(80, 60, 110, 0.18)',
    justifyContent: 'flex-end',
  },
  animatedCard: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: width,
    maxHeight: height * 0.87,
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  card: {
    padding: 22,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    right: 14,
    top: 14,
    zIndex: 10,
    padding: 4,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 13,
    color: '#18193f',
  },
  scrollContainer: {
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  submitBtn: {
    backgroundColor: '#642684',
    borderRadius: 8,
    paddingVertical: 14,
    width: '100%',
    marginTop: 12,
  },
  disabledBtn: {
    backgroundColor: '#ccc',
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default FormModal;