import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
const illustration = require('../../assets/img/banner.png');

const PremiumBanner = () => (
  <LinearGradient
    colors={['#642684', '#411956']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.banner}
  >
    <View style={styles.textContainer}>
      <Text style={styles.title}>Crea y gestiona tus eventos con nuestro</Text>
      <Text style={styles.premium}>Plan Premium</Text>
      <Text style={styles.subtitle}>Nuevo ayudante IA</Text>
    </View>
    <Image
      source={illustration}
      style={styles.illustration}
      resizeMode="contain"
      accessible
      accessibilityLabel="Ilustración de gráficos y herramientas"
    />
  </LinearGradient>
);

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 24,
    margin: 18,
    minHeight: 60,
    // Sombra para Android/iOS
    shadowColor: "#735BF2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  textContainer: {
    flex: 1.4,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 1,
    width: 200,
  },
  premium: {
    top: 5,
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitle: {
    color: '#E5DAF7',
    fontSize: 13,
    marginTop: 8,
  },
  illustration: {
    flex: 1,
    height: 100,
    maxWidth: 110,
    marginLeft: 6,
  },
});

export default PremiumBanner;