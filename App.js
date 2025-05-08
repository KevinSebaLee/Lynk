import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Header from './src/components/header.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#642684',
  },
});

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Header nombre='Kevin' />
    </View>
  );
}