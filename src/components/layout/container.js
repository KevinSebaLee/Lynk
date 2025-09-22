import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

/**
 * Container component provides consistent layout container for app content
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render inside container
 * @param {Object} props.style - Additional styles to apply to container
 * @returns {React.ReactElement} Rendered component
 */
const Container = memo(({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 1000,
    paddingHorizontal: 25,
  },
});

export default Container;