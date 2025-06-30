import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
const illustration = require('../../assets/img/banner.png');

const { width } = Dimensions.get('window');
const BANNER_PADDING = width * 0.05;
const BANNER_MARGIN = width * 0.028;
const TITLE_FONT_SIZE = Math.max(13, width * 0.033);
const PREMIUM_FONT_SIZE = Math.max(24, width * 0.065);
const SUBTITLE_FONT_SIZE = Math.max(12, width * 0.03);
const ILLUSTRATION_HEIGHT = Math.max(80, width * 0.25);
const ILLUSTRATION_MAX_WIDTH = Math.max(90, width * 0.28);

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
    padding: BANNER_PADDING,
    margin: BANNER_MARGIN,
    marginLeft: BANNER_MARGIN + 3,
    minHeight: ILLUSTRATION_HEIGHT + 10,
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
    fontSize: TITLE_FONT_SIZE,
    fontWeight: '500',
    marginBottom: 1,
    maxWidth: width * 0.55,
  },
  premium: {
    color: '#fff',
    fontSize: PREMIUM_FONT_SIZE,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 6,
  },
  subtitle: {
    color: '#E5DAF7',
    fontSize: SUBTITLE_FONT_SIZE,
    marginTop: 8,
  },
  illustration: {
    flex: 1,
    height: ILLUSTRATION_HEIGHT,
    maxWidth: ILLUSTRATION_MAX_WIDTH,
    marginLeft: 6,
  },
});

export default PremiumBanner;