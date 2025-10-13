import React, { memo } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Container from './container';
import { useNavigation } from '@react-navigation/native';
// Pre-require assets for better performance
const hamburgerIcon = require('../../../assets/img/icons/hamburger.png');
const notifIcon = require('../../../assets/img/icons/notif.png');

/**
 * Header component displays the app header with menu button and notification icon
 * 
 * @param {Object} props - Component props
 * @param {string} props.nombre - Title to display in the header
 * @param {Function} props.onHamburgerPress - Callback when hamburger menu is pressed
 * @param {boolean} props.esEmpresa - Si el usuario es empresa o no
 * @returns {React.ReactElement} Rendered component
 */
const Header = memo(({ nombre, onHamburgerPress, esEmpresa }) => {
  const navigation = useNavigation();

  return (
    <Container style={styles.container}>
      <View style={styles.leftSection}>
        <TouchableOpacity 
          onPress={onHamburgerPress}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
        >
          <Image 
            source={hamburgerIcon}
            style={styles.hamburgerIcon}
            fadeDuration={0}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{nombre}</Text>
      </View>

      {/* Solo muestra la campanita si NO es empresa */}
      {!esEmpresa && (
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
            accessibilityRole="button"
            accessibilityLabel="Ver notificaciones"
          >
            <Image
              source={notifIcon}
              style={styles.notificationIcon}
              fadeDuration={0}
            />
          </TouchableOpacity>
        </View>
      )}
    </Container>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 40,
  },
  leftSection: {
    flexDirection: 'row', 
    alignItems: 'center'
  },
  hamburgerIcon: {
    width: 40, 
    height: 40, 
    marginRight: 10
  },
  headerTitle: {
    color: 'white', 
    fontSize: 18
  },
  notificationIcon: {
    width: 30, 
    height: 30
  }
});

export default Header;