import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Platform,
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

const DatePickerField = ({ 
  value, 
  onPress, 
  placeholder = 'Seleccionar fecha',
  showPicker,
  onDateChange,
  dateValue 
}) => {
  return (
    <View style={styles.dateFieldContainer}>
      <TouchableOpacity style={[styles.input, styles.dateInput]} onPress={onPress}>
        <Text style={{ color: value ? '#000' : '#999' }}>
          {value || placeholder}
        </Text>
        <Ionicons 
          name="calendar-outline" 
          size={16} 
          color="#642684" 
          style={styles.dateIcon} 
        />
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={dateValue || new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}
    </View>
  );
};

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