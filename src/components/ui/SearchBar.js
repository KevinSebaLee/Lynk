import React from 'react';
import { View, TextInput, Image, StyleSheet } from 'react-native';

const SearchBar = ({ 
  value, 
  onChangeText, 
  placeholder = "Buscar eventos...", 
  style,
  showIcon = true 
}) => {
  return (
    <View style={[styles.searchBar, style]}>
      <TextInput
        style={styles.searchInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#6e55a3"
      />
      {showIcon && (
        <Image 
          source={require('../../../assets/img/icons/comprar.png')} 
          style={styles.searchIcon} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9e1ed',
    borderRadius: 9,
    marginBottom: 6,
    paddingHorizontal: 9,
    height: 38,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#4d3769',
    paddingVertical: 7,
    paddingLeft: 6,
    backgroundColor: 'transparent',
  },
  searchIcon: {
    width: 21,
    height: 21,
    tintColor: '#6e55a3',
    marginLeft: 2,
  },
});

export default SearchBar;
