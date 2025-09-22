import React from 'react';
import { 
  Modal, 
  SafeAreaView, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TermsModal = ({ visible, onClose, coupon }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Términos y Condiciones</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#18193f" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <Text style={styles.termsText}>
            {coupon?.terminos || `
• Este cupón es válido hasta la fecha de expiración indicada.
• No se puede combinar con otras ofertas o promociones.
• Válido solo para compras que cumplan con el monto mínimo especificado.
• No es transferible ni canjeable por dinero en efectivo.
• La empresa se reserva el derecho de modificar o cancelar esta promoción en cualquier momento.
• Solo válido para compras realizadas a través de la aplicación.
• Limitado a una utilización por usuario.
• No aplica para productos ya en descuento o promoción.
• En caso de devolución, el descuento del cupón será descontado del reembolso.
• Para más información, contacta a nuestro servicio al cliente.
            `.trim()}
          </Text>
        </ScrollView>
        
        <View style={styles.modalFooter}>
          <TouchableOpacity style={styles.closeModalButton} onPress={onClose}>
            <Text style={styles.closeModalButtonText}>Entendido</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#18193f',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  termsText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  closeModalButton: {
    backgroundColor: '#642684',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TermsModal;