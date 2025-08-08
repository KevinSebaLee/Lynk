import React from 'react';
import { View, Image, StyleSheet, StatusBar } from 'react-native';


export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#18193f" />
      <Image
        source={require('../../assets/img/logoWHITE.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#642684',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 180,
  },
});
