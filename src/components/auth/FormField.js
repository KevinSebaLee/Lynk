import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const FormField = ({ 
  value, 
  onChangeText, 
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  maxLength,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        maxLength={maxLength}
        placeholderTextColor="#999"
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  input: {
    height: 45,
    width: 300,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    borderColor: '#642684',
    backgroundColor: 'white',
    fontSize: 16,
  },
});

export default FormField;
