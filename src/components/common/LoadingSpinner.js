import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

/**
 * Reusable loading spinner component
 */
const LoadingSpinner = ({ 
  size = 'large', 
  color = '#642684', 
  style = {},
  containerStyle = {}
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <ActivityIndicator size={size} color={color} style={style} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingSpinner;