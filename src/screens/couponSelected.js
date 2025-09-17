import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Dimensions,
  Clipboard,
  Share,
  Modal
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function CouponSelected() {
  const navigation = useNavigation();
  const route = useRoute();
  const { coupon } = route.params || {};
  const [isCopied, setIsCopied] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  if (!coupon) {
    return (
      <View style={{ flex: 1 }}>
        <LinearGradient colors={['#642684', '#ffffff', '#ffffff']} style={{ flex: 1 }}>
          <SafeAreaView style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerText}>Cupón</Text>
              <View style={{ width: 24 }} />
            </View>
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={64} color="#FF5722" />
              <Text style={styles.errorText}>Cupón no encontrado</Text>
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.backButtonText}>Volver</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'activo':
        return {
          color: '#4CAF50',
          text: 'Activo',
          icon: 'checkmark-circle'
        };
      case 'used':
      case 'usado':
        return {
          color: '#FF5722',
          text: 'Usado',
          icon: 'close-circle'
        };
      case 'expired':
      case 'expirado':
        return {
          color: '#9E9E9E',
          text: 'Expirado',
          icon: 'time'
        };
      default:
        return {
          color: '#2196F3',
          text: 'Disponible',
          icon: 'ticket'
        };
    }
  };

  const statusInfo = getStatusInfo(coupon.estado || coupon.status);

  const formatDiscount = (discount) => {
    if (!discount) return '10%';
    return discount.toString().includes('%') ? discount : `${discount}%`;
  };

  const copyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(coupon.codigo || coupon.code || 'COUPON123');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      Alert.alert('¡Copiado!', 'Código del cupón copiado al portapapeles');
    } catch (error) {
      Alert.alert('Error', 'No se pudo copiar el código');
    }
  };

  const shareCoupon = async () => {
    try {
      const message = `¡Mira este cupón! ${coupon.nombre || 'Cupón de descuento'}\n\nDescuento: ${formatDiscount(coupon.descuento)}\nCódigo: ${coupon.codigo || 'COUPON123'}\n\n¡Descarga Lynk para más cupones!`;
      
      await Share.share({
        message,
        title: 'Compartir Cupón',
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo compartir el cupón');
    }
  };

  const useCoupon = () => {
    if (coupon.estado === 'usado') {
      Alert.alert('Cupón usado', 'Este cupón ya ha sido utilizado');
      return;
    }
    
    if (coupon.estado === 'expirado') {
      Alert.alert('Cupón expirado', 'Este cupón ha expirado y ya no es válido');
      return;
    }

    Alert.alert(
      'Usar Cupón',
      '¿Estás seguro de que quieres usar este cupón? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Usar Cupón',
          style: 'default',
          onPress: () => {
            // Here you would call the API to use the coupon
            Alert.alert('¡Cupón usado!', 'El cupón ha sido aplicado exitosamente');
            navigation.goBack();
          }
        }
      ]
    );
  };

  const isExpired = () => {
    if (!coupon.fecha_expiracion) return false;
    return new Date(coupon.fecha_expiracion) < new Date();
  };

  const canUseCoupon = () => {
    return coupon.estado !== 'usado' && coupon.estado !== 'expirado' && !isExpired();
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#642684', '#ffffff', '#ffffff']} style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Detalles del Cupón</Text>
            <TouchableOpacity onPress={shareCoupon}>
              <Ionicons name="share-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Coupon Card */}
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
                <TouchableOpacity style={styles.codeContainer} onPress={copyToClipboard}>
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

          {/* Details Section */}
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
                  <Text style={[styles.detailValue, { color: statusInfo.color }]}>
                    {statusInfo.text}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Terms and Conditions */}
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
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={copyToClipboard}
        >
          <Ionicons name="copy-outline" size={20} color="#642684" />
          <Text style={styles.secondaryButtonText}>Copiar Código</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton, 
            styles.primaryButton,
            !canUseCoupon() && styles.disabledButton
          ]}
          onPress={useCoupon}
          disabled={!canUseCoupon()}
        >
          <Ionicons 
            name={canUseCoupon() ? "ticket" : "close-circle"} 
            size={20} 
            color="#fff" 
          />
          <Text style={styles.primaryButtonText}>
            {coupon.estado === 'usado' ? 'Cupón Usado' : 
             canUseCoupon() ? 'Usar Cupón' : 'No Disponible'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => setShowTerms(true)}
        >
          <Ionicons name="document-text-outline" size={20} color="#642684" />
          <Text style={styles.secondaryButtonText}>Ver términos y condiciones</Text>
        </TouchableOpacity>
      </View>

      {/* Terms Modal */}
      <Modal
        visible={showTerms}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowTerms(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Términos y Condiciones</Text>
            <TouchableOpacity onPress={() => setShowTerms(false)}>
              <Ionicons name="close" size={24} color="#18193f" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.termsText}>
              {coupon.terminos || `
• Este cupón es válido hasta la fecha de expiración indicada.
• No se puede combinar con otras ofertas o promociones.
• Válido solo para compras que cumplan con el monto mínimo especificado.
• No es transferible ni canjeable por dinero en efectivo.
• La empresa se reserva el derecho de modificar o cancelar esta promoción en cualquier momento.
• Solo válido para compras realizadas a través de la aplicación.
• Limitado a una utilización por usuario.
• No aplica para productos ya en descuento o promoción.
• En caso de devolución, el descuento del cupón será descontado del reembolso.
• Para más información, contacta a nuestro servicio al cliente.
              `.trim()}
            </Text>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.closeModalButton} onPress={() => setShowTerms(false)}>
              <Text style={styles.closeModalButtonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
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
  termsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 100,
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
  actionButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#642684',
  },
  secondaryButton: {
    backgroundColor: '#f3f0ff',
    borderWidth: 1,
    borderColor: '#642684',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#642684',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#FF5722',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#642684',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#18193f',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  termsText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  closeModalButton: {
    backgroundColor: '#642684',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
