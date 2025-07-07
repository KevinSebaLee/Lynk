import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Button } from 'react-native';
import Header from '../components/header.js';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function PremiumGeneral() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#642684', '#ffffff']} style={{ flex: 1 }}>
        <StatusBar style="light" />
        <Header nombre='Kevin' />
        <Text>Aca está todo lo premium</Text>
        <Button title="conseguir beneficios"/>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 0.6 },
});