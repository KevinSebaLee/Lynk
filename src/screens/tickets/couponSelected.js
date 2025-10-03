import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import { DIMENSIONS } from '@/constants';
import { 
  CouponDetailCard, 
  CouponDetailsSection, 
  CouponActionButtons, 
  CouponTermsSection, 
  TermsModal,
  ScreenHeader 
} from '../../components';
import ApiService from '../../services/api';

const { screenWidth: width, screenHeight: height } = DIMENSIONS;

export default function CouponSelected() {
  const navigation = useNavigation();
  const route = useRoute();
  const { coupon, onRedeem } = route.params || {};
  const [isCopied, setIsCopied] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [couponData, setCouponData] = useState(coupon);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setCouponData(coupon);
  }, [coupon]);

  if (!couponData) {
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

  const statusInfo = getStatusInfo(couponData?.estado || couponData?.status);

  const formatDiscount = (discount) => {
    if (!discount) return '10%';
    return discount.toString().includes('%') ? discount : `${discount}%`;
  };

  const copyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(couponData.codigo || couponData.code || 'COUPON123');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      Alert.alert('¡Copiado!', 'Código del cupón copiado al portapapeles');
    } catch (error) {
      Alert.alert('Error', 'No se pudo copiar el código');
    }
  };

  const shareCoupon = async () => {
    try {
      const message = `¡Mira este cupón! ${couponData.nombre || 'Cupón de descuento'}\n\nDescuento: ${formatDiscount(couponData.descuento)}\nCódigo: ${couponData.codigo || 'COUPON123'}\n\n¡Descarga Lynk para más cupones!`;
      
      await Share.share({
        message,
        title: 'Compartir Cupón',
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo compartir el cupón');
    }
  };

  const useCoupon = () => {
    if (couponData.estado === 'usado') {
      Alert.alert('Cupón usado', 'Este cupón ya ha sido utilizado');
      return;
    }
    
    if (couponData.estado === 'expirado') {
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
          onPress: async () => {
            try {
              setIsProcessing(true);
              await ApiService.redeemCoupon(couponData.id || couponData._id);
              setCouponData((prev) => prev ? { ...prev, estado: 'usado' } : prev);
              onRedeem?.({ ...(couponData || {}), estado: 'usado' });
              Alert.alert('¡Cupón usado!', 'El cupón ha sido aplicado exitosamente');
              navigation.goBack();
            } catch (error) {
              const errorMessage = error?.response?.data?.error || error?.message || 'No se pudo usar el cupón.';
              Alert.alert('Error', errorMessage);
            } finally {
              setIsProcessing(false);
            }
          }
        }
      ]
    );
  };

  const isExpired = () => {
    if (!couponData?.fecha_expiracion) return false;
    return new Date(couponData.fecha_expiracion) < new Date();
  };

  const canUseCoupon = () => {
    return couponData?.estado !== 'usado' && couponData?.estado !== 'expirado' && !isExpired();
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#642684', '#ffffff', '#ffffff']} style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          <ScreenHeader 
            title="Detalles del Cupón"
            showBackButton={true}
            onBackPress={() => navigation.goBack()}
            rightIcon="share-outline"
            onRightPress={shareCoupon}
          />

          <ScrollView style={styles.scrollView}>
            <View style={styles.content}>
              {/* Coupon Card */}
              <CouponDetailCard 
                coupon={couponData}
                statusInfo={statusInfo}
                isCopied={isCopied}
                onCopyCode={copyToClipboard}
                formatDiscount={formatDiscount}
              />

              {/* Details Section */}
              <CouponDetailsSection 
                coupon={couponData}
                isExpired={isExpired}
              />

              {/* Terms and Conditions */}
              <CouponTermsSection />
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <CouponActionButtons 
            onCopyCode={copyToClipboard}
            onUseCoupon={useCoupon}
            onShowTerms={() => setShowTerms(true)}
            canUseCoupon={canUseCoupon()}
            couponStatus={couponData?.estado}
            isProcessing={isProcessing}
          />

          {/* Terms Modal */}
          <TermsModal 
            visible={showTerms}
            onClose={() => setShowTerms(false)}
            coupon={couponData}
          />
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
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
});
