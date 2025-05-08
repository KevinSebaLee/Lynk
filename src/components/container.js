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
    maxWidth: 1200,
    paddingHorizontal: 15,
    paddingVertical: 25,
  },
});