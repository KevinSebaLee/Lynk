import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SectionHeader = ({ 
  title, 
  onViewAllPress, 
  showViewAll = true,
  viewAllText = "Ver todos",
  style 
}) => {
  return (
    <View style={[styles.headerRow, style]}>
      <Text style={styles.header}>{title}</Text>
      {showViewAll && onViewAllPress && (
        <TouchableOpacity onPress={onViewAllPress}>
          <Text style={styles.viewAllText}>{viewAllText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 9,
    marginTop: 25,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  viewAllText: {
    fontSize: 16,
    color: '#642684',
    fontWeight: '500',
  },
});

export default SectionHeader;
