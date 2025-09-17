import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EventDetailRow = ({ icon, title, description }) => {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIconBox}>
        <Ionicons name={icon} size={22} color="#9F4B97" />
      </View>
      <View>
        <Text style={styles.detailTitle}>{title}</Text>
        {description && (
          <Text style={styles.detailDescription}>{description}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailIconBox: {
    backgroundColor: '#f8f2fb',
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  detailDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default EventDetailRow;
