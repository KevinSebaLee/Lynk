import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const EventActionButton = ({ 
  agendado, 
  loadingAgendar, 
  enrollmentEnabled, 
  onPress,
  variant = 'join' // 'join' or 'delete'
}) => {
  const getButtonText = () => {
    if (variant === 'delete') {
      return loadingAgendar ? 'Eliminando...' : 'Eliminar evento';
    }
    
    if (!enrollmentEnabled) {
      return 'INSCRIPCIÓN CERRADA';
    }
    
    if (agendado) {
      return 'UNIDO';
    }
    
    return loadingAgendar ? 'Uniendo...' : 'UNIRME';
  };

  const getButtonStyle = () => {
    if (variant === 'delete') {
      return [styles.joinBtn, styles.deleteBtn];
    }
    
    if (agendado) {
      return [styles.joinBtn, styles.joinBtnUnido];
    }
    
    if (!enrollmentEnabled) {
      return [styles.joinBtn, styles.joinBtnDisabled];
    }
    
    return styles.joinBtn;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={loadingAgendar || (!enrollmentEnabled && variant === 'join')}
    >
      <Text style={[styles.joinBtnText, agendado && styles.joinBtnTextUnido]}>
        {getButtonText()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  joinBtn: {
    backgroundColor: '#642684',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#642684',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 2,
  },
  joinBtnUnido: {
    backgroundColor: '#77c300',
  },
  joinBtnDisabled: {
    backgroundColor: '#ccc',
  },
  deleteBtn: {
    backgroundColor: '#d32f2f',
  },
  joinBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  joinBtnTextUnido: {
    color: '#fff',
  },
});

export default EventActionButton;
