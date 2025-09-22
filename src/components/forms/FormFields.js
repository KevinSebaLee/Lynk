import React from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const FormField = ({ 
  placeholder, 
  value, 
  onChangeText, 
  multiline = false, 
  keyboardType = 'default',
  maxLength,
  style,
  ...props 
}) => {
  return (
    <TextInput
      style={[styles.input, multiline && { height: 80 }, style]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      keyboardType={keyboardType}
      maxLength={maxLength}
      {...props}
    />
  );
};

const DatePickerField = ({ value, onChange, placeholder = 'Seleccionar fecha' }) => (
  <DateTimePicker
    value={value ? new Date(value) : new Date()}
    mode="date"
    display="default"
    onChange={(event, selectedDate) => {
      if (selectedDate) {
        onChange(selectedDate);
      }
    }}
    style={{ width: '100%' }}
  />
);

const FormRow = ({ children, style }) => {
  return (
    <View style={[styles.row, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#f5f5f8',
    borderRadius: 7,
    padding: 10,
    width: '100%',
    fontSize: 15,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 9,
    width: '100%',
  },
  dateFieldContainer: {
    flex: 1,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateIcon: {
    position: 'absolute',
    right: 10,
  },
});

export { FormField, DatePickerField, FormRow };