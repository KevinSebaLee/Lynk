import React, { memo, useCallback } from 'react';
import { Modal, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Menu item component with icon and text
 * 
 * @param {Object} props - Component props
 * @param {string} props.icon - Icon name from Ionicons
 * @param {string} props.text - Menu item text
 * @param {Function} props.onPress - Callback when item is pressed
 * @param {string} [props.color] - Optional text color
 * @returns {React.ReactElement} Rendered component
 */
const MenuItem = memo(({ icon, text, onPress, color = '#222' }) => (
  <TouchableOpacity 
    style={styles.menuItem} 
    onPress={onPress}
    accessibilityRole="menuitem"
    accessibilityLabel={text}
  >
    {icon && (
      <Ionicons name={icon} size={22} color="#642684" style={styles.icon} />
    )}
    <Text style={[styles.menuText, color ? { color } : null]}>{text}</Text>
  </TouchableOpacity>
));

/**
 * OverlayMenu component displays a sliding side menu for navigation
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.visible - Whether the menu is visible
 * @param {Function} props.onClose - Function to call when menu is closed
 * @param {Function} props.onNavigate - Function to call for navigation with route name
 * @returns {React.ReactElement} Rendered component
 */
const OverlayMenu = memo(({ visible, onClose, onNavigate }) => {
  // Memoize navigation handlers to prevent recreating functions on each render
  const navigateTo = useCallback((route) => {
    onNavigate(route);
    onClose();
  }, [onNavigate, onClose]);

  return (
    <Modal 
      animationType="slide" 
      transparent 
      visible={visible} 
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity 
        style={styles.backdrop} 
        activeOpacity={1} 
        onPress={onClose}
        accessibilityLabel="Close menu"
        accessibilityHint="Closes the navigation menu"
      >
        <TouchableOpacity 
          style={styles.menuContainer} 
          activeOpacity={1}
          accessibilityRole="menu"
          accessibilityLabel="Navigation menu"
        >
          <Text style={styles.menuTitle}>Menú</Text>
          
          <MenuItem 
            icon="home" 
            text="Home" 
            onPress={() => navigateTo('Home')} 
          />
          <MenuItem 
            icon="search" 
            text="Eventos" 
            onPress={() => navigateTo('Eventos')} 
          />
          <MenuItem 
            icon="card-outline" 
            text="Gestion" 
            onPress={() => navigateTo('Gestion')} 
          />
          <MenuItem 
            icon="calendar" 
            text="Agenda" 
            onPress={() => navigateTo('Agenda')} 
          />
          
          <MenuItem 
            text="Cerrar" 
            onPress={onClose} 
            color="#9a0606" 
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
});

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  menuContainer: {
    width: 240,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 24,
    elevation: 8,
    borderBottomRightRadius: 16,
    minHeight: '100%',
  },
  menuTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  menuText: {
    fontSize: 18,
    color: '#222',
    marginLeft: 10,
  },
  icon: {
    minWidth: 28,
    textAlign: 'center',
  },
});

export default OverlayMenu;