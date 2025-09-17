import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const AgendaSection = ({ onPress }) => {
  return (
    <View style={styles.agendaWrapper}>
      <TouchableOpacity onPress={onPress}>
        <Image 
          source={require('../../../assets/img/agenda.png')} 
          style={styles.agendaImage} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  agendaWrapper: {
    alignItems: 'center',
    marginTop: 18,
  },
  agendaImage: {
    width: width * 0.32,
    height: width * 0.32,
  },
});

export default AgendaSection;
