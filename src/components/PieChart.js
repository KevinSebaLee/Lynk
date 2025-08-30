import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart as RNPieChart } from 'react-native-chart-kit';

const PieChart = ({ categories }) => {
  console.log('PieChart received categories:', categories);
  
  if (!categories?.length) {
    console.log('No categories provided to PieChart');
    return null;
  }
  
  // Use the data as is, since we're now controlling it better from tickets.js
  const chartData = categories;

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <RNPieChart
        data={chartData.map(category => ({
          name: category.name,
          population: category.tickets,
          color: category.color,
          legendFontColor: '#7F7F7F',
          legendFontSize: 12,
        }))}
        width={screenWidth - 32} // -32 for padding
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default PieChart;
