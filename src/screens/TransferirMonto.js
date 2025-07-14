import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TransferirMonto = ({ route, navigation }) => {
  const { usuario } = route.params; // <-- acá recibís el usuario

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transferir Monto</Text>
      <Text style={styles.subtitle}>A:</Text>
      <Text style={styles.userName}>{usuario.nombre} {usuario.apellido}</Text>
      <Text style={styles.userAlias}>Alias: AC: {usuario.id}-{usuario.id_pais}-{usuario.id_genero}</Text>
      {/* Acá podés agregar tu formulario, botón, etc */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: "#fff"
  },
  title: {
    fontSize: 24, fontWeight: 'bold', marginBottom: 16
  },
  subtitle: {
    fontSize: 18, marginBottom: 8
  },
  userName: {
    fontSize: 20, color: "#735BF2", fontWeight: "600", marginBottom: 4
  },
  userAlias: {
    fontSize: 14, color: "#555"
  }
});

export default TransferirMonto;