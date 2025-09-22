import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const CouponDetailCard = ({ 
  coupon, 
  statusInfo, 
  isCopied, 
  onCopyCode, 
  formatDiscount 
}) => {
  return (
    <View style={styles.couponMainCard}>
      <LinearGradient
        colors={['#642684', '#8E44AD']}
        style={styles.couponGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.couponCardHeader}>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
            <Ionicons name={statusInfo.icon} size={16} color="#fff" />
            <Text style={styles.statusText}>{statusInfo.text}</Text>
          </View>
        </View>

        <View style={styles.couponCardBody}>
          <View style={styles.discountSection}>
            <Text style={styles.discountAmount}>
              {formatDiscount(coupon.descuento || coupon.discount)}
            </Text>
            <Text style={styles.discountLabel}>DE DESCUENTO</Text>
          </View>

          <Text style={styles.couponCardTitle}>
            {coupon.nombre || coupon.title || 'Cupón de descuento'}
          </Text>
          <Text style={styles.couponCardDescription}>
            {coupon.descripcion || coupon.description || 'Descuento especial en eventos seleccionados'}
          </Text>
        </View>

        <View style={styles.couponCodeSection}>
          <Text style={styles.codeLabel}>CÓDIGO DEL CUPÓN</Text>
          <TouchableOpacity style={styles.codeContainer} onPress={onCopyCode}>
            <Text style={styles.codeText}>
              {coupon.codigo || coupon.code || 'COUPON123'}
            </Text>
            <Ionicons 
              name={isCopied ? "checkmark" : "copy-outline"} 
              size={20} 
              color="#fff" 
            />
          </TouchableOpacity>
          <Text style={styles.copyHint}>Toca para copiar</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  couponMainCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#642684',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  couponGradient: {
    padding: 24,
  },
  couponCardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  couponCardBody: {
    alignItems: 'center',
    marginBottom: 24,
  },
  discountSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  discountAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  discountLabel: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    opacity: 0.9,
  },
  couponCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  couponCardDescription: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 20,
  },
  couponCodeSection: {
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    opacity: 0.8,
    marginBottom: 8,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    minWidth: 160,
    justifyContent: 'center',
  },
  codeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'monospace',
  },
  copyHint: {
    fontSize: 11,
    color: '#fff',
    opacity: 0.7,
    marginTop: 4,
  },
});

export default CouponDetailCard;