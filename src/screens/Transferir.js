import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Image
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientBackground } from '../components/common';
import ApiService from '../services/api';
import { getToken } from '../utils/Token';
import { jwtDecode } from 'jwt-decode';

const Transferir = ({ navigation }) => {
  const [users, setUsers] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    let isActive = true;
    setLoading(true);

    const fetchUsers = async () => {
      try {
        // Get current user ID from token
        const token = await getToken();
        let userId = null;
        if (token) {
          const decoded = jwtDecode(token);
          userId = decoded.id;
          setCurrentUserId(userId);
        }

        const data = await ApiService.getUsers();
        
        // Filter out current user
        const filteredData = data.filter(u => u.id !== userId);
        
        // Save all filtered users for search functionality
        if (isActive) setAllUsers(filteredData);
        
        // Group users by first letter of name
        processUsers(filteredData);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers({});
        setAllUsers([]);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchUsers();
    return () => { isActive = false; };
  }, []);
  
  // Process users for display, either all or filtered by search
  const processUsers = (userList) => {
    // If search query exists, filter by name
    const filtered = userList.filter(u => {
      if (!searchQuery) return true;
      const fullName = `${u.nombre || ''} ${u.apellido || ''}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    });
    
    // Group by first letter
    const grouped = {};
    filtered.forEach(u => {
      const letter = (u.nombre || '').charAt(0).toUpperCase();
      if (!grouped[letter]) grouped[letter] = [];
      grouped[letter].push(u);
    });
    
    setUsers(grouped);
  };
  
  // Handle search input changes
  const handleSearch = (text) => {
    setSearchQuery(text);
    processUsers(allUsers);
  };
  
  // Handle user selection
  const handleSelectUser = (user) => {
    navigation.navigate('TransferirMonto', { usuario: user });
  };

  // Generate avatar placeholder with user's initials
  const getInitials = (nombre, apellido) => {
    const first = nombre ? nombre.charAt(0).toUpperCase() : '?';
    const last = apellido ? apellido.charAt(0).toUpperCase() : '';
    return last ? `${first}${last}` : first;
  };

  // Generate a random color based on user ID for consistent avatar colors
  const getRandomColor = (id) => {
    const colors = [
      '#642684', '#735BF2', '#8B64BC', '#996FD6', 
      '#A97BD1', '#B58BBF', '#C092E4', '#D5AAED'
    ];
    // Use the ID to select a color, ensuring the same user always gets the same color
    return colors[id % colors.length];
  };

  if (loading) {
    return (
      <GradientBackground colors={['#642684', '#f5f5f8', '#f5f5f8']}>
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#642684" />
          <Text style={styles.loadingText}>Cargando contactos...</Text>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground colors={['#642684', '#f5f5f8', '#f5f5f8']}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transferir Tickets</Text>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#642684" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar contacto..."
              placeholderTextColor="#9385B1"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <Ionicons name="close-circle" size={20} color="#642684" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {/* Favorites section */}
        <View style={styles.favoritesSection}>
          <Text style={styles.favoritesTitle}>Favoritos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.favoritesList}>
            <TouchableOpacity style={styles.addFavoriteButton}>
              <LinearGradient
                colors={['#735BF2', '#642684']}
                style={styles.addButtonGradient}
              >
                <Ionicons name="add" size={24} color="#fff" />
              </LinearGradient>
              <Text style={styles.addButtonText}>Nuevo</Text>
            </TouchableOpacity>
            
            {/* You can add frequent contacts here */}
          </ScrollView>
        </View>
        
        {/* Users List */}
        <ScrollView style={styles.userList}>
          {Object.keys(users).length === 0 && !loading ? (
            <View style={styles.emptyState}>
              <Ionicons name="people" size={50} color="#642684" style={{opacity: 0.5}} />
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'No se encontraron contactos' : 'No hay contactos disponibles'}
              </Text>
            </View>
          ) : (
            Object.keys(users).sort().map((letter) => (
              <View key={letter} style={styles.sectionBox}>
                <Text style={styles.sectionLetter}>{letter}</Text>
                
                {users[letter].map(user => (
                  <TouchableOpacity
                    key={user.id}
                    style={styles.contactRow}
                    onPress={() => handleSelectUser(user)}
                  >
                    {user.pfp ? (
                      <Image source={{uri: user.pfp}} style={styles.avatar} />
                    ) : (
                      <View style={[styles.avatarPlaceholder, { backgroundColor: getRandomColor(user.id) }]}>
                        <Text style={styles.avatarText}>
                          {getInitials(user.nombre, user.apellido)}
                        </Text>
                      </View>
                    )}
                    
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactName}>
                        {user.nombre} {user.apellido || ''}
                      </Text>
                      <Text style={styles.contactAlias}>
                        {user.alias || `ID: ${user.id}`}
                      </Text>
                    </View>
                    
                    <MaterialIcons name="keyboard-arrow-right" size={24} color="#642684" />
                  </TouchableOpacity>
                ))}
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#642684',
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    shadowColor: '#642684',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
  },
  favoritesSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  favoritesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  favoritesList: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  addFavoriteButton: {
    alignItems: 'center',
    marginRight: 16,
  },
  addButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  addButtonText: {
    color: '#642684',
    fontSize: 12,
    fontWeight: '500',
  },
  userList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  emptyStateText: {
    color: '#642684',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  sectionBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#642684',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionLetter: {
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 12,
    color: '#642684',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  contactInfo: {
    flex: 1,
    paddingHorizontal: 14,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  contactAlias: {
    fontSize: 13,
    color: '#888',
  },
});

export default Transferir;