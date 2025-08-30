import React from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';
import TransferList from '../components/TransferList';

const arrow = { uri: 'https://cdn-icons-png.flaticon.com/512/154/154630.png' };

export default function AllTransfers({ route, navigation }) {
  const { movimientos } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={styles.arrow} source={arrow} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Todas las Transferencias</Text>
      </View>

      <View style={styles.container}>
        <TransferList movimientos={movimientos} showAll={true} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    marginTop: 30,
    marginLeft: 20,
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  arrow: {
    resizeMode: 'contain',
    marginTop: 5,
    width: 25,
    height: 25,
    marginRight: 10,
  },
  headerText: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#151C2A',
  },
});
