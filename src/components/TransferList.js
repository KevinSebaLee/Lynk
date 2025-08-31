import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';

const TransferList = ({ movimientos = [], showAll = false }) => {
  const navigation = useNavigation();
  const displayedMovimientos = showAll ? movimientos : movimientos.slice(0, 4);

  const formatDate = (dateString) => {
    try {
      if (!dateString) return '';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return 'Hoy';
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Ayer';
      }

      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const renderTransfer = ({ item }) => {
    if (!item) return null;

    const isReceived = item.monto > 0;
    const amount = isReceived ? `+${Math.abs(item.monto)}` : `-${Math.abs(item.monto)}`;
    const amountColor = isReceived ? '#4CAF50' : '#FF5252';
    const formattedDate = formatDate(item.fecha_transaccion);
    const recipientName = item.titulo?.replace('Transfer to ', '') || 'Usuario';

    return (
      <View style={styles.transferItem}>
        <View style={styles.transferInfo}>
          <Text style={styles.transferText}>
            {item.titulo}
          </Text>
          {formattedDate ? (
            <Text style={styles.transferDate}>{formattedDate}</Text>
          ) : null}
        </View>
        <View style={styles.rightContent}>
          {item.categoria_nombre && (
            <Text style={styles.categoryText}>{item.categoria_nombre}</Text>
          )}
          <Text style={[styles.transferAmount, { color: amountColor }]}>
            {amount}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, !showAll && { maxHeight: 'auto' }]}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{showAll ? 'Todas las Transferencias' : 'Últimas Transferencias'}</Text>
        <View style={styles.headerLine} />
      </View>

      {showAll ? (
        // Use FlatList in full screen mode
        <FlatList
          data={displayedMovimientos}
          renderItem={renderTransfer}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay transferencias registradas</Text>
              <Text style={styles.emptySubText}>Tus transferencias aparecerán aquí</Text>
            </View>
          )}
        />
      ) : (
        // Use direct rendering in scrollable parent mode
        <View style={styles.staticListContent}>
          {displayedMovimientos.length > 0 ? (
            displayedMovimientos.map((item, index) => (
              <React.Fragment key={item.id?.toString() || index.toString()}>
                {index > 0 && <View style={styles.separator} />}
                {renderTransfer({ item })}
              </React.Fragment>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay transferencias registradas</Text>
              <Text style={styles.emptySubText}>Tus transferencias aparecerán aquí</Text>
            </View>
          )}

          {/* Always show the button to ensure it's visible */}
          {movimientos.length > 0 && (
            <TouchableOpacity
              style={styles.viewMoreButton}
              onPress={() => navigation.navigate('AllTransfers', { movimientos })}
            >
              <Text style={styles.viewMoreText}>Ver todas las transferencias</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FF',
  },
  headerContainer: {
    marginBottom: 24,
  },
  headerLine: {
    height: 3,
    width: 40,
    backgroundColor: '#642684',
    marginTop: 8,
    borderRadius: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#151C2A',
    letterSpacing: 0.5,
  },
  listContent: {
    paddingVertical: 8,
  },
  staticListContent: {
    paddingVertical: 8,
  },
  transferItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginVertical: 6,
    shadowColor: '#642684',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(100, 38, 132, 0.05)',
  },
  transferInfo: {
    flex: 1,
    marginRight: 16,
  },
  transferText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  transferDate: {
    fontSize: 13,
    color: '#757575',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  rightContent: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 12,
    color: '#642684',
    marginBottom: 6,
    fontWeight: '600',
    backgroundColor: '#F0E6F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  transferAmount: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  separator: {
    height: 8,
    backgroundColor: 'transparent',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginVertical: 8,
    shadowColor: '#642684',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyText: {
    color: '#151C2A',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  emptySubText: {
    color: '#757575',
    fontSize: 14,
    fontWeight: '500',
  },
  viewMoreButton: {
    backgroundColor: '#642684',
    padding: 14,
    borderRadius: 16,
    marginTop: 24,
    marginBottom: 20,
    marginHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#642684',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  viewMoreText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default TransferList;
