import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

const AuthButton = ({ 
  title, 
  onPress, 
  loading = false, 
  disabled = false,
  variant = 'primary', // 'primary' or 'secondary'
  style 
}) => {
  const isPrimary = variant === 'primary';
  
  return (
    <TouchableOpacity 
      style={[
        styles.button,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        (disabled || loading) && styles.disabledButton,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#fff' : '#642684'} />
      ) : (
        <Text style={[
          styles.buttonText,
          isPrimary ? styles.primaryButtonText : styles.secondaryButtonText
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    borderRadius: 5,
    height: 45,
    marginVertical: 5,
  },
  primaryButton: {
    backgroundColor: '#642684',
  },
  secondaryButton: {
    backgroundColor: '#fff',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#fff',
  },
  secondaryButtonText: {
    color: '#642684',
  },
});

export default AuthButton;
