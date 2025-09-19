import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const TransferItem = ({ item }) => {
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

  const formatAmount = (amount) => {
    if (!amount) return '0';
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'transferencia':
        return '#FF6384';
      case 'eventos':
        return '#36A2EB';
      case 'entretenimiento':
        return '#FFCE56';
      case 'compra':
        return '#4BC0C0';
      default:
        return '#999';
    }
  };

  return (
    <View style={styles.transferItem}>
      <View style={styles.transferHeader}>
        <View style={[styles.typeIndicator, { backgroundColor: getTypeColor(item.tipo) }]} />
        <View style={styles.transferInfo}>
          <Text style={styles.transferDescription}>
            {item.descripcion || item.concepto || 'Movimiento'}
          </Text>
          <Text style={styles.transferDate}>
            {formatDate(item.fecha)}
          </Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={[
            styles.transferAmount,
            { color: item.tipo === 'ingreso' ? '#4CAF50' : '#FF5722' }
          ]}>
            {item.tipo === 'ingreso' ? '+' : '-'}{formatAmount(item.monto)}
          </Text>
          <Text style={styles.transferType}>
            {item.tipo || 'Movimiento'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const TransferList = ({ movimientos = [], showAll = false }) => {
  const displayMovements = showAll ? movimientos : movimientos.slice(0, 5);

  const renderItem = ({ item, index }) => (
    <TransferItem key={index} item={item} />
  );

  if (!displayMovements.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay movimientos para mostrar</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={displayMovements}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id || index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
  },
  transferItem: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transferHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  transferInfo: {
    flex: 1,
    marginRight: 12,
  },
  transferDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  transferDate: {
    fontSize: 14,
    color: '#666',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  transferAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  transferType: {
    fontSize: 12,
    color: '#999',
    textTransform: 'capitalize',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default TransferList;
