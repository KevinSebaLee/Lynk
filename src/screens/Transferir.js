import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ApiService from '../services/api';

const Transferencia = ({ navigation }) => {
  const [users, setUsers] = useState({});
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    setLoading(true);
    ApiService.getUsers()
      .then(data => {
        if (!isActive) return;
        const grouped = {};
        data.forEach(u => {
          const letter = (u.nombre || '').charAt(0).toUpperCase();
          if (!grouped[letter]) grouped[letter] = [];
          grouped[letter].push(u);
        });
        setUsers(grouped);
      })
      .catch(() => setUsers({}))
      .finally(() => setLoading(false));
    return () => { isActive = false; };
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingView}>
        <ActivityIndicator size="large" color="#735BF2" />
        <Text style={{marginTop: 12, color: "#735BF2"}}>Cargando contactos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8fa" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={26} color="#735BF2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact List</Text>
      </View>
      <ScrollView>
        <View style={styles.favList}>
          <TouchableOpacity style={styles.favCircle}>
            <Ionicons name="add" size={22} color="#735BF2" />
          </TouchableOpacity>
        </View>
        {Object.keys(users).sort().map((letter) => (
        <View key={letter} style={styles.sectionBox}>
            <Text style={styles.sectionLetter}>{letter}</Text>
            {users[letter].map(u => (
            <TouchableOpacity
                key={u.id}
                style={styles.contactRow}
                onPress={() => {
                setSelected(u.id);
                navigation.navigate("Transferir", { usuario: u });
                }}
            >
                {/* ... */}
            </TouchableOpacity>
            ))}
        </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  loadingView: {
    flex: 1, alignItems: 'center', justifyContent: 'center'
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee"
  },
  headerBtn: {
    marginRight: 10, padding: 6
  },
  headerTitle: {
    fontSize: 20, color: "#735BF2", fontWeight: "bold"
  },
  favList: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  favCircle: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "#f1effb", marginHorizontal: 3
  },
  sectionBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 10,
    marginBottom: 16,
    padding: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },
  sectionLetter: {
    fontWeight: "500", fontSize: 17, marginVertical: 10, marginLeft: 2, color: "#735BF2"
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  avatarPlaceholder: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: "#eee",
    alignItems: "center", justifyContent: "center", marginRight: 10
  },
  contactName: {
    color: "#222", fontWeight: "600", fontSize: 15
  },
  contactAlias: {
    color: "#666", fontSize: 12
  }
};

export default Transferencia;