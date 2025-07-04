import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Button } from 'react-native';
import Header from '../components/header.js';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function Tickets() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#642684', '#ffffff']} style={{ flex: 1 }}>
        <StatusBar style="light" />
        <Header nombre='Kevin' />
        <Text>Tus tickets</Text>
        <Button title="comprar"/>
        <Button title="transferir"/>
        <Button title="canjear"/>
        <Button title="tu ID"/>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 0.6 },
});