import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get("window");

/**
 * Reusable gradient background component
 */
const GradientBackground = ({ 
  children,
  colors = ["#642684", "#ffffff", "#ffffff"],
  style = {},
  ...props
}) => {
  return (
    <LinearGradient 
      colors={colors} 
      style={[styles.gradient, style]}
      {...props}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: width,
  },
});

export default GradientBackground;