import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CouponActionButtons = ({ 
  onCopyCode, 
  onUseCoupon, 
  onShowTerms, 
  canUseCoupon, 
  couponStatus,
  isProcessing = false,
}) => {
  return (
    <View style={styles.actionButtons}>
      <TouchableOpacity
        style={[styles.actionButton, styles.secondaryButton]}
        onPress={onCopyCode}
        disabled={isProcessing}
      >
        <Ionicons name="copy-outline" size={20} color="#642684" />
        <Text style={styles.secondaryButtonText}>Copiar Código</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.actionButton, 
          styles.primaryButton,
          (!canUseCoupon || isProcessing) && styles.disabledButton
        ]}
        onPress={onUseCoupon}
        disabled={!canUseCoupon || isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Ionicons 
            name={canUseCoupon ? "ticket" : "close-circle"} 
            size={20} 
            color="#fff" 
          />
        )}
        <Text style={styles.primaryButtonText}>
          {couponStatus === 'usado' ? 'Cupón Usado' : 
           canUseCoupon ? (isProcessing ? 'Aplicando...' : 'Usar Cupón') : 'No Disponible'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.actionButton, styles.secondaryButton]}
        onPress={onShowTerms}
        disabled={isProcessing}
      >
        <Ionicons name="document-text-outline" size={20} color="#642684" />
        <Text style={styles.secondaryButtonText}>Ver términos y condiciones</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#642684',
  },
  secondaryButton: {
    backgroundColor: '#f3f0ff',
    borderWidth: 1,
    borderColor: '#642684',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#642684',
  },
});

export default CouponActionButtons;