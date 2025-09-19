import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const UserTypeSelector = ({ 
  userType, 
  onUserTypeChange,
  options = [
    { value: 'personal', label: 'Personal' },
    { value: 'empresa', label: 'Empresa' }
  ]
}) => {
  return (
    <View style={styles.tabBar}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => onUserTypeChange(option.value)}
        >
          <Text style={[
            styles.tabText,
            userType === option.value && styles.tabTextActive
          ]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 14,
  },
  tabText: {
    fontSize: 17,
    color: '#999',
    marginHorizontal: 10,
    fontWeight: '500',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    paddingBottom: 3,
  },
  tabTextActive: {
    color: '#642684',
    borderBottomColor: '#642684',
    borderBottomWidth: 2,
  },
});

export default UserTypeSelector;
