import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const EventHostCard = ({ creator }) => {
  if (!creator) return null;

  return (
    <View style={styles.hostContainer}>
      <Text style={styles.hostLabel}>Organizado por</Text>
      <View style={styles.hostCard}>
        <Image 
          source={{ uri: 'https://i.pravatar.cc/120' }} 
          style={styles.hostImage} 
        />
        <View style={styles.hostInfo}>
          <Text style={styles.hostName}>{creator.nombre || 'Organizador'}</Text>
          <Text style={styles.hostRole}>Creador del evento</Text>
        </View>
      </View>
    </View>
  );
};

const EventInviteCard = () => {
  return (
    <View style={styles.inviteContainer}>
      <LinearGradient colors={['#9742CF', '#642684']} style={styles.inviteCard}>
        <View style={styles.inviteContent}>
          <Image 
            source={require('../../../assets/img/icons/comprar.png')} 
            style={styles.inviteImage} 
          />
          <View>
            <Text style={styles.inviteTitle}>¡Invita a tus amigos!</Text>
            <Text style={styles.inviteSubtitle}>Comparte este evento</Text>
          </View>
        </View>
        <Ionicons name="share-outline" size={24} color="#fff" />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  hostContainer: {
    marginBottom: 24,
  },
  hostLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  hostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f2fb',
    borderRadius: 12,
    padding: 14,
  },
  hostImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 14,
  },
  hostInfo: {
    flex: 1,
  },
  hostName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  hostRole: {
    fontSize: 13,
    color: '#777',
  },
  inviteContainer: {
    marginBottom: 16,
  },
  inviteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  inviteContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inviteImage: {
    width: 55,
    height: 55,
    borderRadius: 13,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  inviteTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 3,
  },
  inviteSubtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
});

export { EventHostCard, EventInviteCard };
