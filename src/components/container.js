import { View, StyleSheet } from 'react-native';

export default function Container({ children, style }) {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 1000,
    paddingHorizontal: 25,
  },
});