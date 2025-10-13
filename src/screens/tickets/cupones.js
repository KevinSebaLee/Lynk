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
  if (typeof status !== 'string') return 'other';
  const normalized = status.toLowerCase().trim();
  return STATUS_KEY_MAP[normalized] || 'other';
};

export default function Cupones() {
  const { esEmpresa, authInitialized } = useAuth();
  const navigation = useNavigation();

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const statusCounts = useMemo(() => {
    const baseCounts = { active: 0, inactive: 0, used: 0, expired: 0, other: 0 };
    return coupons.reduce((acc, coupon) => {
      const key = getStatusKey(coupon?.estado ?? coupon?.status);
      if (typeof acc[key] !== 'number') acc[key] = 0;
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
      if (statusFilter !== 'all' && couponStatus !== statusFilter) return false;
      if (!normalizedQuery) return true;
      const searchableFields = [coupon?.nombre, coupon?.descripcion, coupon?.codigo];
      return searchableFields.some(field =>
        (field || '').toString().toLowerCase().includes(normalizedQuery)
      );
    });
  }, [coupons, statusFilter, searchQuery]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const load = async () => {
        setLoading(true);
        try {
          // Adjust to your actual API method name
            // Example: const data = await ApiService.getCupones();
          const data = await ApiService.getCupones?.();
          if (isActive && Array.isArray(data)) {
            setCoupons(data);
          }
        } catch (e) {
          if (isActive) setError('No se pudieron cargar los cupones');
        } finally {
          if (isActive) setLoading(false);
        }
      };
      load();
      return () => { isActive = false; };
    }, [])
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await ApiService.getCupones?.();
      if (Array.isArray(data)) setCoupons(data);
    } catch (e) {
      setError('Error al refrescar cupones');
    } finally {
      setRefreshing(false);
    }
  }, []);

  if (!authInitialized) {
    return (
      <View style={styles.center}>
        <LoadingSpinner />
      </View>
    );
  }

  const renderStatusFilters = () => (
    <View style={styles.statusRow}>
      {availableStatusOptions.map(opt => {
        const active = opt.key === statusFilter;
        return (
          <TouchableOpacity
            key={opt.key}
            onPress={() => setStatusFilter(opt.key)}
            style={[styles.statusChip, active && styles.statusChipActive]}
          >
            <Text style={[styles.statusChipText, active && styles.statusChipTextActive]}>
              {opt.label}
              {opt.key !== 'all' && statusCounts[opt.key] !== undefined
                ? ` (${statusCounts[opt.key]})` : ''}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={['#642684', '#ffffff']} style={{ flex: 1 }}>
        <ScreenHeader
          title={esEmpresa ? 'Cupones (Empresa)' : 'Cupones'}
          onBack={() => navigation.goBack()}
        />

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#642684" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar..."
            style={styles.searchInput}
            placeholderTextColor="#888"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#642684" />
            </TouchableOpacity>
          )}
        </View>

        {renderStatusFilters()}

        {loading ? (
            <LoadingSpinner />
        ) : error ? (
          <View style={styles.center}>
            <Text>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={filteredCoupons}
            keyExtractor={(item, idx) => item.id?.toString() || String(idx)}
            renderItem={({ item }) => <CouponCard coupon={item} />}
            contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', marginTop: 40 }}>
                No hay cupones
              </Text>
            }
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 12,
    alignItems: 'center',
    height: 42,
    borderWidth: 1,
    borderColor: '#d7cbe6',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#222',
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 12,
    marginTop: 10,
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#eee',
    borderRadius: 18,
    marginRight: 8,
    marginBottom: 8,
  },
  statusChipActive: {
    backgroundColor: '#642684',
  },
  statusChipText: {
    fontSize: 12,
    color: '#333',
  },
  statusChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
});