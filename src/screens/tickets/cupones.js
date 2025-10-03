import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ApiService from '../../services/api';
import { LoadingSpinner } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { ScreenHeader, CouponCard } from '../../components';

const STATUS_OPTIONS = [
  { key: 'all', label: 'Todos' },
  { key: 'active', label: 'Activos' },
  { key: 'inactive', label: 'Inactivos' },
  { key: 'used', label: 'Usados' },
  { key: 'expired', label: 'Expirados' },
];

const STATUS_KEY_MAP = {
  active: 'active',
  activo: 'active',
  available: 'active',
  disponible: 'active',
  used: 'used',
  usado: 'used',
  redeemed: 'used',
  expired: 'expired',
  expirado: 'expired',
  inactive: 'inactive',
  inactivo: 'inactive',
  disabled: 'inactive',
};

const getStatusKey = (status) => {
  if (typeof status !== 'string') {
    return 'other';
  }

  const normalized = status.toLowerCase().trim();
  return STATUS_KEY_MAP[normalized] || 'other';
};

export default function Cupones() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const { esEmpresa } = useAuth();

  const statusCounts = useMemo(() => {
    const baseCounts = {
      active: 0,
      inactive: 0,
      used: 0,
      expired: 0,
      other: 0,
    };

    return coupons.reduce((acc, coupon) => {
      const key = getStatusKey(coupon?.estado ?? coupon?.status);
      if (typeof acc[key] !== 'number') {
        acc[key] = 0;
      }
      acc[key] += 1;
      return acc;
    }, { ...baseCounts });
  }, [coupons]);

  const availableStatusOptions = useMemo(() => {
    if ((statusCounts.other || 0) > 0) {
      return [...STATUS_OPTIONS, { key: 'other', label: 'Otros' }];
    }
    return STATUS_OPTIONS;
  }, [statusCounts.other]);

  const filteredCoupons = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return coupons.filter((coupon) => {
      const couponStatus = getStatusKey(coupon?.estado ?? coupon?.status);

      if (statusFilter !== 'all' && couponStatus !== statusFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const searchableFields = [
        coupon?.nombre,
        coupon?.descripcion,
        coupon?.codigo,
      ];

      return searchableFields.some((field) =>
        typeof field === 'string' && field.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [coupons, statusFilter, searchQuery]);

  const handleCouponPress = useCallback((coupon) => {
    navigation.navigate('CouponSelected', { coupon });
  }, [navigation]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const resetFilters = useCallback(() => {
    setStatusFilter('all');
    setSearchQuery('');
  }, []);

  const fetchCoupons = useCallback(async (showRefreshLoader = false) => {
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
  }, []);

  const renderCouponItem = useCallback(
    ({ item }) => (
      <CouponCard
        coupon={item}
        onPress={() => handleCouponPress(item)}
      />
    ),
    [handleCouponPress]
  );

  const keyExtractor = useCallback((item, index) => String(item?.id ?? index), []);

  const hasActiveFilters = statusFilter !== 'all' || searchQuery.trim().length > 0;

  const listHeaderComponent = useMemo(() => (
    <View style={styles.headerContent}>
      <View style={styles.summaryCard}>
        <View style={styles.summaryContent}>
          <Ionicons name="ticket" size={32} color="#642684" />
          <View style={styles.summaryText}>
            <Text style={styles.summaryTitle}>Mis Cupones</Text>
            <Text style={styles.summarySubtitle}>
              {coupons.length === 1
                ? '1 cupón disponible'
                : `${coupons.length} cupones disponibles`}
            </Text>
          </View>
        </View>
        <View style={styles.summaryStatsRow}>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatValue}>{statusCounts.active || 0}</Text>
            <Text style={styles.summaryStatLabel}>Activos</Text>
          </View>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatValue}>{statusCounts.inactive || 0}</Text>
            <Text style={styles.summaryStatLabel}>Inactivos</Text>
          </View>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatValue}>{statusCounts.used || 0}</Text>
            <Text style={styles.summaryStatLabel}>Usados</Text>
          </View>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatValue}>{statusCounts.expired || 0}</Text>
            <Text style={styles.summaryStatLabel}>Expirados</Text>
          </View>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#642684" style={styles.searchIcon} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar por nombre, código o descripción"
          placeholderTextColor="#9c93af"
          style={styles.searchInput}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch}>
            <Ionicons name="close-circle" size={18} color="#b9b2c7" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContainer}>
        {availableStatusOptions.map((option) => {
          const count = option.key === 'all'
            ? coupons.length
            : statusCounts[option.key] || 0;

          return (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.filterChip,
                statusFilter === option.key && styles.filterChipActive,
              ]}
              onPress={() => setStatusFilter(option.key)}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.filterChipText,
                  statusFilter === option.key && styles.filterChipTextActive,
                ]}
              >
                {option.key === 'all'
                  ? `${option.label} (${count})`
                  : `${option.label} (${count})`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  ), [
    availableStatusOptions,
    coupons.length,
    handleClearSearch,
    searchQuery,
    statusCounts,
    statusFilter,
  ]);

  const renderListEmptyComponent = useCallback(() => {
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF5722" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchCoupons()}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="ticket-outline" size={64} color="#ccc" />
        <Text style={styles.emptyTitle}>
          {hasActiveFilters ? 'No encontramos cupones' : 'No tienes cupones aún'}
        </Text>
        <Text style={styles.emptySubtitle}>
          {hasActiveFilters
            ? 'Ajusta los filtros o limpia la búsqueda para ver más cupones.'
            : esEmpresa
              ? 'Crea tu primer cupón para empezar a ofrecer beneficios.'
              : 'Vuelve más tarde para descubrir nuevas promociones.'}
        </Text>
        {hasActiveFilters && (
          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={resetFilters}
          >
            <Text style={styles.clearFiltersButtonText}>Limpiar filtros</Text>
          </TouchableOpacity>
        )}
        {esEmpresa && !hasActiveFilters && (
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('CouponCreate')}
          >
            <Ionicons name="add-circle" size={24} color="#fff" />
            <Text style={styles.createButtonText}>Crear Cupón</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }, [error, esEmpresa, fetchCoupons, hasActiveFilters, navigation, resetFilters]);

  const listFooterComponent = useMemo(() => <View style={styles.listFooter} />, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchCoupons();
    }, [fetchCoupons])
  );

  const onRefresh = useCallback(() => {
    fetchCoupons(true);
  }, [fetchCoupons]);

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
            rightElement={
              esEmpresa ? (
                <TouchableOpacity onPress={() => navigation.navigate('CouponCreate')}>
                  <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
              ) : null
            }
          />

          <FlatList
            data={filteredCoupons}
            keyExtractor={keyExtractor}
            renderItem={renderCouponItem}
            contentContainerStyle={[
              styles.listContent,
              filteredCoupons.length === 0 && styles.listEmptyContent,
            ]}
            ListHeaderComponent={listHeaderComponent}
            ListEmptyComponent={renderListEmptyComponent}
            ListFooterComponent={filteredCoupons.length > 0 ? listFooterComponent : null}
            refreshing={refreshing}
            onRefresh={onRefresh}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
          
          {/* Floating Action Button - TEMP: Visible for all users */}
          {esEmpresa && filteredCoupons.length > 0 && (
            <TouchableOpacity 
              style={styles.fab}
              onPress={() => navigation.navigate('CouponCreate')}
            >
              <Ionicons name="add" size={32} color="#fff" />
            </TouchableOpacity>
          )}
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
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
  summaryStatsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  summaryStat: {
    flexBasis: '50%',
    marginBottom: 12,
  },
  summaryStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#18193f',
  },
  summaryStatLabel: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#18193f',
    paddingVertical: 0,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    marginBottom: 4,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#efe8fb',
    marginRight: 10,
    marginBottom: 10,
  },
  filterChipActive: {
    backgroundColor: '#642684',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  filterChipText: {
    color: '#642684',
    fontWeight: '600',
    fontSize: 13,
  },
  filterChipTextActive: {
    color: '#fff',
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
  clearFiltersButton: {
    backgroundColor: '#efe8fb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 16,
  },
  clearFiltersButtonText: {
    color: '#642684',
    fontWeight: '600',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#642684',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  listContent: {
    paddingBottom: 120,
  },
  listEmptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: 40,
  },
  listFooter: {
    height: 80,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#642684',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});