import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const CouponCard = ({ coupon, onPress }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'activo':
        return '#4CAF50';
      case 'used':
      case 'usado':
        return '#FF5722';
      case 'expired':
      case 'expirado':
        return '#9E9E9E';
      default:
        return '#2196F3';
    }
  };

  const formatDiscount = (discount) => {
    if (!discount) return '0%';
    return discount.toString().includes('%') ? discount : `${discount}%`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Text style={styles.couponName} numberOfLines={2}>
          {coupon.nombre || 'Cupón sin nombre'}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(coupon.estado) }]}>
          <Text style={styles.statusText}>
            {coupon.estado || 'Activo'}
          </Text>
        </View>
      </View>
      
      <Text style={styles.description} numberOfLines={2}>
        {coupon.descripcion || 'Sin descripción'}
      </Text>
      
      <View style={styles.cardFooter}>
        <View style={styles.discountContainer}>
          <Text style={styles.discountText}>
            {formatDiscount(coupon.descuento)}
          </Text>
          <Text style={styles.discountLabel}>Descuento</Text>
        </View>
        
        <View style={styles.expiryContainer}>
          <Text style={styles.expiryLabel}>Vence:</Text>
          <Text style={styles.expiryDate}>
            {formatDate(coupon.fecha_expiracion)}
          </Text>
        </View>
      </View>
      
      {coupon.codigo && (
        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>Código:</Text>
          <Text style={styles.codeText}>{coupon.codigo}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  couponName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  discountContainer: {
    alignItems: 'center',
  },
  discountText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#642684',
  },
  discountLabel: {
    fontSize: 12,
    color: '#999',
  },
  expiryContainer: {
    alignItems: 'flex-end',
  },
  expiryLabel: {
    fontSize: 12,
    color: '#999',
  },
  expiryDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  codeLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 6,
  },
  codeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#642684',
    flex: 1,
  },
});

export default CouponCard;
