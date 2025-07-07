import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

/**
 * Reusable button component with loading state
 */
const Button = ({ 
  title,
  onPress,
  loading = false,
  disabled = false,
  style = {},
  textStyle = {},
  loadingColor = '#ffffff',
  ...props
}) => {
  const isDisabled = disabled || loading;
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        style,
        { opacity: isDisabled ? 0.6 : 1 }
      ]}
      onPress={onPress}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={loadingColor} />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#642684',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Button;