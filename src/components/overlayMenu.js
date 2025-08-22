import React from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function OverlayMenu({
  visible,
  onClose,
  onNavigate,
}) {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.menuContainer} activeOpacity={1}>
          <Text style={styles.menuTitle}>Menú</Text>
          
            <>
              <TouchableOpacity style={styles.menuItem} onPress={() => { onNavigate('Home'); onClose(); }}>
                <Ionicons name="home" size={22} color="#642684" style={styles.icon} />
                <Text style={styles.menuText}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { onNavigate('Eventos'); onClose(); }}>
                <Ionicons name="search" size={22} color="#642684" style={styles.icon} />
                <Text style={styles.menuText}>Eventos</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem} onPress={() => { onNavigate('Gestion'); onClose(); }}>
                <Ionicons name="card-outline" size={22} color="#642684" style={styles.icon} />
                <Text style={styles.menuText}>Gestion</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { onNavigate('Agenda'); onClose(); }}>
                <Ionicons name="calendar" size={22} color="#642684" style={styles.icon} />
                <Text style={styles.menuText}>Agenda</Text>
              </TouchableOpacity>
            </>
          
          <TouchableOpacity style={styles.menuItem} onPress={onClose}>
            <Text style={[styles.menuText, { color: '#9a0606' }]}>Cerrar</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

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