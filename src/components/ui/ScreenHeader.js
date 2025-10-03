import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ScreenHeader = ({ 
  title, 
  onBackPress, 
  onRightPress, 
  rightIcon, 
  rightIconColor = "white",
  titleColor = "white",
  backgroundColor = "transparent",
  rightElement // Add support for custom right element
}) => {
  return (
    <View style={[styles.header, { backgroundColor }]}>
      <TouchableOpacity onPress={onBackPress}>
        <Ionicons name="arrow-back" size={24} color={titleColor} />
      </TouchableOpacity>
      <Text style={[styles.headerText, { color: titleColor }]}>{title}</Text>
      {rightElement ? (
        rightElement
      ) : rightIcon && onRightPress ? (
        <TouchableOpacity onPress={onRightPress}>
          <Ionicons name={rightIcon} size={24} color={rightIconColor} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 30,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 20,
  },
});

export default ScreenHeader;
