import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  Alert, 
  Dimensions,
  RefreshControl,
  Pressable
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ApiService from '../../services/api';
import { LoadingSpinner } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { ScreenHeader, CouponCard } from '../../components';

const { width } = Dimensions.get('window');

export default function Cupones() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const { esEmpresa } = useAuth();

  const fetchCoupons = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await ApiService.getCoupons();
      
      // Handle different response structures
      let couponData = [];
      if (Array.isArray(response)) {
        couponData = response;
      } else if (response.coupons && Array.isArray(response.coupons)) {
        couponData = response.coupons;
      } else if (response.data && Array.isArray(response.data)) {
        couponData = response.data;
      }

      setCoupons(couponData);
    } catch (err) {
      console.error('Error fetching coupons:', err);
      setError('Error al cargar los cupones');
      setCoupons([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCoupons();
    }, [])
  );

  const handleCouponPress = (coupon) => {
    navigation.navigate('CouponSelected', { coupon });
  };

  const onRefresh = () => {
    fetchCoupons(true);
  };

  if (loading && !refreshing) {
    return (
      <View style={{ flex: 1 }}>
        <LinearGradient colors={['#642684', '#ffffff', '#ffffff']} style={{ flex: 1 }}>
          <SafeAreaView style={styles.container}>
            <ScreenHeader 
              title="Cupones"
              onBackPress={() => navigation.goBack()}
              titleColor="#fff"
            />
            <LoadingSpinner />
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#642684', '#ffffff', '#ffffff']} style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          <ScreenHeader 
            title="Cupones"
            onBackPress={() => navigation.goBack()}
            titleColor="#fff"
            rightElement={esEmpresa ? (
              <TouchableOpacity onPress={() => navigation.navigate('CouponCreate')}>
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            ) : null}
          />

          <ScrollView 
            style={styles.scrollView}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View style={styles.content}>
              <View style={styles.summaryCard}>
                <View style={styles.summaryContent}>
                  <Ionicons name="ticket" size={32} color="#642684" />
                  <View style={styles.summaryText}>
                    <Text style={styles.summaryTitle}>Mis Cupones</Text>
                    <Text style={styles.summarySubtitle}>
                      {coupons.length} cupones disponibles
                    </Text>
                  </View>
                </View>
              </View>

              {error ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle-outline" size={48} color="#FF5722" />
                  <Text style={styles.errorText}>{error}</Text>
                  <TouchableOpacity style={styles.retryButton} onPress={() => fetchCoupons()}>
                    <Text style={styles.retryButtonText}>Reintentar</Text>
                  </TouchableOpacity>
                </View>
              ) : coupons.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="ticket-outline" size={64} color="#ccc" />
                  <Text style={styles.emptyTitle}>No tienes cupones</Text>
                  <Text style={styles.emptySubtitle}>
                    Los cupones que obtengas aparecerán aquí
                  </Text>
                </View>
              ) : (
                <View style={styles.couponsContainer}>
                  {coupons.map((coupon, index) => (
                    <CouponCard
                      key={coupon.id || index}
                      coupon={coupon}
                      onPress={handleCouponPress}
                    />
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
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
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    marginLeft: 15,
    flex: 1,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#18193f',
  },
  summarySubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  couponsContainer: {
    gap: 15,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#18193f',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  errorText: {
    fontSize: 16,
    color: '#FF5722',
    textAlign: 'center',
    marginTop: 16,
  },
  retryButton: {
    backgroundColor: '#642684',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});