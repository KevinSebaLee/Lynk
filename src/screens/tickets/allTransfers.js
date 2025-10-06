import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components';
import TransferList from '@/components/transfers/TransferList';

export default function AllTransfers({ route, navigation }) {
  const { movimientos } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Todas las Transferencias"
        onBackPress={() => navigation.goBack()}
        titleColor="#151C2A"
      />
      <View style={styles.container}>
        <TransferList movimientos={movimientos} showAll={true} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#F8F9FF',
  },
});
