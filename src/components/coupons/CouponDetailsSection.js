import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CouponDetailsSection = ({ coupon, isExpired }) => {
  return (
    <View style={styles.detailsSection}>
      <Text style={styles.sectionTitle}>Detalles del Cupón</Text>
      
      <View style={styles.detailsGrid}>
        {coupon.fecha_expiracion && (
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons name="calendar-outline" size={20} color="#642684" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Fecha de Expiración</Text>
              <Text style={[
                styles.detailValue,
                isExpired() && styles.expiredText
              ]}>
                {new Date(coupon.fecha_expiracion).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
          </View>
        )}

        {coupon.min_compra && (
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons name="card-outline" size={20} color="#642684" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Compra Mínima</Text>
              <Text style={styles.detailValue}>${coupon.min_compra}</Text>
            </View>
          </View>
        )}

        <View style={styles.detailItem}>
          <View style={styles.detailIcon}>
            <Ionicons name="storefront-outline" size={20} color="#642684" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Válido en</Text>
            <Text style={styles.detailValue}>
              {coupon.categoria || 'Eventos seleccionados'}
            </Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <View style={styles.detailIcon}>
            <Ionicons name="information-circle-outline" size={20} color="#642684" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Estado</Text>
            <Text style={[styles.detailValue, { color: '#4CAF50' }]}>
              Activo
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  detailsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#151C2A',
    marginBottom: 16,
  },
  detailsGrid: {
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#151C2A',
  },
  expiredText: {
    color: '#FF5722',
  },
});

export default CouponDetailsSection;