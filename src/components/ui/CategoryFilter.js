import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategorySelect,
  style 
}) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={[styles.categoryScroll, style]}
      contentContainerStyle={styles.categoryScrollContent}
    >
      {categories.map((category, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.categoryChip,
            selectedCategory === category && styles.categoryChipSelected
          ]}
          onPress={() => onCategorySelect(category)}
        >
          <Text style={[
            styles.categoryText,
            selectedCategory === category && styles.categoryTextSelected
          ]}>
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  categoryScroll: {
    marginBottom: 7,
    paddingVertical: 3,
  },
  categoryScrollContent: {
    paddingHorizontal: 11,
  },
  categoryChip: {
    backgroundColor: '#f5f3fa',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 7,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  categoryChipSelected: {
    backgroundColor: '#642684',
    borderColor: '#642684',
  },
  categoryText: {
    fontSize: 14,
    color: '#6e55a3',
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CategoryFilter;
