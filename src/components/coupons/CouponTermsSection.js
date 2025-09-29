import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CouponTermsSection = () => {
  return (
    <View style={styles.termsSection}>
      <Text style={styles.sectionTitle}>Términos y Condiciones</Text>
      <View style={styles.termsList}>
        <View style={styles.termItem}>
          <Text style={styles.termBullet}>•</Text>
          <Text style={styles.termText}>
            Cupón válido por una sola vez
          </Text>
        </View>
        <View style={styles.termItem}>
          <Text style={styles.termBullet}>•</Text>
          <Text style={styles.termText}>
            No se puede combinar con otras ofertas
          </Text>
        </View>
        <View style={styles.termItem}>
          <Text style={styles.termBullet}>•</Text>
          <Text style={styles.termText}>
            Sujeto a disponibilidad
          </Text>
        </View>
        <View style={styles.termItem}>
          <Text style={styles.termBullet}>•</Text>
          <Text style={styles.termText}>
            No transferible ni reembolsable
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  termsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#151C2A',
    marginBottom: 16,
  },
  termsList: {
    gap: 8,
  },
  termItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  termBullet: {
    fontSize: 16,
    color: '#642684',
    marginRight: 8,
    marginTop: 2,
  },
  termText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    lineHeight: 20,
  },
});

export default CouponTermsSection;